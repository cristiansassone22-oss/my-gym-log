
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
    placeholder="Cerca alimento..."
    oninput="updateFoodResults('${meal}')"
   >


   <div id="foodResults" class="foodResultsList"></div>


  </div>

 </div>

 `;

}



function updateFoodResults(meal){

 const query =
 document.getElementById("foodSearchInput").value;


 if(query.length < 3){

  document.getElementById("foodResults").innerHTML="";

  return;

 }


 const results =
 searchNutritionFood(query);



 document.getElementById("foodResults").innerHTML =

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

}



function selectNutritionFood(foodId, meal){

 const food =
 nutritionDatabase.find(
  f=>f.id===foodId
 );


 if(!food) return;


 const content =
 document.getElementById("content");


 content.innerHTML=`

 <div class="titleBox">

  <small>NUTRIZIONE</small>

  <h2>${translateFoodName(food.name)}</h2>

  <p>${meal}</p>

 </div>


 <div class="exercise">

  <div class="exerciseBody">


   <h3>Quantità</h3>


   <input
    id="foodGrams"
    type="number"
    value="100"
    placeholder="Grammi"
   >


   <h3>Valori per 100g</h3>


   <p>🔥 ${food.per100g.kcal} kcal</p>

   <p>🥩 ${food.per100g.protein} g proteine</p>

   <p>🍚 ${food.per100g.carbs} g carboidrati</p>

   <p>🥑 ${food.per100g.fat} g grassi</p>


   <button>
    Aggiungi a ${meal}
   </button>


  </div>

 </div>

 `;

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
