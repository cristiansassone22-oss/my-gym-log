
function getNutritionLog(){

 return JSON.parse(
  localStorage.getItem("nutritionLog") || "[]"
 );

}


function saveNutritionLog(data){

 localStorage.setItem(
  "nutritionLog",
  JSON.stringify(data)
 );

}


function addFoodEntry(food){

 const log=getNutritionLog();

 log.push({
  date:new Date().toISOString(),
  ...food
 });

 saveNutritionLog(log);

}


function getTodayNutrition(){

 const today =
 new Date().toISOString().slice(0,10);

 return getNutritionLog()
 .filter(item =>
  item.date.startsWith(today)
 );

}



function showNutrition(){

 const meals=[
  ["colazione","☕ Colazione"],
  ["spuntino1","🥤 Spuntino"],
  ["pranzo","🍝 Pranzo"],
  ["spuntino2","🥤 Spuntino"],
  ["cena","🍽️ Cena"],
  ["extra","🍫 Extra"]
 ];


 const content=document.getElementById("content");


 content.innerHTML=`

 <div class="titleBox">
  <small>NUTRIZIONE</small>
  <h2>🍽️ Diario alimentare</h2>
  <p>Lunedì</p>
 </div>


 <div class="exercise">
  <div class="exerciseBody">

   <h3>Totale giornata</h3>

   <p>🔥 Calorie: 0 kcal</p>
   <p>🥩 Proteine: 0 g</p>
   <p>🍚 Carboidrati: 0 g</p>
   <p>🥑 Grassi: 0 g</p>

  </div>
 </div>


 ${meals.map(m=>`

 <div class="exercise">

  <div class="exerciseBody">

   <h3>${m[1]}</h3>

   <button onclick="showFoodSearch('${m[0]}')">
    ➕ Aggiungi alimento
   </button>

  </div>

 </div>

 `).join("")}

 `;


 setMobileNav("mobileNutrition");

}

function addNutritionForm(){

 const content=document.getElementById("content");


 content.innerHTML+=`

 <div class="exercise">

  <div class="exerciseBody">

   <h3>➕ Aggiungi alimento</h3>


   <input id="foodName"
    placeholder="Nome alimento">


   <input id="foodQty"
    type="number"
    placeholder="Quantità g">


   <input id="foodCalories"
    type="number"
    placeholder="Calorie">


   <input id="foodProtein"
    type="number"
    placeholder="Proteine g">


   <input id="foodCarbs"
    type="number"
    placeholder="Carboidrati g">


   <input id="foodFats"
    type="number"
    placeholder="Grassi g">


   <button onclick="saveFoodEntry()">
    Salva alimento
   </button>


  </div>

 </div>

 `;

}



function saveFoodEntry(){

 addFoodEntry({

  name:
   document.getElementById("foodName").value,

  quantity:
   Number(document.getElementById("foodQty").value),

  calories:
   Number(document.getElementById("foodCalories").value),

  protein:
   Number(document.getElementById("foodProtein").value),

  carbs:
   Number(document.getElementById("foodCarbs").value),

  fats:
   Number(document.getElementById("foodFats").value)

 });


 showNutrition();

 toast("Alimento aggiunto ✓");

}



let nutritionFoods=[];


async function loadNutritionDatabase(){

 const response =
 await fetch("data/nutrition/foods.json");

 nutritionFoods =
 await response.json();

}


function searchFood(query){

 return nutritionFoods.filter(food=>

  food.name
  .toLowerCase()
  .includes(
   query.toLowerCase()
  )

 );

}


function calculateFoodValues(food,grams){

 const factor =
 grams / 100;


 return {

  kcal:
   Math.round(
    food.valuesPer100g.kcal * factor
   ),

  protein:
   Math.round(
    food.valuesPer100g.protein * factor
   ),

  carbs:
   Math.round(
    food.valuesPer100g.carbs * factor
   ),

  fats:
   Math.round(
    food.valuesPer100g.fats * factor
   ),

  fiber:
   Math.round(
    food.valuesPer100g.fiber * factor
   )

 };

}


loadNutritionDatabase();



function showFoodSearch(meal){

 const content=document.getElementById("content");


 content.innerHTML=`

 <div class="titleBox">
  <small>NUTRIZIONE</small>
  <h2>➕ Aggiungi alimento</h2>
  <p>${meal}</p>
 </div>


 <div class="exercise">

  <div class="exerciseBody">

   <input
    id="foodSearchInput"
    placeholder="Cerca alimento"
    oninput="updateFoodResults('${meal}')"
   >


   <div id="foodResults"></div>

  </div>

 </div>

 `;

}


function updateFoodResults(meal){

 const query =
 document.getElementById("foodSearchInput").value;


 const results =
 searchFood(query);


 document.getElementById("foodResults").innerHTML =
 results.map(food=>`

  <button onclick="selectFood('${food.id}','${meal}')">
   ${food.name}
  </button>

 `).join("");

}




function selectFood(foodId,meal){

 const food =
 nutritionFoods.find(
  f=>f.id===foodId
 );


 if(!food) return;


 const content=document.getElementById("content");


 content.innerHTML=`

 <div class="titleBox">
  <small>NUTRIZIONE</small>
  <h2>${food.name}</h2>
  <p>${meal}</p>
 </div>


 <div class="exercise">

  <div class="exerciseBody">

   <p>
   ${food.valuesPer100g.kcal} kcal / 100g
   </p>

   <input
    id="foodGrams"
    type="number"
    placeholder="Grammi"
    value="100"
   >


   <button onclick="calculateSelectedFood('${foodId}','${meal}')">
    Calcola
   </button>


   <div id="foodPreview"></div>

  </div>

 </div>

 `;

}


function calculateSelectedFood(foodId,meal){

 const food =
 nutritionFoods.find(
  f=>f.id===foodId
 );


 const grams =
 Number(
  document.getElementById("foodGrams").value
 );


 const values =
 calculateFoodValues(food,grams);


 document.getElementById("foodPreview").innerHTML=`

 <h3>Risultato</h3>

 <p>🔥 ${values.kcal} kcal</p>
 <p>🥩 ${values.protein} g proteine</p>
 <p>🍚 ${values.carbs} g carboidrati</p>
 <p>🥑 ${values.fats} g grassi</p>

 <button onclick="saveNutritionMeal('${foodId}','${meal}')">
  Aggiungi a ${meal}
 </button>

 `;

}



function saveNutritionMeal(foodId,meal){

 const food =
 nutritionFoods.find(
  f=>f.id===foodId
 );


 const grams =
 Number(
  document.getElementById("foodGrams").value
 );


 const values =
 calculateFoodValues(food,grams);


 const log =
 JSON.parse(
  localStorage.getItem("nutritionLog") || "{}"
 );


 if(!log[meal]){
  log[meal]=[];
 }


 log[meal].push({

  name:food.name,
  grams,

  kcal:values.kcal,
  protein:values.protein,
  carbs:values.carbs,
  fats:values.fats

 });


 localStorage.setItem(
  "nutritionLog",
  JSON.stringify(log)
 );


 showNutrition();

 toast("Alimento aggiunto ✓");

}

