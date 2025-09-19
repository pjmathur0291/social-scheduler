import csv
import json
import sys
import time
import urllib.request
from dataclasses import dataclass
from typing import Any, Dict, Iterable, List, Optional, Tuple


# Reuse a pool of Overpass endpoints for resiliency
OVERPASS_ENDPOINTS = [
	"https://overpass-api.de/api/interpreter",
	"https://overpass.kumi.systems/api/interpreter",
	"https://overpass.openstreetmap.fr/api/interpreter",
	"https://overpass.openstreetmap.ru/api/interpreter",
]


@dataclass
class CityConfig:
	key: str
	name_patterns: List[str]
	extra_area_patterns: List[str]
	wikidata_ids: List[str]


DEFAULT_CITIES: List[CityConfig] = [
	CityConfig(
		key="mumbai",
		name_patterns=["Mumbai", "Greater Mumbai", "Brihanmumbai"],
		extra_area_patterns=["Mumbai Suburban", "Mumbai City"],
		wikidata_ids=["Q1156", "Q2085494", "Q2341660"],
	),
	CityConfig(
		key="delhi",
		name_patterns=["Delhi", "New Delhi"],
		extra_area_patterns=["Municipal Corporation of Delhi", "NDMC"],
		wikidata_ids=["Q1353", "Q987"],
	),
	CityConfig(
		key="bengaluru",
		name_patterns=["Bengaluru", "Bangalore", "Bruhat Bengaluru Mahanagara Palike"],
		extra_area_patterns=[],
		wikidata_ids=[],
	),
	CityConfig(
		key="chennai",
		name_patterns=["Chennai", "Greater Chennai"],
		extra_area_patterns=[],
		wikidata_ids=["Q15116"],
	),
	CityConfig(
		key="kolkata",
		name_patterns=["Kolkata", "Calcutta", "Kolkata Municipal Corporation"],
		extra_area_patterns=[],
		wikidata_ids=["Q1348"],
	),
	CityConfig(
		key="hyderabad",
		name_patterns=["Hyderabad", "Greater Hyderabad"],
		extra_area_patterns=[],
		wikidata_ids=["Q15394"],
	),
	CityConfig(
		key="pune",
		name_patterns=["Pune", "Pimpri-Chinchwad"],
		extra_area_patterns=["Pune Municipal Corporation", "Pimpri-Chinchwad Municipal Corporation"],
		wikidata_ids=[],
	),
	CityConfig(
		key="ahmedabad",
		name_patterns=["Ahmedabad", "Ahmedabad Municipal Corporation"],
		extra_area_patterns=[],
		wikidata_ids=["Q40147"],
	),
	CityConfig(
		key="jodhpur",
		name_patterns=["Jodhpur", "Jodhpur Municipal Corporation"],
		extra_area_patterns=[],
		wikidata_ids=[],
	),
]


def http_post_raw(url: str, body: str, timeout: int = 240) -> Tuple[int, str]:
	data = body.encode("utf-8")
	req = urllib.request.Request(url, data=data)
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
		except Exception as e:  # noqa: BLE001
			last_err = e
			time.sleep(1.5 * (idx + 1))
	if last_err:
		raise last_err
	return {}


def to_regex_union(parts: Iterable[str]) -> str:
	parts_clean = [p for p in (s.strip() for s in parts) if p]
	if not parts_clean:
		return ""
	return "|".join([urllib_safe_regex(p) for p in parts_clean])


def urllib_safe_regex(s: str) -> str:
	# Overpass uses double-quoted strings; escape double quotes
	return s.replace('"', '\\"')


def build_query_for_city(cfg: CityConfig) -> str:
	name_union = to_regex_union(cfg.name_patterns)
	extra_union = to_regex_union(cfg.extra_area_patterns)
	wikidata_union = to_regex_union(cfg.wikidata_ids)

	areas: List[str] = []
	if name_union:
		areas.append(f"  area[\"boundary\"=\"administrative\"][\"name\"~\"^({name_union})$\",i];\n")
	if extra_union:
		areas.append(f"  area[\"boundary\"=\"administrative\"][\"name\"~\"^({extra_union})$\",i];\n")
	if wikidata_union:
		areas.append(f"  area[\"wikidata\"~\"^({wikidata_union})$\"];\n")
	area_block = "".join(areas) if areas else "  /* no explicit areas; rely on name match */\n"

	return (
		"[out:json][timeout:240];\n"
		"(\n"
		f"{area_block}"
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


def _first_nonempty(*values: Optional[str]) -> str:
	for v in values:
		if v and str(v).strip():
			return str(v).strip()
	return ""


def _join_semicolon(values: List[str]) -> str:
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


def write_csv(path: str, rows: List[Dict[str, Any]]) -> None:
	fieldnames = [
		"name",
		"address",
		"phone",
		"website",
		"operator",
		"operator_type",
		"board",
		"levels",
		"gender",
		"religion",
		"language",
		"lat",
		"lon",
		"osm_url",
	]
	with open(path, "w", encoding="utf-8-sig", newline="") as f:
		w = csv.DictWriter(f, fieldnames=fieldnames)
		w.writeheader()
		for r in rows:
			w.writerow({k: ("" if r.get(k) is None else r.get(k)) for k in fieldnames})


def fetch_city(cfg: CityConfig) -> Tuple[List[Dict[str, Any]], int]:
	query = build_query_for_city(cfg)
	resp = fetch_overpass_json(query)
	elements = resp.get("elements", []) if isinstance(resp, dict) else []
	rows: List[Dict[str, Any]] = []
	for el in elements:
		if not isinstance(el, dict):
			continue
		row = to_school_row(el)
		if not row.get("name"):
			continue
		rows.append(row)
	rows.sort(key=lambda r: (r.get("name") or "").lower())
	return rows, len(elements)


def main() -> int:
	# Cities can be passed via argv as comma-separated keys; otherwise use defaults
	arg_keys = []
	if len(sys.argv) > 1:
		arg_keys = [a.strip().lower() for a in sys.argv[1].split(",") if a.strip()]
	cities = [c for c in DEFAULT_CITIES if not arg_keys or c.key in arg_keys]
	if not cities:
		print("No matching cities. Valid keys:", ", ".join([c.key for c in DEFAULT_CITIES]))
		return 2

	for idx, cfg in enumerate(cities):
		try:
			print(f"Fetching {cfg.key}...", flush=True)
			rows, raw_count = fetch_city(cfg)
			json_path = f"{cfg.key}_schools.json"
			with open(json_path, "w", encoding="utf-8") as f:
				json.dump(rows, f, ensure_ascii=False, indent=2)
			csv_path = f"{cfg.key}_schools.csv"
			write_csv(csv_path, rows)
			print(f"{cfg.key}: wrote {len(rows)} rows (raw elements {raw_count}) -> {csv_path}")
		except Exception as e:  # noqa: BLE001
			print(f"{cfg.key}: ERROR: {e}")
		# brief pause to be polite to Overpass
		time.sleep(2.0 + 0.5 * idx)

	return 0


if __name__ == "__main__":
	sys.exit(main())
