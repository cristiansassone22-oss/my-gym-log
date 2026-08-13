import csv
import json
import os


base="data/nutrition/source/usda/FoodData_Central_csv_2025-04-24"

foods={}


with open(base+"/food.csv", encoding="utf-8") as f:
    reader=csv.DictReader(f)

    for row in reader:
        foods[row["fdc_id"]]={
            "id":"usda_"+row["fdc_id"],
            "name":row["description"],
            "category":row.get("food_category_id","USDA"),
            "source":["USDA FoodData Central"],
            "per100g":{
                "energy_kcal":0,
                "protein":0,
                "carbohydrates":0,
                "fat":0,
                "fiber":0
            }
        }


with open(base+"/food_nutrient.csv", encoding="utf-8") as f:
    reader=csv.DictReader(f)

    for row in reader:

        food=foods.get(row["fdc_id"])

        if not food:
            continue

        value=float(row["amount"] or 0)

        nutrient=row["nutrient_id"]


        if nutrient=="1008":
            food["per100g"]["energy_kcal"]=value

        elif nutrient=="1003":
            food["per100g"]["protein"]=value

        elif nutrient=="1005":
            food["per100g"]["carbohydrates"]=value

        elif nutrient=="1004":
            food["per100g"]["fat"]=value

        elif nutrient=="1079":
            food["per100g"]["fiber"]=value



output=list(foods.values())


with open(
 "data/nutrition/foods.json",
 "w",
 encoding="utf-8"
) as f:

    json.dump(
        output,
        f,
        indent=2,
        ensure_ascii=False
    )


print("Creati:",len(output),"alimenti")
