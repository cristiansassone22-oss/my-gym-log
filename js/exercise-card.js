
function renderExerciseCard(ex, i, last){

 return `

 <div class="exercise">

  <div class="exerciseHeader">

   <img
    class="exerciseThumb"
    src="${ex.gif || ex.photo}"
    alt="${ex.name}"
   >

   <div class="exerciseTitle">

    <div class="exerciseNameRow">

     <h3>${ex.name}</h3>

     <button
      class="favoriteButton"
      onclick="toggleFavorite('${currentDay}','${ex.name}',this)"
     >
      ☆
     </button>

    </div>

    <div class="prescription">
     ${ex.prescription}
    </div>

   </div>

  </div>


  <div class="lastCard">

   <small>ULTIMO CARICO</small>

   <strong>
    ${last ? last+" kg" : "-"}
   </strong>

  </div>


  <div class="newSets">

   ${renderNewSets(i, ex.sets)}

  </div>


  <div class="exerciseActions">

   <button onclick="showExerciseHistory('${ex.name}','${currentDay}')">
    📈
   </button>

   <button onclick="openExerciseNote('${currentDay}','${ex.name}')">
    📝
   </button>

   <button onclick="startTimer(${ex.rest})">
    ⏱ ${ex.rest}
   </button>

  </div>


 </div>

 `;

}


function renderNewSets(exIndex,total){

 let html="";

 for(let s=0;s<total;s++){

  html+=`

   <div class="newSetRow">

    <span>
     S${s+1}
    </span>

    <input
     type="number"
     placeholder="Kg"
     data-ex="${exIndex}"
     data-set="${s}"
     data-type="kg"
    >

    <input
     type="number"
     placeholder="Rip."
     data-ex="${exIndex}"
     data-set="${s}"
     data-type="reps"
    >

    <button
     class="setCheck"
     onclick="toggleSetComplete(this)"
    >
     ○
    </button>

   </div>

  `;

 }

 return html;

}



function toggleSetComplete(btn){

 btn.classList.toggle("completed");

 btn.textContent =
 btn.classList.contains("completed")
 ? "✓"
 : "○";

}

