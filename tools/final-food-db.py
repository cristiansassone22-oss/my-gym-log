import json
import gzip


source="data/nutrition/foods-mobile.json"
output="data/nutrition/foods.json.gz"


with open(source,encoding="utf-8") as f:
    foods=json.load(f)


with gzip.open(
    output,
    "wt",
    encoding="utf-8"
) as f:

    json.dump(
        foods,
        f,
        separators=(",",":"),
        ensure_ascii=False
    )


print("Database finale:",len(foods),"alimenti")

