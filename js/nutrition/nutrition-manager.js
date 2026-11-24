let nutritionReady = false;

const nutritionMeals = {
 colazione: "☕ Colazione",
 spuntino1: "🥤 Spuntino",
 pranzo: "🍝 Pranzo",
 cena: "🍽 Cena"
};

const nutritionNumber = new Intl.NumberFormat("it-IT", {maximumFractionDigits: 2});

async function initNutrition(){
 await loadNutritionDatabase();
 nutritionReady = true;
}

initNutrition();

function readNutritionLog(){
 return JSON.parse(localStorage.getItem("nutritionLog") || "[]");
}

function openNutrition(){
 const content = document.getElementById("content");
 const date = new Date();
 const today = date.toDateString();
 const log = readNutritionLog();
 const entries = Array.isArray(log) ? log : Object.entries(log).flatMap(([meal, foods])=>
  Array.isArray(foods) ? foods.map(food=>({...food, meal})) : []
 );
 const todaysFoods = entries.filter(food=>food?.date && new Date(food.date).toDateString() === today);
 const undatedFoods = entries.filter(food=>food && !food.date);
 const totals = {kcal: 0, protein: 0, carbs: 0, fat: 0};

 todaysFoods.forEach(food=>{
  totals.kcal += Number(food.kcal ?? food.calories) || 0;
  totals.protein += Number(food.protein) || 0;
  totals.carbs += Number(food.carbs) || 0;
  totals.fat += Number(food.fat ?? food.fats) || 0;
 });

 document.querySelectorAll(".tabs button.active").forEach(button=>{
  button.classList.remove("active");
 });
 document.querySelector(".save").style.display = "none";
 setMobileNav("mobileNutrition");

 const otherFoods = todaysFoods.filter(food=>!Object.hasOwn(nutritionMeals, food.meal));

 content.innerHTML = `
  <div class="titleBox">
   <small>NUTRIZIONE</small>
   <h2>🍽 Diario alimentare</h2>
   <p>${date.toLocaleDateString("it-IT")}</p>
  </div>

  <div class="exercise">
   <div class="exerciseBody">
    <h3>Totale giornata</h3>
    <p>${nutritionNumber.format(totals.kcal)} kcal ·
     ${nutritionNumber.format(totals.protein)} g proteine ·
     ${nutritionNumber.format(totals.carbs)} g carboidrati ·
     ${nutritionNumber.format(totals.fat)} g grassi</p>
   </div>
  </div>

  ${Object.entries(nutritionMeals).map(([meal, label])=>`
   <div class="exercise">
    <div class="exerciseBody">
     <h3>${label}</h3>
     ${renderNutritionEntries(todaysFoods.filter(food=>food.meal === meal))}
     <button class="backupButton" type="button" onclick="openFoodSearch('${meal}')">
      ➕ Aggiungi alimento
     </button>
    </div>
   </div>
  `).join("")}

  ${otherFoods.length ? `
   <div class="exercise"><div class="exerciseBody">
    <h3>Altri alimenti di oggi</h3>
    ${renderNutritionEntries(otherFoods)}
   </div></div>
  ` : ""}

  ${undatedFoods.length ? `
   <div class="exercise"><div class="exerciseBody">
    <h3>Alimenti senza data</h3>
    ${renderNutritionEntries(undatedFoods)}
   </div></div>
  ` : ""}
 `;

 window.scrollTo(0, 0);
}

function renderNutritionEntries(entries){
 if(!entries.length) return "";

 return `<ul class="nutritionEntries">${entries.map(food=>{
  const grams = Number(food.grams ?? food.quantity);
  const kcal = Number(food.kcal ?? food.calories);
  const details = [
   Number.isFinite(grams) ? `${nutritionNumber.format(grams)} g` : "",
   Number.isFinite(kcal) ? `${nutritionNumber.format(kcal)} kcal` : ""
  ].filter(Boolean);

  return `<li><strong>${escapeEditValue(food.name)}</strong>
   ${details.length ? `<small>${details.join(" · ")}</small>` : ""}
  </li>`;
 }).join("")}</ul>`;
}

function saveNutritionPortion(food, meal, grams){
 const factor = grams / 100;
 const entry = {
  date: new Date().toISOString(),
  foodId: food.id,
  name: translateFoodName(food.name),
  meal,
  grams,
  kcal: food.per100g.kcal * factor,
  protein: food.per100g.protein * factor,
  carbs: food.per100g.carbs * factor,
  fat: food.per100g.fat * factor
 };
 const log = readNutritionLog();

 if(Array.isArray(log)){
  log.push(entry);
 }else{
  (log[meal] ??= []).push(entry);
 }

 localStorage.setItem("nutritionLog", JSON.stringify(log));
}
