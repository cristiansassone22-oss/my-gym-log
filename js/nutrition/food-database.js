
let nutritionDatabase=[];


async function loadNutritionDatabase(){

 const response =
 await fetch("data/nutrition/foods.json.gz?v=20261124");


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
 .replace(/[0-9]/g,"")
 .trim();

}



function searchNutritionFood(query){

 const q =
 cleanFoodName(query);


 if(q.length < 2)
  return [];


 return nutritionDatabase

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
