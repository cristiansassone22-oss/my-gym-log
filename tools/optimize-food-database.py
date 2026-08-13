import json


source="data/nutrition/foods.json"
output="data/nutrition/foods-optimized.json"


with open(source,encoding="utf-8") as f:
    foods=json.load(f)


clean=[]
seen=set()


for food in foods:

    name=(food.get("name") or "").strip()

    values=food.get("per100g",{})


    if not name:
        continue


    if name.lower() in seen:
        continue


    if (
        values.get("energy_kcal",0)==0 and
        values.get("protein",0)==0 and
        values.get("carbohydrates",0)==0 and
        values.get("fat",0)==0
    ):
        continue


    seen.add(name.lower())


    clean.append({

        "id":food["id"],
        "name":name,
        "category":food.get("category",""),
        "source":food.get("source",[]),
        "per100g":values

    })


with open(output,"w",encoding="utf-8") as f:
    json.dump(
        clean,
        f,
        ensure_ascii=False
    )


print("Originali:",len(foods))
print("Ottimizzati:",len(clean))

