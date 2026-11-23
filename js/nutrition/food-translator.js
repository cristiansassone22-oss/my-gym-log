
let foodTranslations={};


async function loadFoodTranslations(){

 const response =
 await fetch("data/nutrition/food-translations.json");


 foodTranslations =
 await response.json();

}



function translateFoodName(name){

 return foodTranslations[name] || name;

}
