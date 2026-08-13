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
   name:"Lat Machine", photo:"images/lat-machine.jpg", gif:"gifs/lat-machine.gif",
   prescription:"4 × 8-10",
   sets:4,
   rest:90,
  },

  {
   name:"Rematore macchina", photo:"images/rematore.jpg", gif:"gifs/rematore.gif",
   prescription:"3 × 10",
   sets:3,
   rest:90,
  },

  {
   name:"Pulley basso", photo:"images/pulley.jpg", gif:"gifs/pulley.gif",
   prescription:"3 × 10-12",
   sets:3,
   rest:75,
  },

  {
   name:"Face Pull", photo:"images/face-pull.jpg", gif:"gifs/face-pull.gif",
   prescription:"3 × 15",
   sets:3,
   rest:60,
  },

  {
   name:"Curl bilanciere EZ", photo:"images/curl-ez.jpg", gif:"gifs/curl-ez.gif",
   prescription:"3 × 8-10",
   sets:3,
   rest:75,
  },

  {
   name:"Curl inclinato manubri", photo:"images/curl-inclinato.jpg", gif:"gifs/curl-inclinato.gif",
   prescription:"3 × 10-12",
   sets:3,
   rest:60,
  },

  {
   name:"Hammer Curl", photo:"images/hammer-curl.jpg", gif:"gifs/hammer-curl.gif",
   prescription:"2 × 12",
   sets:2,
   rest:60,
  },

  {
   name:"Crunch ai cavi", photo:"images/crunch-cavi.jpg", gif:"gifs/crunch-cavi.gif",
   prescription:"3 × 15",
   sets:3,
   rest:45,
  },

  {
   name:"Plank", photo:"images/plank.jpg", gif:"gifs/plank.gif",
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
   name:"Squat / Multipower", photo:"images/squat.jpg", gif:"gifs/squat.gif",
   prescription:"4 × 8",
   sets:4,
   rest:120,
  },

  {
   name:"Leg Press", photo:"images/leg-press.jpg", gif:"gifs/leg-press.gif",
   prescription:"4 × 10",
   sets:4,
   rest:90,
  },

  {
   name:"Leg Curl", photo:"images/leg-curl.jpg", gif:"gifs/leg-curl.gif",
   prescription:"3 × 12",
   sets:3,
   rest:75,
  },

  {
   name:"Leg Extension", photo:"images/leg-extension.jpg", gif:"gifs/leg-extension.gif",
   prescription:"3 × 12",
   sets:3,
   rest:75,
  },

  {
   name:"Calf Raise", photo:"images/calf-raise.jpg", gif:"gifs/calf-raise.gif",
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
   name:"Leg Raise", photo:"images/leg-raise.jpg", gif:"gifs/leg-raise.gif",
   prescription:"3 × 15",
   sets:3,
   rest:45,
  },

  {
   name:"Crunch macchina", photo:"images/crunch-macchina.jpg", gif:"gifs/crunch-macchina.gif",
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
    src="${ex.gif || ex.photo}"
    alt="${ex.name}"
    loading="lazy"
   >

   <div class="exerciseBody">

    <div class="exerciseTop">

     <div>
      <h3>${ex.name}</h3>
     </div>

     <div class="exerciseTopActions">

      <button
       class="favoriteButton ${isFavorite(currentDay, ex.name) ? 'active' : ''}"
       onclick="toggleFavorite('${currentDay}','${ex.name}',this)"
       aria-label="Preferito"
      >
       ${isFavorite(currentDay, ex.name) ? '★' : '☆'}
      </button>

      <div class="prescription">
       ${ex.prescription}
      </div>

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
      class="historyButton"
      onclick="showExerciseHistory('${ex.name}','${currentDay}')"
     >
      📈 Carichi
     </button>

     <button
      class="noteButton"
      onclick="openExerciseNote('${currentDay}','${ex.name}')"
     >
      📝 Note
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

 let remaining = seconds;

 let old = document.getElementById("timerOverlay");
 if(old) old.remove();

 const overlay = document.createElement("div");
 overlay.id = "timerOverlay";

 overlay.innerHTML = `
  <div class="timerPanel">

   <div class="timerLabel">RECUPERO</div>

   <div id="timerBig" class="timerBig"></div>

   <div class="timerControls">
    <button onclick="changeTimer(-30)">-30 sec</button>
    <button onclick="changeTimer(30)">+30 sec</button>
    <button class="timerStop" onclick="stopTimer()">Stop</button>
   </div>

  </div>
 `;

 document.body.appendChild(overlay);

 function renderTimer(){
  const min = Math.floor(remaining / 60);
  const sec = remaining % 60;

  const el = document.getElementById("timerBig");
  if(el){
   el.textContent =
    `${min}:${String(sec).padStart(2,"0")}`;
  }
 }

 window.changeTimer = function(value){
  remaining = Math.max(0, remaining + value);
  renderTimer();
 };

 window.stopTimer = function(){
  clearInterval(timerInterval);
  document.getElementById("timerOverlay")?.remove();
 };

 renderTimer();

 timerInterval = setInterval(()=>{

  remaining--;

  renderTimer();

  if(remaining <= 0){

   clearInterval(timerInterval);

   const el = document.getElementById("timerBig");

   if(el){
    el.textContent = "VAI!";
    el.classList.add("timerDone");
   }

   if("vibrate" in navigator){
    navigator.vibrate([250,120,250,120,350]);
   }

   try{
    const AudioCtx =
      window.AudioContext || window.webkitAudioContext;

    const ctx = new AudioCtx();

    const playBeep = (freq, start, duration) => {
     const osc = ctx.createOscillator();
     const gain = ctx.createGain();

     osc.frequency.value = freq;
     osc.type = "sine";

     osc.connect(gain);
     gain.connect(ctx.destination);

     gain.gain.setValueAtTime(
      0.25,
      ctx.currentTime + start
     );

     gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + start + duration
     );

     osc.start(ctx.currentTime + start);
     osc.stop(ctx.currentTime + start + duration);
    };

    playBeep(880,0,0.35);
    playBeep(1050,0.45,0.35);
    playBeep(1250,0.9,0.55);

   }catch(e){}

   setTimeout(()=>{
    document.getElementById("timerOverlay")?.remove();
   },3000);

  }

 },1000);

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

function setMobileNav(active){
 const ids = ["mobileScheda","mobileHistory","mobileProgress","mobileFavorites","mobileEditHistory","mobileBackup"];

 ids.forEach(id=>{
  const el=document.getElementById(id);
  if(el) el.classList.remove("active");
 });

 const current=document.getElementById(active);
 if(current) current.classList.add("active");
}

const _oldOpenDay = openDay;
openDay = function(day){
 _oldOpenDay(day);

 const saveButton = document.querySelector(".save");
 if(saveButton) saveButton.style.display = "";

 setMobileNav("mobileScheda");
};

const _oldShowHistory = showHistory;
showHistory = function(){
 _oldShowHistory();
 setMobileNav("mobileHistory");
};

const _oldShowProgress = showProgress;
showProgress = function(){
 _oldShowProgress();
 setMobileNav("mobileProgress");
};


function openVideo(src,title){

 if(!src) return;

 const old=document.getElementById("videoModal");
 if(old) old.remove();

 const modal=document.createElement("div");
 modal.id="videoModal";

 modal.style.cssText=`
 position:fixed;
 inset:0;
 background:rgba(0,0,0,.94);
 display:flex;
 align-items:center;
 justify-content:center;
 z-index:99999;
 padding:18px;
 `;

 modal.innerHTML=`
 <div style="
 width:100%;
 max-width:520px;
 ">

 <div style="
 display:flex;
 justify-content:space-between;
 align-items:center;
 color:white;
 margin-bottom:14px;
 ">

 <strong>${title}</strong>

 <button
 onclick="document.getElementById('videoModal').remove()"
 style="
 background:#2962ff;
 color:white;
 border:0;
 border-radius:12px;
 padding:10px 16px;
 font-weight:700;
 ">
 Chiudi
 </button>

 </div>

 <img
 src="${src}"
 style="
 width:100%;
 border-radius:18px;
 background:#111;
 display:block;
 ">

 </div>
 `;

 modal.onclick=e=>{
   if(e.target===modal) modal.remove();
 };

 document.body.appendChild(modal);

}



function showExerciseHistory(name, day){

 const history =
 JSON.parse(
  localStorage.getItem("gymHistory") || "[]"
 );

 const content =
 document.getElementById("content");

 const sessions = [];

 history.forEach(session => {

  if(session.day !== day) return;

  const exercise =
  session.exercises?.find(
   e => e.name === name
  );

  if(!exercise) return;

  const sets =
  (exercise.sets || []).filter(s => {
   const kg = String(s.kg ?? "").trim();
   const reps = String(s.reps ?? "").trim();
   return kg !== "" || reps !== "";
  });

  if(!sets.length) return;

  sessions.push({
   date: session.date,
   sets: sets
  });

 });

 sessions.sort(
  (a,b) => new Date(b.date) - new Date(a.date)
 );

 let html = `
  <div class="titleBox">
   <small>GIORNO ${day} · CRONOLOGIA</small>
   <h2>📈 ${name}</h2>
   <p>${sessions.length} allenamenti registrati</p>
  </div>

  <button
   onclick="openDay('${day}')"
   style="
    width:100%;
    min-height:46px;
    margin-bottom:12px;
    border:0;
    border-radius:14px;
    background:#252c38;
    color:white;
    font-weight:800;
   "
  >
   ← Torna alla scheda
  </button>
 `;

 if(!sessions.length){

  html += `
   <div class="exercise">
    <div class="exerciseBody">
     <div class="last">
      Nessun carico registrato.
     </div>
    </div>
   </div>
  `;

 } else {

  sessions.forEach(item => {

   const date =
   new Date(item.date).toLocaleDateString(
    "it-IT",
    {
     day:"2-digit",
     month:"2-digit",
     year:"numeric"
    }
   );

   const sets = item.sets
   .map((set,index) => {

    const kg =
    set.kg !== "" && set.kg != null
    ? set.kg + " kg"
    : "-";

    const reps =
    set.reps !== "" && set.reps != null
    ? set.reps + " rip."
    : "-";

    return `
     <div style="
      display:grid;
      grid-template-columns:45px 1fr 1fr;
      gap:8px;
      padding:8px 0;
      border-bottom:1px solid #2a3241;
     ">
      <span style="color:#949eae">
       S${index+1}
      </span>
      <strong>${kg}</strong>
      <span>${reps}</span>
     </div>
    `;
   }).join("");

   html += `
    <div class="exercise">
     <div class="exerciseBody">

      <div class="exerciseTop">
       <h3>${date}</h3>
      </div>

      ${sets}

     </div>
    </div>
   `;

  });

 }

 content.innerHTML = html;

 setMobileNav("mobileScheda");
}


function noteStorageKey(day, name){
 return `gymNote::${day}::${name}`;
}

function openExerciseNote(day, name){

 const old = document.getElementById("noteModal");
 if(old) old.remove();

 const saved =
 localStorage.getItem(
  noteStorageKey(day, name)
 ) || "";

 const modal =
 document.createElement("div");

 modal.id = "noteModal";
 modal.className = "noteModal";

 modal.innerHTML = `
  <div class="notePanel">

   <div class="noteHeader">

    <div>
     <div class="noteEyebrow">
      GIORNO ${day} · NOTE
     </div>

     <h3>${name}</h3>
    </div>

    <button
     class="noteClose"
     onclick="closeExerciseNote()"
    >
     ✕
    </button>

   </div>

   <textarea
    id="exerciseNoteText"
    class="noteTextarea"
    placeholder="Scrivi una nota per questo esercizio..."
   ></textarea>

   <div class="noteActions">

    <button
     class="noteCancel"
     onclick="closeExerciseNote()"
    >
     Annulla
    </button>

    <button
     class="noteSave"
     onclick="saveExerciseNote('${day}','${name}')"
    >
     Salva
    </button>

   </div>

  </div>
 `;

 document.body.appendChild(modal);

 document.getElementById(
  "exerciseNoteText"
 ).value = saved;

 modal.addEventListener(
  "click",
  e=>{
   if(e.target === modal){
    closeExerciseNote();
   }
  }
 );

 setTimeout(()=>{
  document.getElementById(
   "exerciseNoteText"
  )?.focus();
 },50);

}

function saveExerciseNote(day, name){

 const text =
 document.getElementById(
  "exerciseNoteText"
 )?.value || "";

 localStorage.setItem(
  noteStorageKey(day, name),
  text.trim()
 );

 closeExerciseNote();

 toast("Nota salvata ✓");

}

function closeExerciseNote(){
 document.getElementById(
  "noteModal"
 )?.remove();
}


/* =========================
   PREFERITI
========================= */

function getFavorites(){

 try{
  return JSON.parse(
   localStorage.getItem("gymFavorites") || "[]"
  );
 }catch{
  return [];
 }

}

function saveFavorites(favorites){

 localStorage.setItem(
  "gymFavorites",
  JSON.stringify(favorites)
 );

}

function favoriteKey(day,name){
 return `${day}::${name}`;
}

function isFavorite(day,name){

 return getFavorites().includes(
  favoriteKey(day,name)
 );

}

function toggleFavorite(day,name,button){

 let favorites = getFavorites();

 const key = favoriteKey(day,name);

 if(favorites.includes(key)){

  favorites = favorites.filter(
   item => item !== key
  );

  button?.classList.remove("active");

  if(button){
   button.textContent = "☆";
  }

  toast("Rimosso dai preferiti");

 }else{

  favorites.push(key);

  button?.classList.add("active");

  if(button){
   button.textContent = "★";
  }

  toast("Aggiunto ai preferiti ⭐");

 }

 saveFavorites(favorites);

}

function showFavorites(){

 const favorites = getFavorites();

 const content =
 document.getElementById("content");

 document.querySelectorAll(".tabs button")
 .forEach(b => b.classList.remove("active"));

 let items = [];

 Object.entries(workouts).forEach(
 ([day,workout]) => {

  workout.exercises.forEach(ex => {

   if(
    favorites.includes(
     favoriteKey(day,ex.name)
    )
   ){

    items.push({
     day,
     ...ex
    });

   }

  });

 });

 let html = `
  <div class="titleBox">
   <small>PREFERITI</small>
   <h2>⭐ I tuoi esercizi</h2>
   <p>${items.length} esercizi salvati</p>
  </div>
 `;

 if(!items.length){

  html += `
   <div class="exercise">
    <div class="exerciseBody">
     <div class="last">
      Non hai ancora aggiunto esercizi ai preferiti.
     </div>
    </div>
   </div>
  `;

 }else{

  items.forEach(ex => {

   const last =
   getLastWeight(ex.name);

   html += `
    <div class="exercise favoriteCard">

     <img
      class="exercisePhoto"
      src="${ex.gif || ex.photo}"
      alt="${ex.name}"
      loading="lazy"
     >

     <div class="exerciseBody">

      <div class="exerciseTop">

       <div>
        <div class="favoriteDay">
         GIORNO ${ex.day}
        </div>

        <h3>${ex.name}</h3>
       </div>

       <button
        class="favoriteButton active"
        onclick="removeFavoriteFromList('${ex.day}','${ex.name}')"
       >
        ★
       </button>

      </div>

      <div class="last">
       ${
        last
        ? `Ultimo carico: ${last} kg`
        : "Nessun carico precedente"
       }
      </div>

      <button
       class="openFavoriteButton"
       onclick="openFavoriteExercise('${ex.day}','${ex.name}')"
      >
       Apri nella scheda →
      </button>

     </div>

    </div>
   `;

  });

 }

 content.innerHTML = html;

 setMobileNav("mobileFavorites");

}

function removeFavoriteFromList(day,name){

 let favorites = getFavorites();

 favorites =
 favorites.filter(
  item => item !== favoriteKey(day,name)
 );

 saveFavorites(favorites);

 showFavorites();

 toast("Rimosso dai preferiti");

}

function openFavoriteExercise(day,name){

 openDay(day);

 setTimeout(()=>{

  const titles =
  [...document.querySelectorAll(".exercise h3")];

  const title =
  titles.find(
   el => el.textContent.trim() === name
  );

  if(title){

   title
    .closest(".exercise")
    ?.scrollIntoView({
     behavior:"smooth",
     block:"start"
    });

  }

 },100);

}


/* ==========================
   GRAFICI
========================== */

function showCharts(){

 const history =
 JSON.parse(
  localStorage.getItem("gymHistory") || "[]"
 );

 const content =
 document.getElementById("content");

 let html = `
 <div class="titleBox">
  <small>GRAFICI</small>
  <h2>📊 Progressi</h2>
  <p>Andamento dei tuoi esercizi</p>
 </div>
 `;

 if(!history.length){

  html += `
  <div class="exercise">
   <div class="exerciseBody">
    <div class="last">
     Nessun allenamento disponibile.
    </div>
   </div>
  </div>
  `;

  content.innerHTML = html;
  setMobileNav("mobileCharts");
  return;

 }

 const stats = {};

 history.slice().reverse().forEach(session=>{

  session.exercises.forEach(ex=>{

   const weight = Math.max(
    ...ex.sets
     .map(s=>parseFloat(s.kg))
     .filter(n=>!isNaN(n)),
    0
   );

   if(weight===0) return;

   if(!stats[ex.name])
      stats[ex.name]=[];

   stats[ex.name].push(weight);

  });

 });

 Object.entries(stats).forEach(([name,data])=>{

  const max = Math.max(...data);

 const width=340;
 const height=170;
 const pad=20;

 const points=data.map((v,i)=>{

  const x=
  data.length===1
  ? width/2
  : pad+i*((width-pad*2)/(data.length-1));

  const y=
  height-pad-
  ((v/max)*(height-pad*2));

  return {x,y,v};

 });

 let path="";

 points.forEach((p,i)=>{

  path+=
  (i===0?"M":"L")+
  p.x+" "+p.y+" ";

 });

 let circles="";

 points.forEach(p=>{

  circles+=`
   <circle
    cx="${p.x}"
    cy="${p.y}"
    r="5"
    fill="#4c7dff"
   />
  `;

 });

 html+=`

 <div class="exercise">

  <div class="exerciseBody">

   <div class="exerciseTop">

    <h3>${name}</h3>

    <div class="prescription">
     🏆 ${max} kg
    </div>

   </div>

   <svg
    viewBox="0 0 ${width} ${height}"
    style="
    width:100%;
    margin-top:18px;
    ">

    <path
     d="${path}"
     fill="none"
     stroke="#4c7dff"
     stroke-width="4"
     stroke-linecap="round"
     stroke-linejoin="round"
    />

    ${circles}

   </svg>

   <div style="
   display:grid;
   grid-template-columns:repeat(4,1fr);
   margin-top:14px;
   gap:8px;
   text-align:center;
   ">

    <div>
     <small style="color:#8b95a7">Record</small>
     <strong style="display:block">${max} kg</strong>
    </div>

    <div>
     <small style="color:#8b95a7">Ultimo</small>
     <strong style="display:block">${data[data.length-1]} kg</strong>
    </div>

    <div>
     <small style="color:#8b95a7">Sessioni</small>
     <strong style="display:block">${data.length}</strong>
    </div>

    <div>
     <small style="color:#8b95a7">Δ</small>
     <strong style="display:block">
      ${
      data.length>1
      ? (data[data.length-1]-data[0]>0?"+":"")
        +(data[data.length-1]-data[0])
      : "-"
      }
     </strong>
    </div>

   </div>

  </div>

 </div>

 `;

 });

 content.innerHTML = html;

 setMobileNav("mobileCharts");

}


async function importManualHistory(){

 if(localStorage.getItem("manualHistoryImportedV1")){
  return;
 }

 try{

  const response = await fetch("data/gymHistory.json");

  if(!response.ok) return;

  const imported = await response.json();

  const current =
  JSON.parse(
   localStorage.getItem("gymHistory") || "[]"
  );

  imported.forEach(session => {

   const alreadyExists = current.some(existing =>
    existing.date === session.date &&
    existing.day === session.day
   );

   if(!alreadyExists){
    current.push(session);
   }

  });

  current.sort(
   (a,b) => new Date(b.date) - new Date(a.date)
  );

  localStorage.setItem(
   "gymHistory",
   JSON.stringify(current)
  );

  localStorage.setItem(
   "manualHistoryImportedV1",
   "true"
  );

  console.log("Storico manuale importato.");

 }catch(error){
  console.error("Errore import storico:",error);
 }

}

importManualHistory();


/* =========================
   MODIFICA STORICO
========================= */

function showEditHistory(){

 const history =
 JSON.parse(
  localStorage.getItem("gymHistory") || "[]"
 );

 const content =
 document.getElementById("content");

 const saveButton =
 document.querySelector(".save");

 if(saveButton){
  saveButton.style.display = "none";
 }

 document.querySelectorAll(".tabs button")
 .forEach(b=>b.classList.remove("active"));

 let html = `
  <div class="titleBox">
   <small>GESTIONE STORICO</small>
   <h2>✏️ Modifica allenamenti</h2>
   <p>${history.length} sessioni salvate</p>
  </div>
 `;

 if(!history.length){

  html += `
   <div class="exercise">
    <div class="exerciseBody">
     <div class="last">
      Nessun allenamento salvato.
     </div>
    </div>
   </div>
  `;

  content.innerHTML = html;
  setMobileNav("mobileEditHistory");
  return;
 }

 history.forEach((session,index)=>{

  const date =
  new Date(session.date)
  .toLocaleString("it-IT",{
   dateStyle:"medium",
   timeStyle:"short"
  });

  const completedExercises =
  (session.exercises || [])
  .filter(ex =>
   (ex.sets || []).some(
    set => set.kg || set.reps
   )
  ).length;

  html += `
   <div class="exercise editHistoryCard">

    <div class="exerciseBody">

     <div class="exerciseTop">

      <div>
       <div class="editHistoryDay">
        GIORNO ${session.day}
       </div>

       <h3>${date}</h3>
      </div>

      <div class="prescription">
       ${completedExercises} esercizi
      </div>

     </div>

     <div class="editHistoryActions">

      <button
       class="editWorkoutButton"
       onclick="editWorkout(${index})"
      >
       ✏️ Modifica
      </button>

      <button
       class="deleteWorkoutButton"
       onclick="deleteWorkout(${index})"
      >
       🗑️ Elimina
      </button>

     </div>

    </div>

   </div>
  `;

 });

 content.innerHTML = html;

 setMobileNav("mobileEditHistory");
}


function editWorkout(index){

 const history =
 JSON.parse(
  localStorage.getItem("gymHistory") || "[]"
 );

 const session = history[index];

 if(!session){
  toast("Allenamento non trovato");
  return;
 }

 const content =
 document.getElementById("content");

 const saveButton =
 document.querySelector(".save");

 if(saveButton){
  saveButton.style.display = "none";
 }

 const date =
 new Date(session.date)
 .toLocaleString("it-IT",{
  dateStyle:"medium",
  timeStyle:"short"
 });

 let html = `
  <div class="titleBox">
   <small>MODIFICA ALLENAMENTO</small>
   <h2>Giorno ${session.day}</h2>
   <p>${date}</p>
  </div>

  <button
   class="editBackButton"
   onclick="showEditHistory()"
  >
   ← Torna allo storico
  </button>
 `;

 (session.exercises || []).forEach(
 (exercise,exerciseIndex)=>{

  let setsHTML = "";

  (exercise.sets || []).forEach(
  (set,setIndex)=>{

   setsHTML += `
    <div class="editSetRow">

     <span>
      S${setIndex+1}
     </span>

     <input
      type="text"
      inputmode="decimal"
      value="${escapeEditValue(set.kg)}"
      placeholder="Kg"
      data-edit-ex="${exerciseIndex}"
      data-edit-set="${setIndex}"
      data-edit-type="kg"
     >

     <input
      type="text"
      inputmode="numeric"
      value="${escapeEditValue(set.reps)}"
      placeholder="Rip."
      data-edit-ex="${exerciseIndex}"
      data-edit-set="${setIndex}"
      data-edit-type="reps"
     >

    </div>
   `;

  });

  html += `
   <div class="exercise">

    <div class="exerciseBody">

     <div class="exerciseTop">
      <h3>${exercise.name}</h3>
     </div>

     <div class="editSetHeader">
      <span></span>
      <span>Kg</span>
      <span>Rip.</span>
     </div>

     ${setsHTML}

    </div>

   </div>
  `;

 });

 html += `
  <div class="editSaveActions">

   <button
    class="editCancelButton"
    onclick="showEditHistory()"
   >
    Annulla
   </button>

   <button
    class="editSaveButton"
    onclick="saveEditedWorkout(${index})"
   >
    💾 Salva modifiche
   </button>

  </div>
 `;

 content.innerHTML = html;

 window.scrollTo({
  top:0,
  behavior:"smooth"
 });

 setMobileNav("mobileEditHistory");
}


function escapeEditValue(value){

 return String(value ?? "")
 .replaceAll("&","&amp;")
 .replaceAll('"',"&quot;")
 .replaceAll("<","&lt;")
 .replaceAll(">","&gt;");

}


function saveEditedWorkout(index){

 const history =
 JSON.parse(
  localStorage.getItem("gymHistory") || "[]"
 );

 const session = history[index];

 if(!session){
  toast("Allenamento non trovato");
  return;
 }

 (session.exercises || []).forEach(
 (exercise,exerciseIndex)=>{

  (exercise.sets || []).forEach(
  (set,setIndex)=>{

   const kgInput =
   document.querySelector(
    `[data-edit-ex="${exerciseIndex}"][data-edit-set="${setIndex}"][data-edit-type="kg"]`
   );

   const repsInput =
   document.querySelector(
    `[data-edit-ex="${exerciseIndex}"][data-edit-set="${setIndex}"][data-edit-type="reps"]`
   );

   if(kgInput){
    set.kg = kgInput.value.trim();
   }

   if(repsInput){
    set.reps = repsInput.value.trim();
   }

  });

 });

 history[index] = session;

 localStorage.setItem(
  "gymHistory",
  JSON.stringify(history)
 );

 toast("Allenamento aggiornato ✓");

 showEditHistory();
}


function deleteWorkout(index){

 const history =
 JSON.parse(
  localStorage.getItem("gymHistory") || "[]"
 );

 const session = history[index];

 if(!session) return;

 const date =
 new Date(session.date)
 .toLocaleDateString("it-IT");

 const confirmed =
 confirm(
  `Eliminare definitivamente il Giorno ${session.day} del ${date}?`
 );

 if(!confirmed) return;

 history.splice(index,1);

 localStorage.setItem(
  "gymHistory",
  JSON.stringify(history)
 );

 toast("Allenamento eliminato");

 showEditHistory();
}



/* =========================
   BACKUP DATI
========================= */

function showBackup(){

 const content =
 document.getElementById("content");

 content.innerHTML = `

 <div class="titleBox">
  <small>BACKUP</small>
  <h2>📦 Gestione dati</h2>
  <p>Salva o ripristina i tuoi allenamenti</p>
 </div>


 <div class="exercise">

  <div class="exerciseBody">

   <button
    class="backupButton"
    onclick="exportBackup()"
   >
    📤 Esporta dati
   </button>

   <button
    class="backupButton"
    onclick="generatePDFReport()"
   >
    📄 Genera Report PDF
   </button>


   <label class="backupButton importLabel">

    📥 Importa dati

    <input
     type="file"
     accept=".json"
     onchange="importBackup(event)"
     hidden
    >

   </label>


  </div>

 </div>

 `;

 setMobileNav("mobileBackup");

}


function exportBackup(){

 const backup={

  version:1,

  date:new Date().toISOString(),

  gymHistory:
  localStorage.getItem("gymHistory"),

  notes:
  Object.keys(localStorage)
  .filter(k=>k.startsWith("gymNote::"))
  .reduce((obj,k)=>{
    obj[k]=localStorage.getItem(k);
    return obj;
  },{}),

  favorites:
  localStorage.getItem("gymFavorites")

 };


 const blob =
 new Blob(
  [
   JSON.stringify(
    backup,
    null,
    2
   )
  ],
  {
   type:"application/json"
  }
 );


 const url =
 URL.createObjectURL(blob);


 const a =
 document.createElement("a");

 a.href=url;

 a.download=
 "my-gym-log-backup.json";


 a.click();


 URL.revokeObjectURL(url);


 toast("Backup creato ✓");

}


function importBackup(event){

 const file =
 event.target.files[0];

 if(!file) return;


 const reader =
 new FileReader();


 reader.onload=function(e){

  const backup =
  JSON.parse(e.target.result);


  if(backup.gymHistory){

   localStorage.setItem(
    "gymHistory",
    backup.gymHistory
   );

  }


  if(backup.favorites){

   localStorage.setItem(
    "gymFavorites",
    backup.favorites
   );

  }


  if(backup.notes){

   Object.entries(
    backup.notes
   ).forEach(([k,v])=>{

    localStorage.setItem(
     k,
     v
    );

   });

  }


  toast("Dati ripristinati ✓");

  setTimeout(
   ()=>location.reload(),
   800
  );


 };


 reader.readAsText(file);

}



/* =========================
   REPORT PDF
========================= */

function generatePDFReport(){

 const {
  jsPDF
 } = window.jspdf;


 const doc =
 new jsPDF();


 const history =
 JSON.parse(
  localStorage.getItem("gymHistory") || "[]"
 );


 let y=20;


 doc.setFontSize(20);
 doc.text(
  "MY GYM LOG - REPORT",
  20,
  y
 );


 y+=15;


 doc.setFontSize(12);

 doc.text(
  "Data report: "+
  new Date().toLocaleDateString("it-IT"),
  20,
  y
 );


 y+=15;


 doc.text(
  "Allenamenti registrati: "+
  history.length,
  20,
  y
 );


 y+=15;


 const stats={};


 history.forEach(session=>{

  session.exercises.forEach(ex=>{

   const weights =
   ex.sets
   .map(s=>parseFloat(s.kg))
   .filter(n=>!isNaN(n));


   if(weights.length){

    if(!stats[ex.name]){
     stats[ex.name]=[];
    }

    stats[ex.name].push(
     Math.max(...weights)
    );

   }

  });

 });


 y+=10;


 doc.setFontSize(16);
 doc.text(
  "Record esercizi",
  20,
  y
 );


 y+=10;

 doc.setFontSize(11);


 Object.entries(stats)
 .forEach(([name,data])=>{

  const max =
  Math.max(...data);


  if(y>270){

   doc.addPage();
   y=20;

  }


  doc.text(
   `${name}: ${max} kg`,
   20,
   y
  );

  y+=7;

 });


 y+=10;


 doc.setFontSize(16);

 doc.text(
  "Storico allenamenti",
  20,
  y
 );


 y+=10;

 doc.setFontSize(10);


 history.forEach(session=>{

  if(y>270){

   doc.addPage();
   y=20;

  }


  const date =
  new Date(session.date)
  .toLocaleDateString("it-IT");


  doc.text(
   `Giorno ${session.day} - ${date}`,
   20,
   y
  );


  y+=6;


  session.exercises.forEach(ex=>{

   const sets =
   ex.sets
   .filter(s=>s.kg || s.reps)
   .map(
    s=>`${s.kg || "-"}kg x ${s.reps || "-"}`
   )
   .join(" | ");


   if(sets){

    if(y>270){

     doc.addPage();
     y=20;

    }


    doc.text(
     ex.name+": "+sets,
     25,
     y
    );

    y+=6;

   }

  });


  y+=5;

 });


 doc.save(
  "My-Gym-Log-Report.pdf"
 );


 toast("PDF creato ✓");

}

