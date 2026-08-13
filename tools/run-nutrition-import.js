
const fs = require("fs");


const source =
JSON.parse(
 fs.readFileSync(
  "data/nutrition/source/usda.json",
  "utf8"
 )
);


function extract(food){

 let values={

  energy_kcal:0,
  protein:0,
  carbohydrates:0,
  fat:0,
  fiber:0

 };


 food.foodNutrients?.forEach(n=>{

  switch(n.nutrientName){

   case "Energy":
    values.energy_kcal=n.value;
    break;

   case "Protein":
    values.protein=n.value;
    break;

   case "Carbohydrate, by difference":
    values.carbohydrates=n.value;
    break;

   case "Total lipid (fat)":
    values.fat=n.value;
    break;

   case "Fiber, total dietary":
    values.fiber=n.value;
    break;

  }

 });


 return values;

}



const database =
source.map(food=>({

 id:"usda_"+food.id,

 name:food.description,

 category:
  food.foodCategory || "Other",

 source:[
  "USDA FoodData Central"
 ],

 per100g:
  extract(food)

}));


fs.writeFileSync(
 "data/nutrition/foods.json",
 JSON.stringify(
  database,
  null,
  2
 )
);


console.log(
 "Database creato:",
 database.length,
 "alimenti"
);

