
let nutritionDatabase = [];


async function loadNutritionDatabase(){

 const response =
 await fetch("data/nutrition/foods.json");


 nutritionDatabase =
 await response.json();


 return nutritionDatabase;

}



function searchNutritionFood(query){

 return nutritionDatabase.filter(food=>

  food.name
  .toLowerCase()
  .includes(
   query.toLowerCase()
  )

 );

}

