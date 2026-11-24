
function openFoodSearch(meal){

 const content =
 document.getElementById("content");


 content.innerHTML=`

 <div class="titleBox">

  <small>NUTRIZIONE</small>

  <h2>🔎 Cerca alimento</h2>

  <p>${meal}</p>

 </div>


 <div class="exercise">

  <div class="exerciseBody">


   <input
    id="foodSearchInput"
    type="search"
    enterkeyhint="done"
    placeholder="Cerca alimento..."
    oninput="updateFoodResults('${meal}')"
   >


   <div id="foodResults" class="foodResultsList" role="region" aria-label="Risultati alimenti" tabindex="0"></div>


  </div>

 </div>

 `;

 const searchInput = document.getElementById("foodSearchInput");
 searchInput.addEventListener("keydown", event=>{
  if(event.key === "Enter"){
   event.preventDefault();
   searchInput.blur();
  }
 });

 window.scrollTo(0, 0);
}


function updateFoodResults(meal){

 const list = document.getElementById("foodResults");
 const query = document.getElementById("foodSearchInput").value;


 if(query.length < 3){

  list.innerHTML="";

  return;

 }


 const results =
 searchNutritionFood(query);



 list.innerHTML =

 results.map(food=>`

  <div class="foodCard"
   style="background:#151b2b;padding:14px;margin:10px 0;border-radius:16px;display:block;"
   onclick="selectNutritionFood('${food.id}','${meal}')">

    <div class="foodTitle">
     🥗 ${cleanDisplayFoodName(food.name)}
    </div>

    <div class="foodInfo">
     ${food.per100g.kcal} kcal
     • ${food.per100g.protein}g proteine
     • ${food.per100g.carbs}g carbo
    </div>

  </div>

 `).join("");

 list.scrollTop = 0;

}



function selectNutritionFood(foodId, meal){

 const food =
 nutritionDatabase.find(
  f=>f.id===foodId
 );


 if(!food || !Object.hasOwn(nutritionMeals, meal)) return;


 const content =
 document.getElementById("content");


 content.innerHTML=`

 <div class="titleBox">

  <small>NUTRIZIONE</small>

  <h2>${translateFoodName(food.name)}</h2>

  <p>${meal}</p>

 </div>


 <div class="exercise">

  <form id="foodPortion" class="exerciseBody">


   <h3><label for="foodGrams">Quantità in grammi</label></h3>


   <input
    id="foodGrams"
    type="number"
    inputmode="decimal"
    step="any"
    required
    value="100"
    placeholder="Grammi"
   >


   <h3>Valori per 100g</h3>


   <p>🔥 ${food.per100g.kcal} kcal</p>

   <p>🥩 ${food.per100g.protein} g proteine</p>

   <p>🍚 ${food.per100g.carbs} g carboidrati</p>

   <p>🥑 ${food.per100g.fat} g grassi</p>


   <button class="backupButton" type="submit">
    Aggiungi a ${meal === "spuntino1" ? "spuntino" : meal}
   </button>


  </form>

 </div>

 `;

 const form = document.getElementById("foodPortion");
 const quantity = document.getElementById("foodGrams");

 form.addEventListener("submit", event=>{
  event.preventDefault();
  const grams = quantity.valueAsNumber;

  if(!Number.isFinite(grams) || grams <= 0){
   toast("Inserisci una quantità maggiore di zero");
   quantity.focus();
   return;
  }

  try{
   saveNutritionPortion(food, meal, grams);
  }catch(error){
   console.error("Errore durante il salvataggio dell'alimento:", error);
   toast("Salvataggio non riuscito. Riprova.");
   return;
  }

  openNutrition();
  toast("Alimento aggiunto ✓");
 });

 window.scrollTo(0, 0);
}


function cleanDisplayFoodName(name){

 return name

 .replace(/di vacca/gi,"")
 .replace(/pastorizzato/gi,"")
 .replace(/UHT/gi,"")
 .replace(/crudo/gi,"crudo")
 .replace(/bollito/gi,"cotto")
 .replace(/, ,/g,",")
 .replace(/ ,/g,",")
 .trim();

}
