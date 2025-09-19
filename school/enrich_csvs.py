import csv
import os
import re
import sys
import time
import html
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Any, Dict, Iterable, List, Optional, Tuple

# Columns to enrich (must match those created earlier)
TARGET_COLUMNS = [
	"Fee Structure",
	"Basic Infomation",
	"Contact Details",
	"FAQ",
	"Admission Details",
	"Other Key Infomation",
	"School Infrastructure Details",
	"Co-Curricular Activities",
	"Travel Infomation",
	"Review",
	"Summary",
]

USER_AGENT = (
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
	"AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Safari/537.36"
)

FETCH_TIMEOUT_S = 15
MAX_WORKERS = 6
PER_REQUEST_DELAY_S = 0.5

SECTION_KEYWORDS = {
	"Fee Structure": ["fee", "fees", "tuition", "annual fee", "admission fee"],
	"Admission Details": ["admission", "admissions", "apply", "registration", "eligibility"],
	"FAQ": ["faq", "q&a", "frequently asked"],
	"School Infrastructure Details": [
		"infrastructure",
		"facility",
		"facilities",
		"campus",
		"laboratory",
		"laboratories",
		"library",
		"sports",
		"transport",
	],
	"Co-Curricular Activities": ["co-curricular", "extra-curricular", "activities", "club", "clubs", "arts", "music", "dance", "drama"],
	"Review": ["testimonial", "testimonials", "review", "parent speaks", "what parents say"],
}

LINK_HINTS = {
	"Fee Structure": ["fee", "fees", "tuition"],
	"Admission Details": ["admission", "admissions", "apply", "registration"],
	"FAQ": ["faq"],
	"School Infrastructure Details": ["infrastructure", "facilities", "facility", "campus"],
	"Co-Curricular Activities": ["activities", "co-curricular", "extra-curricular", "clubs"],
	"Review": ["testimonial", "review"],
}


def normalize_url(url: str) -> Optional[str]:
	if not url:
		return None
	url = url.strip()
	if not url:
		return None
	if not re.match(r"^https?://", url, flags=re.I):
		url = "http://" + url
	try:
		parsed = urllib.parse.urlparse(url)
		if not parsed.netloc:
			return None
		return urllib.parse.urlunparse(parsed)
	except Exception:
		return None


def fetch_url_text(url: str) -> Optional[str]:
	try:
		req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
		with urllib.request.urlopen(req, timeout=FETCH_TIMEOUT_S) as resp:
			if resp.getcode() != 200:
				return None
			ct = resp.headers.get("Content-Type", "")
			if "text" not in ct and "html" not in ct:
				return None
			data = resp.read()
			# Limit to a reasonable size
			data = data[:800_000]
			text = data.decode("utf-8", errors="ignore")
			return text
	except Exception:
		return None
	finally:
		time.sleep(PER_REQUEST_DELAY_S)


def strip_html_get_text(html_text: str) -> str:
	# Remove scripts/styles, tags, collapse whitespace
	html_text = re.sub(r"(?is)<script[^>]*>.*?</script>", " ", html_text)
	html_text = re.sub(r"(?is)<style[^>]*>.*?</style>", " ", html_text)
	text = re.sub(r"(?is)<[^>]+>", " ", html_text)
	text = html.unescape(text)
	text = re.sub(r"\s+", " ", text).strip()
	return text


def extract_snippet(text: str, keywords: Iterable[str], max_chars: int = 450) -> str:
	if not text:
		return ""
	text_l = text.lower()
	best_idx = -1
	for kw in keywords:
		idx = text_l.find(kw.lower())
		if idx != -1 and (best_idx == -1 or idx < best_idx):
			best_idx = idx
	if best_idx == -1:
		return ""
	start = max(0, best_idx - 180)
	end = min(len(text), best_idx + max_chars)
	snippet = text[start:end]
	return snippet.strip()


def find_internal_links(html_text: str, base_url: str, hint_keywords: Iterable[str]) -> List[str]:
	links: List[str] = []
	for m in re.finditer(r"(?is)<a[^>]+href=\"([^\"]+)\"[^>]*>(.*?)</a>", html_text):
		href = m.group(1)
		anchor = strip_html_get_text(m.group(2))[:120].lower()
		if any(h in anchor for h in hint_keywords) or any(h in href.lower() for h in hint_keywords):
			full = urllib.parse.urljoin(base_url, href)
			links.append(full)
	# Deduplicate
	seen = set()
	uniq: List[str] = []
	for u in links:
		if u not in seen:
			uniq.append(u)
			seen.add(u)
	return uniq[:6]


def enrich_from_website(base_url: str) -> Dict[str, str]:
	result: Dict[str, str] = {}
	base = normalize_url(base_url)
	if not base:
		return result

	html_home = fetch_url_text(base)
	if not html_home:
		return result
	text_home = strip_html_get_text(html_home)

	# Try to extract from homepage first
	for col, kws in SECTION_KEYWORDS.items():
		if col in ("Review",):
			continue
		val = extract_snippet(text_home, kws)
		if val:
			result[col] = val

	# Follow likely internal links per section
	for col, hints in LINK_HINTS.items():
		if result.get(col):
			continue
		candidates = find_internal_links(html_home, base, hints)
		for link in candidates:
			page_html = fetch_url_text(link)
			if not page_html:
				continue
			text = strip_html_get_text(page_html)
			val = extract_snippet(text, SECTION_KEYWORDS.get(col, hints))
			if val:
				result[col] = val
				break

	# Build summary from whatever we found
	if result and not result.get("Summary"):
		keys = [k for k in [
			"Admission Details",
			"Fee Structure",
			"School Infrastructure Details",
			"Co-Curricular Activities",
			"FAQ",
		] if result.get(k)]
		if keys:
			result["Summary"] = " | ".join([f"has {k.lower()}" for k in keys])

	return result


def process_file(path: str, max_rows: Optional[int]) -> Tuple[str, int, int]:
	with open(path, "r", encoding="utf-8-sig", newline="") as f:
		reader = csv.DictReader(f)
		rows = list(reader)
		fieldnames = reader.fieldnames or []

	# Ensure target columns exist
	for col in TARGET_COLUMNS:
		if col not in fieldnames:
			fieldnames.append(col)

	def needs_enrichment(row: Dict[str, Any]) -> bool:
		for col in ("Fee Structure", "Admission Details", "School Infrastructure Details", "Co-Curricular Activities", "FAQ", "Review"):
			if row.get(col):
				return False
		return True

	indices = list(range(len(rows)))
	if max_rows is not None:
		indices = indices[:max_rows]

	# Prepare tasks
	tasks: List[Tuple[int, str]] = []
	for i in indices:
		row = rows[i]
		if not needs_enrichment(row):
			continue
		website = (row.get("website") or row.get("Website") or "").strip()
		if not website:
			continue
		url = normalize_url(website)
		if not url:
			continue
		tasks.append((i, url))

	updated = 0
	if tasks:
		with ThreadPoolExecutor(max_workers=MAX_WORKERS) as ex:
			futures = {ex.submit(enrich_from_website, url): idx for idx, url in tasks}
			for fut in as_completed(futures):
				idx = futures[fut]
				try:
					data = fut.result()
				except Exception:
					data = {}
				if data:
					for k, v in data.items():
						rows[idx][k] = v
					updated += 1

	# Write back
	tmp_path = path + ".tmp"
	with open(tmp_path, "w", encoding="utf-8-sig", newline="") as f:
		writer = csv.DictWriter(f, fieldnames=fieldnames)
		writer.writeheader()
		for r in rows:
			writer.writerow(r)
	os.replace(tmp_path, path)

	return os.path.basename(path), len(rows), updated


def main() -> int:
	if len(sys.argv) < 2:
		print("Usage: python3 enrich_csvs.py <csv_dir> [--max-per-file N]")
		return 2
	dir_path = sys.argv[1]
	max_rows: Optional[int] = None
	if len(sys.argv) > 2 and sys.argv[2] == "--max-per-file" and len(sys.argv) > 3:
		try:
			max_rows = int(sys.argv[3])
		except Exception:
			max_rows = None

	files = [
		os.path.join(dir_path, name)
		for name in sorted(os.listdir(dir_path))
		if name.lower().endswith(".csv") and os.path.isfile(os.path.join(dir_path, name))
	]
	if not files:
		print("No CSV files found in directory.")
		return 0

	for p in files:
		name, total, upd = process_file(p, max_rows)
		print(f"{name}: rows={total}, updated={upd}")
		# brief politeness delay between files
		time.sleep(2.0)

	print("Done.")
	return 0


if __name__ == "__main__":
	sys.exit(main())
