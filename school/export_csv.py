import csv
import json
import sys
from typing import Any, Dict, List


def to_string(value: Any) -> str:
	if value is None:
		return ""
	return str(value)


def main() -> int:
	input_path = sys.argv[1] if len(sys.argv) > 1 else "mumbai_schools.json"
	output_path = sys.argv[2] if len(sys.argv) > 2 else "mumbai_schools.csv"

	with open(input_path, "r", encoding="utf-8") as f:
		rows: List[Dict[str, Any]] = json.load(f)

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

	with open(output_path, "w", encoding="utf-8-sig", newline="") as f:
		writer = csv.DictWriter(f, fieldnames=fieldnames)
		writer.writeheader()
		for r in rows:
			writer.writerow({k: to_string(r.get(k, "")) for k in fieldnames})

	print(f"Wrote {len(rows)} rows to {output_path}")
	return 0


if __name__ == "__main__":
	sys.exit(main())
