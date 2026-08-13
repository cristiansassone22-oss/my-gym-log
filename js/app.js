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
 const ids = ["mobileScheda","mobileHistory","mobileProgress","mobileFavorites"];

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
