import json


source="data/nutrition/foods-optimized.json"
output="data/nutrition/foods-mobile.json"


with open(source,encoding="utf-8") as f:
    foods=json.load(f)


result=[]
seen=set()


for food in foods:

    name=food["name"].strip()

    low=name.lower()


    if len(name)<3:
        continue


    if low in seen:
        continue


    values=food["per100g"]


    if values["energy_kcal"]<=0:
        continue


    seen.add(low)


    result.append({

        "id":food["id"],
        "name":name,
        "category":food["category"],

        "per100g":{

            "kcal":values["energy_kcal"],
            "protein":values["protein"],
            "carbs":values["carbohydrates"],
            "fat":values["fat"],
            "fiber":values["fiber"]

        }

    })


with open(output,"w",encoding="utf-8") as f:
    json.dump(
        result,
        f,
        ensure_ascii=False
    )


print("Creati:",len(result))

