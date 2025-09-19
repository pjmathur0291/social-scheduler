import json
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple


OVERPASS_ENDPOINTS = [
	"https://overpass-api.de/api/interpreter",
	"https://overpass.kumi.systems/api/interpreter",
	"https://overpass.openstreetmap.fr/api/interpreter",
	"https://overpass.openstreetmap.ru/api/interpreter",
]


def build_overpass_query() -> str:
	# Target the administrative area of Mumbai (also known as Greater Mumbai / Brihanmumbai)
	# and fetch all objects tagged amenity=school within that area.
	# Use out center so ways/relations have a center lat/lon for mapping/display.
	# Also include alternative area names and Wikidata IDs to improve coverage.
	# We search for:
	# - name in {Mumbai, Greater Mumbai, Brihanmumbai}
	# - Mumbai Suburban district and Mumbai City district
	# - wikidata QIDs: Q1156 (Mumbai), Q2085494 (Mumbai Suburban), Q2341660 (Mumbai City)
	return (
		"[out:json][timeout:240];\n"
		"(\n"
		"  area[\"boundary\"=\"administrative\"][\"name\"~\"^(Mumbai|Greater Mumbai|Brihanmumbai)$\",i];\n"
		"  area[\"boundary\"=\"administrative\"][\"name\"~\"^Mumbai (Suburban|City)$\",i];\n"
		"  area[\"wikidata\"~\"^(Q1156|Q2085494|Q2341660)$\"];\n"
		")->.a;\n"
		"(\n"
		"  node[\"amenity\"=\"school\"](area.a);\n"
		"  way[\"amenity\"=\"school\"](area.a);\n"
		"  relation[\"amenity\"=\"school\"](area.a);\n"
		");\n"
		"out center tags;\n"
		">;\n"
		"out skel qt;\n"
	)


def http_post_raw(url: str, body: str, timeout: int = 180) -> Tuple[int, str]:
	data = body.encode("utf-8")
	req = urllib.request.Request(url, data=data)
	# Overpass accepts raw query body; explicit content-type is not strictly required, but set it for clarity
	req.add_header("Content-Type", "text/plain; charset=utf-8")
	with urllib.request.urlopen(req, timeout=timeout) as resp:
		status = resp.getcode()
		text = resp.read().decode("utf-8", errors="replace")
		return status, text


def fetch_overpass_json(query: str) -> Dict[str, Any]:
	last_err: Optional[Exception] = None
	for idx, endpoint in enumerate(OVERPASS_ENDPOINTS):
		try:
			status, text = http_post_raw(endpoint, query, timeout=240)
			if status == 200:
				return json.loads(text)
			else:
				last_err = RuntimeError(f"HTTP {status} from {endpoint}")
		except Exception as e:  # noqa: BLE001 - surface any failure
			last_err = e
			# brief backoff before next endpoint
			time.sleep(1.5 * (idx + 1))
	if last_err:
		raise last_err
	return {}


def _first_nonempty(*values: Optional[str]) -> str:
	for v in values:
		if v and str(v).strip():
			return str(v).strip()
	return ""


def _join_semicolon(values: List[str]) -> str:
	# Deduplicate and normalize ; - separated multi-values
	parts: List[str] = []
	for v in values:
		if not v:
			continue
		for p in str(v).replace(" ", "").split(";"):
			if p and p not in parts:
				parts.append(p)
	return ", ".join(parts)


def to_school_row(el: Dict[str, Any]) -> Dict[str, Any]:
	etype = el.get("type", "")
	eid = el.get("id")
	tags: Dict[str, str] = el.get("tags", {}) or {}
	name = tags.get("name", "")

	lat: Optional[float] = None
	lon: Optional[float] = None
	if "lat" in el and "lon" in el:
		lat = float(el["lat"])  # node
		lon = float(el["lon"])
	elif "center" in el and isinstance(el["center"], dict):
		lat = float(el["center"].get("lat"))
		lon = float(el["center"].get("lon"))

	# Address composition
	housenumber = tags.get("addr:housenumber", "")
	street = tags.get("addr:street", "")
	suburb = _first_nonempty(tags.get("addr:suburb"), tags.get("addr:neighbourhood"), tags.get("addr:locality"))
	city = _first_nonempty(tags.get("addr:city"), tags.get("is_in:city"))
	state = tags.get("addr:state", "")
	postcode = tags.get("addr:postcode", "")
	addr_parts = [
		" ".join([p for p in [housenumber, street] if p]).strip(),
		suburb,
		city,
		state,
		postcode,
	]
	address = ", ".join([p for p in addr_parts if p])

	phone = _join_semicolon([
		tags.get("contact:phone", ""),
		tags.get("contact:mobile", ""),
		tags.get("phone", ""),
	])
	website = _first_nonempty(tags.get("contact:website"), tags.get("website"), tags.get("url"))
	operator = tags.get("operator", "")
	operator_type = tags.get("operator:type", "")
	board = _first_nonempty(tags.get("education:board"), tags.get("board"))
	levels = _first_nonempty(tags.get("isced:level"), tags.get("grades"), tags.get("level"))
	gender = _first_nonempty(tags.get("school:gender"), tags.get("gender"))
	religion = tags.get("religion", "")
	language = _first_nonempty(tags.get("language"), tags.get("medium"), tags.get("medium_of_instruction"))

	osm_url = f"https://www.openstreetmap.org/{etype}/{eid}" if etype and eid is not None else ""

	return {
		"name": name,
		"address": address,
		"phone": phone,
		"website": website,
		"operator": operator,
		"operator_type": operator_type,
		"board": board,
		"levels": levels,
		"gender": gender,
		"religion": religion,
		"language": language,
		"lat": lat,
		"lon": lon,
		"osm_url": osm_url,
	}


def generate_html(schools: List[Dict[str, Any]]) -> str:
	# Inline data for file:// usage convenience
	generated_at = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
	headers = [
		("name", "Name"),
		("address", "Address"),
		("phone", "Phone"),
		("website", "Website"),
		("operator", "Operator"),
		("operator_type", "Operator Type"),
		("board", "Board"),
		("levels", "Levels"),
		("gender", "Gender"),
		("religion", "Religion"),
		("language", "Language"),
		("lat", "Lat"),
		("lon", "Lon"),
		("osm_url", "OSM"),
	]
	# Basic CSS and vanilla JS sorter + filter
	html_template = """
<!DOCTYPE html>
<html lang=\"en\">
<head>
	<meta charset=\"utf-8\" />
	<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
	<title>Mumbai Schools Directory</title>
	<style>
		body {{ font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif; margin: 16px; }}
		h1 {{ margin: 0 0 8px 0; font-size: 22px; }}
		.summary {{ color: #555; margin-bottom: 12px; }}
		.controls {{ display: flex; gap: 12px; align-items: center; margin: 12px 0; flex-wrap: wrap; }}
		input[type=search] {{ padding: 8px 10px; font-size: 14px; width: 320px; max-width: 100%; }}
		.table-wrap {{ overflow: auto; border: 1px solid #e3e3e3; border-radius: 6px; }}
		table {{ border-collapse: collapse; width: 100%; font-size: 14px; }}
		th, td {{ border-bottom: 1px solid #eee; padding: 8px 10px; text-align: left; vertical-align: top; }}
		th {{ position: sticky; top: 0; background: #fafafa; z-index: 1; cursor: pointer; white-space: nowrap; }}
		tr:hover td {{ background: #fcfcff; }}
		.badge {{ display: inline-block; padding: 2px 6px; border-radius: 4px; background: #eef; color: #223; font-size: 12px; }}
		.small {{ color: #666; font-size: 12px; }}
		.count {{ font-weight: 600; }}
		footer {{ margin-top: 16px; color: #666; font-size: 12px; }}
		.osm-link {{ text-decoration: none; color: #06c; }}
		.osm-link:hover {{ text-decoration: underline; }}
	</style>
</head>
<body>
	<h1>Mumbai Schools Directory</h1>
	<div class=\"summary\">
		Showing <span id=\"shown-count\" class=\"count\"></span> of <span id=\"total-count\" class=\"count\"></span> schools.
		<span class=\"small\">Generated __GENERATED_AT__ from OpenStreetMap via Overpass.</span>
	</div>
	<div class=\"controls\">
		<input id=\"search\" type=\"search\" placeholder=\"Search by name, address, board, operator, etc.\" />
		<div class=\"small\">Click a column header to sort.</div>
	</div>
	<div class=\"table-wrap\">
		<table id=\"schools-table\"> 
			<thead>
				<tr>
					__TABLE_HEADERS__
				</tr>
			</thead>
			<tbody></tbody>
		</table>
	</div>
	<script>
		const SCHOOLS = __SCHOOLS_JSON__;
		const headers = __HEADERS_JSON__;
		let currentSort = {{ key: 'name', dir: 'asc' }};

		function normalize(x) {{
			if (x === null || x === undefined) return '';
			return String(x).toLowerCase();
		}}

		function compareValues(a, b, key, dir) {{
			const va = a[key];
			const vb = b[key];
			const na = normalize(va);
			const nb = normalize(vb);
			if (!isNaN(parseFloat(na)) && !isNaN(parseFloat(nb))) {{
				const diff = parseFloat(na) - parseFloat(nb);
				return dir === 'asc' ? diff : -diff;
			}}
			if (na < nb) return dir === 'asc' ? -1 : 1;
			if (na > nb) return dir === 'asc' ? 1 : -1;
			return 0;
		}}

		function renderRows(rows) {{
			const tbody = document.querySelector('#schools-table tbody');
			tbody.innerHTML = '';
			const frag = document.createDocumentFragment();
			for (const r of rows) {{
				const tr = document.createElement('tr');
				function td(text) {{ const d = document.createElement('td'); d.innerHTML = text || ''; return d; }}
				const nameHtml = r.name ? `<strong>${escapeHtml(r.name)}</strong>` : '';
				const addressHtml = r.address ? `${escapeHtml(r.address)}` : '';
				let phoneHtml = '';
				if (r.phone) {{
					const phones = r.phone.split(',').map(p => p.trim()).filter(Boolean);
					phoneHtml = phones.map(p => `<a href=\"tel:${p.replace(/\s+/g,'')}\">${escapeHtml(p)}<\/a>`).join(', ');
				}}
				let websiteHtml = '';
				if (r.website) {{
					const url = r.website.match(/^https?:\/\//i) ? r.website : 'http://' + r.website;
					websiteHtml = `<a href=\"${url}\" target=\"_blank\" rel=\"noopener noreferrer\">${escapeHtml(r.website)}<\/a>`;
				}}
				const osmHtml = r.osm_url ? `<a class=\"osm-link\" href=\"${r.osm_url}\" target=\"_blank\" rel=\"noopener noreferrer\">Open<\/a>` : '';

				tr.appendChild(td(nameHtml));
				tr.appendChild(td(addressHtml));
				tr.appendChild(td(phoneHtml));
				tr.appendChild(td(websiteHtml));
				tr.appendChild(td(escapeHtml(r.operator || '')));
				tr.appendChild(td(escapeHtml(r.operator_type || '')));
				tr.appendChild(td(escapeHtml(r.board || '')));
				tr.appendChild(td(escapeHtml(r.levels || '')));
				tr.appendChild(td(escapeHtml(r.gender || '')));
				tr.appendChild(td(escapeHtml(r.religion || '')));
				tr.appendChild(td(escapeHtml(r.language || '')));
				tr.appendChild(td(r.lat != null ? String(r.lat) : ''));
				tr.appendChild(td(r.lon != null ? String(r.lon) : ''));
				tr.appendChild(td(osmHtml));
				frag.appendChild(tr);
			}
			tbody.appendChild(frag);
			document.getElementById('shown-count').textContent = String(rows.length);
		}}

		function escapeHtml(s) {{
			return String(s)
				.replaceAll('&', '&amp;')
				.replaceAll('<', '&lt;')
				.replaceAll('>', '&gt;')
				.replaceAll('"', '&quot;')
				.replaceAll("'", '&#039;');
		}}

		function update() {{
			const q = normalize(document.getElementById('search').value);
			let rows = SCHOOLS.slice();
			if (q) {{
				rows = rows.filter(r => {{
					const hay = normalize([
						r.name, r.address, r.phone, r.website, r.operator, r.operator_type,
						r.board, r.levels, r.gender, r.religion, r.language
					].filter(Boolean).join(' | '));
					return hay.includes(q);
				}});
			}}
			rows.sort((a,b) => compareValues(a,b,currentSort.key,currentSort.dir));
			renderRows(rows);
		}}

		function initSortHeaders() {{
			const thead = document.querySelector('#schools-table thead');
			thead.addEventListener('click', (ev) => {{
				const th = ev.target.closest('th');
				if (!th) return;
				const key = th.getAttribute('data-key');
				if (!key) return;
				if (currentSort.key === key) {{
					currentSort.dir = currentSort.dir === 'asc' ? 'desc' : 'asc';
				}} else {{
					currentSort.key = key;
					currentSort.dir = 'asc';
				}}
				update();
			}});
		}}

		document.getElementById('total-count').textContent = String(SCHOOLS.length);
		document.getElementById('search').addEventListener('input', update);
		initSortHeaders();
		update();
	</script>
	<footer>
		Data: © OpenStreetMap contributors. This is a derived dataset; accuracy may vary.
	</footer>
</body>
</html>
"""

	header_cells = ''.join([f'<th data-key="{key}">{label}</th>' for key, label in headers])
	schools_json = json.dumps(schools, ensure_ascii=False)
	headers_json = json.dumps(headers)
	html = (
		html_template
		.replace("__GENERATED_AT__", generated_at)
		.replace("__TABLE_HEADERS__", header_cells)
		.replace("__SCHOOLS_JSON__", schools_json)
		.replace("__HEADERS_JSON__", headers_json)
	)
	return html


def main() -> int:
	query = build_overpass_query()
	print("Fetching schools from Overpass...", file=sys.stderr)
	resp = fetch_overpass_json(query)
	if not resp or "elements" not in resp:
		print("No data returned from Overpass.", file=sys.stderr)
		elements: List[Dict[str, Any]] = []
	else:
		elements = resp["elements"]

	schools: List[Dict[str, Any]] = []
	for el in elements:
		if not isinstance(el, dict):
			continue
		row = to_school_row(el)
		if not row.get("name"):
			# Skip nameless entries to keep table useful
			continue
		schools.append(row)

	# Sort by name for stable UX
	schools.sort(key=lambda r: (r.get("name") or "").lower())

	# Save JSON snapshot
	json_path = "mumbai_schools.json"
	with open(json_path, "w", encoding="utf-8") as f:
		json.dump(schools, f, ensure_ascii=False, indent=2)
	print(f"Wrote {len(schools)} schools to {json_path}")

	# Generate HTML
	html = generate_html(schools)
	html_path = "index.html"
	with open(html_path, "w", encoding="utf-8") as f:
		f.write(html)
	print(f"Wrote HTML table to {html_path}")

	return 0


if __name__ == "__main__":
	sys.exit(main())
