const workouts = {

A:{
 title:"Giorno A",
 subtitle:"Petto • Spalle • Tricipiti",
 exercises:[

  {
   name:"Panca piana bilanciere", photo:"images/panca-piana.jpg", gif:"gifs/panca-piana.gif",
   prescription:"4 × 6-8",
   sets:4,
   rest:120,
  },

  {
   name:"Panca inclinata manubri", photo:"images/panca-inclinata.jpg", gif:"gifs/panca-inclinata.gif",
   prescription:"3 × 8-10",
   sets:3,
   rest:90,
  },

  {
   name:"Croci ai cavi", photo:"images/croci-cavi.jpg", gif:"gifs/croci-cavi.gif",
   prescription:"3 × 12-15",
   sets:3,
   rest:60,
  },

  {
   name:"Shoulder Press", photo:"images/shoulder-press.jpg", gif:"gifs/shoulder-press.gif",
   prescription:"3 × 8-10",
   sets:3,
   rest:90,
  },

  {
   name:"Alzate laterali", photo:"images/alzate-laterali.jpg", gif:"gifs/alzate-laterali.gif",
   prescription:"3 × 15",
   sets:3,
   rest:60,
  },

  {
   name:"Pushdown ai cavi", photo:"images/pushdown.jpg", gif:"gifs/pushdown.gif",
   prescription:"3 × 10-12",
   sets:3,
   rest:60,
  },

  {
   name:"French Press EZ", photo:"images/french-press.jpg", gif:"gifs/french-press.gif",
   prescription:"3 × 10-12",
   sets:3,
   rest:60,
  }

 ]
},

B:{
 title:"Giorno B",
 subtitle:"Schiena • Bicipiti • Addome",
 exercises:[

  {
   name:"Lat Machine",
   prescription:"4 × 8-10",
   sets:4,
   rest:90,
  },

  {
   name:"Rematore macchina",
   prescription:"3 × 10",
   sets:3,
   rest:90,
  },

  {
   name:"Pulley basso",
   prescription:"3 × 10-12",
   sets:3,
   rest:75,
  },

  {
   name:"Face Pull",
   prescription:"3 × 15",
   sets:3,
   rest:60,
  },

  {
   name:"Curl bilanciere EZ",
   prescription:"3 × 8-10",
   sets:3,
   rest:75,
  },

  {
   name:"Curl inclinato manubri",
   prescription:"3 × 10-12",
   sets:3,
   rest:60,
  },

  {
   name:"Hammer Curl",
   prescription:"2 × 12",
   sets:2,
   rest:60,
  },

  {
   name:"Crunch ai cavi",
   prescription:"3 × 15",
   sets:3,
   rest:45,
  },

  {
   name:"Plank",
   prescription:"3 × 45-60 sec",
   sets:3,
   rest:45,
  }

 ]
},

C:{
 title:"Giorno C",
 subtitle:"Gambe • Spalle • Addome",
 exercises:[

  {
   name:"Squat / Multipower",
   prescription:"4 × 8",
   sets:4,
   rest:120,
  },

  {
   name:"Leg Press",
   prescription:"4 × 10",
   sets:4,
   rest:90,
  },

  {
   name:"Leg Curl",
   prescription:"3 × 12",
   sets:3,
   rest:75,
  },

  {
   name:"Leg Extension",
   prescription:"3 × 12",
   sets:3,
   rest:75,
  },

  {
   name:"Calf Raise",
   prescription:"4 × 15-20",
   sets:4,
   rest:60,
  },

  {
   name:"Alzate laterali", photo:"images/alzate-laterali.jpg", gif:"gifs/alzate-laterali.gif",
   prescription:"3 × 15",
   sets:3,
   rest:60,
  },

  {
   name:"Leg Raise",
   prescription:"3 × 15",
   sets:3,
   rest:45,
  },

  {
   name:"Crunch macchina",
   prescription:"3 × 20",
   sets:3,
   rest:45,
  }

 ]
}

};

let currentDay="A";
let timerInterval=null;


/* ELIMINA VECCHIA CACHE */
if("serviceWorker" in navigator){
 navigator.serviceWorker.getRegistrations().then(regs=>{
  regs.forEach(r=>r.unregister());
 });
}

if("caches" in window){
 caches.keys().then(keys=>{
  keys.forEach(k=>caches.delete(k));
 });
}


/* APRE IL GIORNO */

function openDay(day){

 currentDay=day;

 document.querySelectorAll(".tabs button")
  .forEach(b=>b.classList.remove("active"));

 document.getElementById("tab"+day)
  .classList.add("active");

 render();

}


/* CERCA ULTIMO CARICO */

function getLastWeight(name){

 const history=
 JSON.parse(
  localStorage.getItem("gymHistory") || "[]"
 );

 for(const session of history){

  const exercise=
  session.exercises.find(
   e=>e.name===name
  );

  if(!exercise) continue;

  const weights=
  exercise.sets
   .map(s=>parseFloat(s.kg))
   .filter(n=>!isNaN(n));

  if(weights.length)
   return weights[0];

 }

 return null;
}


/* RENDER */

function render(){

 const workout=workouts[currentDay];

 const content=
 document.getElementById("content");

 content.innerHTML=`

 <div class="titleBox">

  <small>ALLENAMENTO</small>

  <h2>${workout.title}</h2>

  <p>${workout.subtitle}</p>

 </div>

 `;


 workout.exercises.forEach((ex,i)=>{

  const last=
  getLastWeight(ex.name);

  let sets="";


  for(let s=0;s<ex.sets;s++){

   sets+=`

   <div class="set">

    <span>S${s+1}</span>

    <input
     type="number"
     step="0.5"
     inputmode="decimal"
     placeholder="Kg"
     data-ex="${i}"
     data-set="${s}"
     data-type="kg"
    >

    <input
     type="number"
     inputmode="numeric"
     placeholder="Rip."
     data-ex="${i}"
     data-set="${s}"
     data-type="reps"
    >

   </div>

   `;

  }


  content.innerHTML+=`

  <div class="exercise">

   <img
    class="exercisePhoto"
    src="${ex.photo}"
    alt="${ex.name}"
    loading="lazy"
   >

   <div class="exerciseBody">

    <div class="exerciseTop">

     <h3>${ex.name}</h3>

     <div class="prescription">
      ${ex.prescription}
     </div>

    </div>


    <div class="last">

     ${
      last
      ? "Ultimo carico: "+last+" kg"
      : "Primo allenamento"
     }

    </div>


    ${sets}


    <div class="exerciseButtons">

     <button
      class="lastButton"
      onclick="useLast(${i},${last || 0})"
     >
      Usa ultimo
     </button>


     <button
      class="timerButton"
      onclick="startTimer(${ex.rest})"
     >
      ⏱ ${ex.rest} sec
     </button>

    </div>

   </div>

  </div>

  `;

 });

}


/* USA ULTIMO PESO */

function useLast(index,kg){

 if(!kg){

  toast("Nessun peso precedente");

  return;

 }

 document
 .querySelectorAll(
  `[data-ex="${index}"][data-type="kg"]`
 )
 .forEach(input=>{
  input.value=kg;
 });

}


/* TIMER */

function startTimer(seconds){

 clearInterval(timerInterval);

 let remaining=seconds;

 const box=
 document.getElementById("timer");

 box.style.display="block";

 updateTimer(remaining);


 timerInterval=setInterval(()=>{

  remaining--;

  updateTimer(remaining);


  if(remaining<=0){

   clearInterval(timerInterval);

   document.getElementById(
    "timerText"
   ).innerText="VAI!";

   box.style.background=
   "#20c777";


   if("vibrate" in navigator){
    navigator.vibrate(
     [250,100,250]
    );
   }


   setTimeout(()=>{

    box.style.display="none";

    box.style.background=
    "#4c7dff";

   },2500);

  }

 },1000);

}


function updateTimer(sec){

 const min=
 Math.floor(sec/60);

 const seconds=
 sec%60;

 document.getElementById(
  "timerText"
 ).innerText=
 `${min}:${String(seconds).padStart(2,"0")}`;

}


/* SALVA */

function saveWorkout(){

 const workout=
 workouts[currentDay];

 const session={
  date:new Date().toISOString(),
  day:currentDay,
  exercises:[]
 };


 workout.exercises.forEach(
 (exercise,i)=>{

  const data={
   name:exercise.name,
   sets:[]
  };


  for(let s=0;s<exercise.sets;s++){

   const kg=
   document.querySelector(
    `[data-ex="${i}"][data-set="${s}"][data-type="kg"]`
   ).value;


   const reps=
   document.querySelector(
    `[data-ex="${i}"][data-set="${s}"][data-type="reps"]`
   ).value;


   data.sets.push({
    kg,
    reps
   });

  }


  session.exercises.push(
   data
  );

 });


 let history=
 JSON.parse(
  localStorage.getItem(
   "gymHistory"
  ) || "[]"
 );


 history.unshift(
  session
 );


 localStorage.setItem(
  "gymHistory",
  JSON.stringify(history)
 );


 toast(
  "Allenamento salvato ✓"
 );


 setTimeout(
  render,
  500
 );

}


/* MESSAGGIO */

function toast(text){

 const t=
 document.getElementById(
  "toast"
 );

 t.innerText=text;

 t.classList.add(
  "show"
 );

 setTimeout(()=>{

  t.classList.remove(
   "show"
  );

 },1800);

}



function showHistory(){

 const history =
 JSON.parse(
  localStorage.getItem("gymHistory") || "[]"
 );

 const content =
 document.getElementById("content");

 document.querySelectorAll(".tabs button")
 .forEach(b=>b.classList.remove("active"));

 if(!history.length){

  content.innerHTML = `
   <div class="titleBox">
    <small>STORICO</small>
    <h2>Allenamenti salvati</h2>
    <p>Nessun allenamento registrato.</p>
   </div>
  `;

  return;
 }

 let html = `
  <div class="titleBox">
   <small>STORICO</small>
   <h2>Allenamenti salvati</h2>
   <p>${history.length} sessioni registrate</p>
  </div>
 `;

 history.forEach(session=>{

  const date =
  new Date(session.date)
  .toLocaleString("it-IT",{
   dateStyle:"medium",
   timeStyle:"short"
  });

  html += `
   <div class="exercise">
    <div class="exerciseBody">
     <div class="exerciseTop">
      <h3>Giorno ${session.day}</h3>
      <div class="prescription">${date}</div>
     </div>
  `;

  session.exercises.forEach(ex=>{

   const sets = ex.sets
   .filter(s=>s.kg || s.reps)
   .map(s=>`${s.kg || "-"} kg × ${s.reps || "-"}`)
   .join(" • ");

   if(sets){

    html += `
     <div style="
      margin-top:12px;
      padding-top:12px;
      border-top:1px solid #2a3241;
     ">
      <strong>${ex.name}</strong>
      <div style="
       margin-top:5px;
       color:#949eae;
       font-size:13px;
       line-height:1.6;
      ">
       ${sets}
      </div>
     </div>
    `;

   }

  });

  html += `
    </div>
   </div>
  `;

 });

 content.innerHTML = html;
}


function showProgress(){

 const history =
 JSON.parse(
  localStorage.getItem("gymHistory") || "[]"
 );

 const content =
 document.getElementById("content");

 document.querySelectorAll(".tabs button")
 .forEach(b=>b.classList.remove("active"));

 const latest = {};

 history.forEach(session=>{

  session.exercises.forEach(ex=>{

   if(latest[ex.name]) return;

   const weights = ex.sets
   .map(s=>parseFloat(s.kg))
   .filter(n=>!isNaN(n));

   if(weights.length){

    latest[ex.name] = Math.max(...weights);

   }

  });

 });

 const principal = [
  "Panca piana bilanciere",
  "Lat Machine",
  "Squat / Multipower",
  "Leg Press",
  "Shoulder Press"
 ];

 let cards = "";

 principal.forEach(name=>{

  const value = latest[name];

  cards += `
   <div class="exercise">
    <div class="exerciseBody">
     <div class="exerciseTop">
      <h3>${name}</h3>
      <div class="prescription">
       ${value ? value + " kg" : "-"}
      </div>
     </div>

     <div class="last">
      Ultimo carico massimo registrato
     </div>

    </div>
   </div>
  `;

 });

 content.innerHTML = `
  <div class="titleBox">
   <small>PROGRESSI</small>
   <h2>I tuoi carichi</h2>
   <p>Ultimi valori registrati</p>
  </div>

  ${cards}
 `;
}

openDay("A");


function showGif(src, name){
 if(!src) return;

 const old = document.getElementById("gifModal");
 if(old) old.remove();

 const modal = document.createElement("div");
 modal.id = "gifModal";

 modal.style.cssText = `
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.88);
  z-index:9999;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:20px;
 `;

 modal.innerHTML = `
  <div style="
   width:100%;
   max-width:520px;
   background:#151922;
   border:1px solid #2a3241;
   border-radius:18px;
   padding:14px;
  ">
   <div style="
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:10px;
    margin-bottom:10px;
   ">
    <strong>${name}</strong>
    <button
     onclick="document.getElementById('gifModal').remove()"
     style="
      border:0;
      background:#2a3241;
      color:white;
      border-radius:10px;
      padding:8px 12px;
      font-weight:800;
     "
    >
     Chiudi
    </button>
   </div>

   <img
    src="${src}"
    style="
     width:100%;
     border-radius:12px;
     display:block;
     background:#000;
    "
   >
  </div>
 `;

 document.body.appendChild(modal);
}
