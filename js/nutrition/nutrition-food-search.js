
function openFoodSearch(meal){

 const content =
 document.getElementById("content");


 content.innerHTML=`

 <div class="titleBox">

  <small>NUTRIZIONE</small>

  <h2>🔎 Cerca alimento</h2>

  <p>${nutritionMeals[meal]} · ${nutritionDateLabel(nutritionSelectedDate)}</p>

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


   <button id="manualFoodButton" class="backupButton nutritionManualButton" type="button">
    Inserisci alimento manualmente
   </button>

   <div id="foodResults" class="foodResultsList" role="region" aria-label="Risultati alimenti" tabindex="0"></div>


  </div>

 </div>

 `;

 const searchInput = document.getElementById("foodSearchInput");
 document.getElementById("manualFoodButton").addEventListener("click", ()=>{
  openCustomFoodForm(meal, searchInput.value.trim());
 });

 if(!nutritionReady){
  nutritionLoading.then(()=>{
   if(searchInput.isConnected) updateFoodResults(meal);
  });
 }

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
 const query = document.getElementById("foodSearchInput").value.trim();

 if(!query){
  list.replaceChildren();
  return;
 }

 const results = searchNutritionFood(query);
 if(!results.length){
  list.textContent = nutritionReady ? "Nessun alimento trovato."
   : nutritionLoadFailed ? "Catalogo non disponibile. Ricarica la pagina per riprovare."
   : "Caricamento del catalogo…";
  return;
 }

 list.innerHTML = results.map(food=>`
  <button type="button" class="foodCard" data-food-id="${escapeEditValue(food.id)}">
   <span class="foodTitle">🥗 ${escapeEditValue(food.custom ? food.name : cleanDisplayFoodName(food.name))}</span>
   <span class="foodInfo">
    ${nutritionNumber.format(food.per100g.kcal)} kcal
    • ${nutritionNumber.format(food.per100g.protein)} g proteine
    • ${nutritionNumber.format(food.per100g.carbs)} g carbo
    ${food.custom ? " • Personale" : ""}
   </span>
  </button>
 `).join("");

 list.querySelectorAll("[data-food-id]").forEach(button=>{
  button.addEventListener("click", ()=>selectNutritionFood(button.dataset.foodId, meal));
 });
 list.scrollTop = 0;
}

function openCustomFoodForm(meal, initialName){
 const content = document.getElementById("content");

 content.innerHTML = `
  <div class="titleBox">
   <small>NUTRIZIONE</small>
   <h2>Inserisci alimento manualmente</h2>
   <p>${nutritionMeals[meal]} · ${nutritionDateLabel(nutritionSelectedDate)}</p>
  </div>
  <div class="exercise">
   <form id="customFoodForm" class="exerciseBody">
    <label for="customFoodName">Nome dell’alimento</label>
    <input id="customFoodName" name="foodName" type="text" required placeholder="Es. Yogurt greco – marca">
    <h3>Valori per 100 g</h3>
    <div class="nutritionTargetFields">
     ${Object.entries(nutritionMetrics).map(([key, {label, unit}])=>`
      <label>${label} (${unit})
       <input type="number" name="${key}" inputmode="decimal" min="0" step="any" required>
      </label>
     `).join("")}
    </div>
    <button class="backupButton" type="submit">Salva nel catalogo</button>
    <button id="customFoodBack" class="backupButton" type="button">Torna alla ricerca</button>
   </form>
  </div>
 `;

 const form = document.getElementById("customFoodForm");
 const nameInput = document.getElementById("customFoodName");
 nameInput.value = initialName;
 nameInput.addEventListener("input", ()=>nameInput.setCustomValidity(""));
 document.getElementById("customFoodBack").addEventListener("click", ()=>openFoodSearch(meal));

 form.addEventListener("submit", event=>{
  event.preventDefault();
  const name = nameInput.value.trim();

  if(!name){
   nameInput.setCustomValidity("Inserisci il nome dell’alimento.");
   nameInput.reportValidity();
   return;
  }

  const per100g = {};
  for(const key of Object.keys(nutritionMetrics)){
   const input = form.elements.namedItem(key);
   const value = input.valueAsNumber;
   if(!Number.isFinite(value) || value < 0){
    toast("Controlla i valori per 100 g");
    input.focus();
    return;
   }
   per100g[key] = value;
  }

  let food;
  try{
   food = saveCustomNutritionFood(name, per100g);
  }catch(error){
   console.error("Errore durante il salvataggio dell’alimento personale:", error);
   toast("Salvataggio non riuscito. Riprova.");
   return;
  }

  selectNutritionFood(food.id, meal);
  toast("Alimento salvato nel catalogo ✓");
 });

 window.scrollTo(0, 0);
}

function selectNutritionFood(foodId, meal){

 const food =
 readCustomNutritionFoods().find(food=>food.id === foodId)
 ?? nutritionDatabase.find(food=>food.id === foodId);


 if(!food || !Object.hasOwn(nutritionMeals, meal)) return;


 const content =
 document.getElementById("content");


 content.innerHTML=`

 <div class="titleBox">

  <small>NUTRIZIONE</small>

  <h2>${escapeEditValue(nutritionFoodLabel(food))}</h2>

  <p>${nutritionMeals[meal]} · ${nutritionDateLabel(nutritionSelectedDate)}</p>

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


   <p>🔥 ${nutritionNumber.format(food.per100g.kcal)} kcal</p>

   <p>🥩 ${nutritionNumber.format(food.per100g.protein)} g proteine</p>

   <p>🍚 ${nutritionNumber.format(food.per100g.carbs)} g carboidrati</p>

   <p>🥑 ${nutritionNumber.format(food.per100g.fat)} g grassi</p>


   <button class="backupButton" type="submit">
    Aggiungi a ${meal === "spuntino1" ? "spuntino" : meal}
   </button>


  </form>

 </div>

 `;

 const day = nutritionSelectedDate;
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
   saveNutritionPortion(food, meal, grams, day);
  }catch(error){
   console.error("Errore durante il salvataggio dell'alimento:", error);
   toast("Salvataggio non riuscito. Riprova.");
   return;
  }

  openNutrition(day);
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
