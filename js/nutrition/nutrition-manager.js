
let nutritionReady=false;


async function initNutrition(){

 await loadNutritionDatabase();

 nutritionReady=true;

}



initNutrition();



function openNutrition(){

 const content = document.getElementById("content");

 document.querySelectorAll(".tabs button.active").forEach(button=>{
  button.classList.remove("active");
 });
 document.querySelector(".save").style.display = "none";
 setMobileNav("mobileNutrition");

 content.innerHTML=`

 <div class="titleBox">

  <small>NUTRIZIONE</small>

  <h2>🍽 Diario alimentare</h2>

  <p>
   ${new Date().toLocaleDateString("it-IT")}
  </p>

 </div>


 <div class="exercise">

  <div class="exerciseBody">

   <h3>☕ Colazione</h3>

   <button onclick="openFoodSearch('colazione')">
    ➕ Aggiungi alimento
   </button>

  </div>

 </div>


 <div class="exercise">

  <div class="exerciseBody">

   <h3>🥤 Spuntino</h3>

   <button onclick="openFoodSearch('spuntino1')">
    ➕ Aggiungi alimento
   </button>

  </div>

 </div>


 <div class="exercise">

  <div class="exerciseBody">

   <h3>🍝 Pranzo</h3>

   <button onclick="openFoodSearch('pranzo')">
    ➕ Aggiungi alimento
   </button>

  </div>

 </div>


 <div class="exercise">

  <div class="exerciseBody">

   <h3>🍽 Cena</h3>

   <button onclick="openFoodSearch('cena')">
    ➕ Aggiungi alimento
   </button>

  </div>

 </div>


 `;

 window.scrollTo(0, 0);

}
