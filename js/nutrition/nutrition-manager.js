let nutritionReady = false;
let nutritionLoadFailed = false;
let nutritionSelectedDate;

const nutritionMeals = {
 colazione: "☕ Colazione",
 spuntino1: "🥤 Spuntino",
 pranzo: "🍝 Pranzo",
 cena: "🍽 Cena"
};

const nutritionNumber = new Intl.NumberFormat("it-IT", {maximumFractionDigits: 2});

const nutritionMetrics = {
 kcal: {label: "Calorie", unit: "kcal"},
 protein: {label: "Proteine", unit: "g"},
 carbs: {label: "Carboidrati", unit: "g"},
 fat: {label: "Grassi", unit: "g"}
};

async function initNutrition(){
 await loadNutritionDatabase();
 nutritionReady = true;
}

const nutritionLoading = initNutrition().catch(error=>{
 nutritionLoadFailed = true;
 console.error("Errore durante il caricamento del catalogo alimenti:", error);
});

function readNutritionLog(){
 return JSON.parse(localStorage.getItem("nutritionLog") || "[]");
}

function nutritionDateKey(date = new Date()){
 return [
  String(date.getFullYear()).padStart(4, "0"),
  String(date.getMonth() + 1).padStart(2, "0"),
  String(date.getDate()).padStart(2, "0")
 ].join("-");
}

function nutritionDateLabel(day){
 return new Date(`${day}T12:00:00`).toLocaleDateString("it-IT");
}

function nutritionEntryDay(entry){
 const day = entry.day ?? entry.date;
 if(day == null || day === "") return "";
 if(/^\d{4}-\d{2}-\d{2}$/.test(day)) return day;

 const date = new Date(day);
 return Number.isNaN(date.getTime()) ? "" : nutritionDateKey(date);
}

function openNutrition(day = nutritionSelectedDate ?? nutritionDateKey()){
 const content = document.getElementById("content");
 const today = nutritionDateKey();
 nutritionSelectedDate = day;
 const log = readNutritionLog();
 const entries = Array.isArray(log) ? log : Object.entries(log).flatMap(([meal, foods])=>
  Array.isArray(foods) ? foods.map(food=>({...food, meal})) : []
 );
 const dayFoods = entries.filter(food=>food && nutritionEntryDay(food) === day);
 const undatedFoods = entries.filter(food=>food && !food.day && !food.date);
 const totals = {kcal: 0, protein: 0, carbs: 0, fat: 0};

 dayFoods.forEach(food=>{
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

 const otherFoods = dayFoods.filter(food=>!Object.hasOwn(nutritionMeals, food.meal));

 content.innerHTML = `
  <div class="titleBox">
   <small>NUTRIZIONE</small>
   <h2>🍽 Diario alimentare</h2>
   <div class="nutritionDayControls">
    <button type="button" data-nutrition-day="-1" aria-label="Giorno precedente">‹</button>
    <input id="nutritionDate" type="date" aria-label="Data del diario" value="${day}" max="${today}">
    <button type="button" data-nutrition-day="1" aria-label="Giorno successivo" ${day === today ? "disabled" : ""}>›</button>
    <button type="button" id="nutritionToday" ${day === today ? "disabled" : ""}>Oggi</button>
   </div>
  </div>

  <div class="exercise">
   <div class="exerciseBody">
    <h3>Totale giornata</h3>
    ${renderNutritionTargets(totals)}
   </div>
  </div>

  ${nutritionDietPanel}

  ${Object.entries(nutritionMeals).map(([meal, label])=>`
   <div class="exercise">
    <div class="exerciseBody">
     <h3>${label}</h3>
     ${renderNutritionEntries(dayFoods.filter(food=>food.meal === meal))}
     <button class="backupButton" type="button" onclick="openFoodSearch('${meal}')">
      ➕ Aggiungi alimento
     </button>
    </div>
   </div>
  `).join("")}

  ${otherFoods.length ? `
   <div class="exercise"><div class="exerciseBody">
    <h3>Altri alimenti</h3>
    ${renderNutritionEntries(otherFoods)}
   </div></div>
  ` : ""}

  ${day === today && undatedFoods.length ? `
   <div class="exercise"><div class="exerciseBody">
    <h3>Alimenti senza data</h3>
    ${renderNutritionEntries(undatedFoods)}
   </div></div>
  ` : ""}
 `;

 const dateInput = document.getElementById("nutritionDate");
 dateInput.addEventListener("change", ()=>{
  if(dateInput.value && dateInput.validity.valid){
   openNutrition(dateInput.value);
  }
 });

 content.querySelectorAll("[data-nutrition-day]").forEach(button=>{
  button.addEventListener("click", ()=>{
   const date = new Date(`${day}T12:00:00`);
   date.setDate(date.getDate() + Number(button.dataset.nutritionDay));
   openNutrition(nutritionDateKey(date));
  });
 });

 document.getElementById("nutritionToday").addEventListener("click", ()=>openNutrition(today));
 document.getElementById("nutritionTargetsForm").addEventListener("submit", saveNutritionTargets);
 initNutritionDiet();
 window.scrollTo(0, 0);
}

function readNutritionTargets(){
 try{
  return JSON.parse(localStorage.getItem("nutritionTargets")) ?? {};
 }catch{
  return {};
 }
}

function saveNutritionTargets(event){
 event.preventDefault();

 const targets = {};
 for(const key of Object.keys(nutritionMetrics)){
  const value = event.currentTarget.elements.namedItem(key).valueAsNumber;
  if(Number.isFinite(value) && value > 0){
   targets[key] = value;
  }
 }

 try{
  localStorage.setItem("nutritionTargets", JSON.stringify(targets));
 }catch(error){
  console.error("Errore durante il salvataggio degli obiettivi:", error);
  toast("Salvataggio non riuscito. Riprova.");
  return;
 }

 openNutrition();
 toast("Obiettivi aggiornati ✓");
}

function renderNutritionTargets(totals){
 const targets = readNutritionTargets();
 const metrics = Object.entries(nutritionMetrics);
 const hasTargets = metrics.some(([key])=>Number.isFinite(targets[key]) && targets[key] > 0);

 return `
  <ul class="nutritionMetrics">
   ${metrics.map(([key, {label, unit}])=>{
    const amount = totals[key];
    const target = targets[key];
    const hasTarget = Number.isFinite(target) && target > 0;
    const total = nutritionNumber.format(amount);
    const goal = hasTarget ? ` / ${nutritionNumber.format(target)}` : "";
    const difference = Math.round((amount - target) * 100) / 100;
    const distance = `${nutritionNumber.format(Math.abs(difference))} ${unit}`;
    let status = "Obiettivo raggiunto";
    if(difference < 0) status = `Mancano ${distance}`;
    if(difference > 0) status = `${distance} sopra l’obiettivo`;

    return `<li>
     <div class="nutritionMetricHeading">
      <strong>${label}</strong>
      <span>${total}${goal} ${unit}</span>
     </div>
     ${hasTarget ? `
      <progress aria-label="${label}: ${total}${goal} ${unit}" value="${Math.max(0, Math.min(amount, target))}" max="${target}"></progress>
      <small>${status}</small>
     ` : ""}
    </li>`;
   }).join("")}
  </ul>
  <details class="nutritionTargets">
   <summary>${hasTargets ? "Modifica obiettivi" : "Imposta obiettivi giornalieri"}</summary>
   <form id="nutritionTargetsForm">
    <p>Puoi lasciare vuoti i valori che non vuoi monitorare.</p>
    <div class="nutritionTargetFields">
     ${metrics.map(([key, {label, unit}])=>`
      <label>${label} (${unit})
       <input type="number" name="${key}" inputmode="decimal" min="0.01" step="0.01"
        value="${Number.isFinite(targets[key]) && targets[key] > 0 ? targets[key] : ""}">
      </label>
     `).join("")}
    </div>
    <button class="backupButton" type="submit">Salva obiettivi</button>
   </form>
  </details>
 `;
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

function saveNutritionPortion(food, meal, grams, day = nutritionSelectedDate ?? nutritionDateKey()){
 const factor = grams / 100;
 const entry = {
  date: new Date().toISOString(),
  day,
  foodId: food.id,
  name: nutritionFoodLabel(food),
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
