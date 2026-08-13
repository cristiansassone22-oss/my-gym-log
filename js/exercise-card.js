

function getCompletedSets(){

 return JSON.parse(
  localStorage.getItem("completedSets") || "{}"
 );

}


function saveCompletedSets(data){

 localStorage.setItem(
  "completedSets",
  JSON.stringify(data)
 );

}


function toggleSetComplete(btn, day, exercise, setIndex){

 let data=getCompletedSets();

 if(!data[day]){
  data[day]={};
 }

 if(!data[day][exercise]){
  data[day][exercise]=[];
 }


 const list=data[day][exercise];


 if(list.includes(setIndex)){

  data[day][exercise]=
   list.filter(i=>i!==setIndex);

  btn.classList.remove("completed");
  btn.textContent="○";


 }else{

  list.push(setIndex);

  btn.classList.add("completed");
  btn.textContent="✓";

 }


 saveCompletedSets(data);

}



function isSetCompleted(day, exercise, setIndex){

 const data=getCompletedSets();

 return data[day]?.[exercise]?.includes(setIndex) || false;

}


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

   ${renderNewSets(i, ex.name, ex.sets)}

  </div>


  <div class="exerciseActions">

   <button onclick="useLast(${i},${last || 0})">
    ↻
   </button>

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


function renderNewSets(exIndex,exercise,total){

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
     class="setCheck ${isSetCompleted(currentDay, exercise, s) ? "completed" : ""}"
     onclick="toggleSetComplete(this,'${currentDay}','${exercise}',${s})"
    >
     ${isSetCompleted(currentDay, exercise, s) ? "✓" : "○"}
    </button>

   </div>

  `;

 }

 return html;

}


