import csv
import os
import sys
from typing import Dict, List, Any


NEW_COLUMNS = [
	"Name",
	"Address",
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


def build_basic_info(row: Dict[str, Any]) -> str:
	parts: List[str] = []
	for key, label in [
		("operator", "operator"),
		("operator_type", "operator_type"),
		("board", "board"),
		("levels", "levels"),
		("gender", "gender"),
		("religion", "religion"),
		("language", "language"),
	]:
		value = (row.get(key) or "").strip()
		if value:
			parts.append(f"{label}={value}")
	return "; ".join(parts)


def build_contact_details(row: Dict[str, Any]) -> str:
	phone = (row.get("phone") or "").strip()
	website = (row.get("website") or "").strip()
	parts: List[str] = []
	if phone:
		parts.append(f"phone: {phone}")
	if website:
		parts.append(f"website: {website}")
	return " | ".join(parts)


def build_travel_info(row: Dict[str, Any]) -> str:
	lat = (row.get("lat") or "").strip()
	lon = (row.get("lon") or "").strip()
	if lat and lon:
		return f"{lat}, {lon}"
	return ""


def augment_csv_file(path: str) -> None:
	with open(path, "r", encoding="utf-8-sig", newline="") as f:
		reader = csv.DictReader(f)
		rows = list(reader)
		original_fields = reader.fieldnames or []

	# Build combined header, appending new columns at the end
	fieldnames = original_fields + [c for c in NEW_COLUMNS if c not in original_fields]

	tmp_path = path + ".tmp"
	with open(tmp_path, "w", encoding="utf-8-sig", newline="") as f:
		writer = csv.DictWriter(f, fieldnames=fieldnames)
		writer.writeheader()
		for r in rows:
			augmented = dict(r)
			# Fill requested columns
			augmented["Name"] = r.get("name", "")
			augmented["Address"] = r.get("address", "")
			augmented["Fee Structure"] = augmented.get("Fee Structure", "") or ""
			augmented["Basic Infomation"] = build_basic_info(r)
			augmented["Contact Details"] = build_contact_details(r)
			augmented["FAQ"] = augmented.get("FAQ", "") or ""
			augmented["Admission Details"] = augmented.get("Admission Details", "") or ""
			augmented["Other Key Infomation"] = augmented.get("Other Key Infomation", "") or (r.get("osm_url", "") or "")
			augmented["School Infrastructure Details"] = augmented.get("School Infrastructure Details", "") or ""
			augmented["Co-Curricular Activities"] = augmented.get("Co-Curricular Activities", "") or ""
			augmented["Travel Infomation"] = build_travel_info(r)
			augmented["Review"] = augmented.get("Review", "") or ""
			augmented["Summary"] = augmented.get("Summary", "") or ""
			writer.writerow(augmented)

	os.replace(tmp_path, path)


def main() -> int:
	dir_path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.getcwd(), "Filtered by Cities")
	if not os.path.isdir(dir_path):
		print(f"Directory not found: {dir_path}")
		return 2

	files = [
		os.path.join(dir_path, name)
		for name in sorted(os.listdir(dir_path))
		if name.lower().endswith(".csv") and os.path.isfile(os.path.join(dir_path, name))
	]
	if not files:
		print("No CSV files found to augment.")
		return 0

	for p in files:
		print(f"Augmenting {os.path.basename(p)}...")
		augment_csv_file(p)
	print("Done.")
	return 0


if __name__ == "__main__":
	sys.exit(main())
