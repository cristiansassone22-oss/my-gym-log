
/*
 Nutrition Database Importer

 Sources:
 - USDA FoodData Central
 - CREA Food Composition Tables

 Output:
 data/nutrition/foods.json
*/


function normalizeFood(sourceFood){

 return {

  id:"",
  name:"",
  category:"",
  source:[],

  per100g:{

   energy_kcal:0,
   protein:0,
   carbohydrates:0,
   fat:0,
   fiber:0,

   micronutrients:{}

  }

 };

}



function buildDatabase(source){

 return source.map(normalizeFood);

}




function importUSDA(source){

 const foods=[];


 source.forEach(item=>{

  foods.push({

   id:
    "usda_"+item.id,

   name:
    item.description,

   category:
    "USDA",

   source:[
    "USDA FoodData Central"
   ],

   per100g:{
    energy_kcal:0,
    protein:0,
    carbohydrates:0,
    fat:0,
    fiber:0,
    micronutrients:{}
   }

  });


 });


 return foods;

}



function extractUSDAValues(food){

 const result={

  energy_kcal:0,
  protein:0,
  carbohydrates:0,
  fat:0,
  fiber:0,

  micronutrients:{}

 };


 if(!food.foodNutrients){
  return result;
 }


 food.foodNutrients.forEach(n=>{


  switch(n.nutrientName){

   case "Energy":
    result.energy_kcal=n.value;
    break;


   case "Protein":
    result.protein=n.value;
    break;


   case "Carbohydrate, by difference":
    result.carbohydrates=n.value;
    break;


   case "Total lipid (fat)":
    result.fat=n.value;
    break;


   case "Fiber, total dietary":
    result.fiber=n.value;
    break;


  }


 });


 return result;

}



function generateNutritionDatabase(source){

 const database=[];


 source.forEach(food=>{

  database.push({

   id:
    "usda_"+food.id,


   name:
    food.description,


   category:
    food.foodCategory || "Altro",


   source:[
    "USDA FoodData Central"
   ],


   per100g:
    extractUSDAValues(food)

  });

 });


 return database;

}

