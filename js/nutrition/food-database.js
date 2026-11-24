
let nutritionDatabase=[];


async function loadNutritionDatabase(){

 const response =
 await fetch("data/nutrition/foods.json.gz?v=20261124-5");


 const blob =
 await response.blob();


 const stream =
 blob.stream()
 .pipeThrough(
  new DecompressionStream("gzip")
 );


 const text =
 await new Response(stream)
 .text();


 nutritionDatabase =
 JSON.parse(text);


 console.log(
  "Database nutrizione:",
  nutritionDatabase.length
 );

}



function cleanFoodName(name){

 return name
 .toLowerCase()
 .replace(/[’‘]/g,"'")
 .trim();

}



function readCustomNutritionFoods(){
 return JSON.parse(localStorage.getItem("nutritionCustomFoods") || "[]");
}

function saveCustomNutritionFood(name, per100g){
 const foods = readCustomNutritionFoods();
 const food = {
  id: "custom_" + crypto.randomUUID(),
  name,
  per100g,
  custom: true
 };
 foods.push(food);
 localStorage.setItem("nutritionCustomFoods", JSON.stringify(foods));
 return food;
}

function nutritionFoodLabel(food){
 return food.custom ? food.name : translateFoodName(food.name);
}

function searchNutritionFood(query){

 const q =
 cleanFoodName(query);


 if(!q) return [];

 const customFoods = readCustomNutritionFoods();
 const foods = q.length > 1 ? [...customFoods, ...nutritionDatabase] : customFoods;

 return foods

 .filter(food=>{

  const name =
  cleanFoodName(food.name);

  return name.includes(q) || food.aliases?.some(alias=>cleanFoodName(alias).includes(q));

 })


 .sort((a,b)=>{

  const aName =
  cleanFoodName(a.name);

  const bName =
  cleanFoodName(b.name);


  const aScore =
   (aName.startsWith(q) ? 1000 : 0)
   - aName.length;


  const bScore =
   (bName.startsWith(q) ? 1000 : 0)
   - bName.length;


  return bScore-aScore;


 })


 .slice(0,20);

}
