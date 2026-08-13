
function getDraftWorkout(){

 if(localStorage.getItem("draftCleared")){
  return {};
 }

 return JSON.parse(
  localStorage.getItem("draftWorkout") || "{}"
 );

}


function saveDraftValue(day, exercise, set, type, value){

 const draft=getDraftWorkout();

 if(!draft[day]){
  draft[day]={};
 }

 if(!draft[day][exercise]){
  draft[day][exercise]={};
 }

 if(!draft[day][exercise][set]){
  draft[day][exercise][set]={};
 }

 draft[day][exercise][set][type]=value;

 localStorage.setItem(
  "draftWorkout",
  JSON.stringify(draft)
 );

}


function getDraftValue(day, exercise, set, type){

 const draft=getDraftWorkout();

 return draft[day]?.[exercise]?.[set]?.[type] || "";

}


function attachDraftManager(){

 document.querySelectorAll(".newSetRow input")
 .forEach(input=>{

  input.value =
   getDraftValue(
    currentDay,
    input.dataset.exercise,
    input.dataset.set,
    input.dataset.type
   );


  input.addEventListener("input",()=>{

   saveDraftValue(
    currentDay,
    input.dataset.exercise,
    input.dataset.set,
    input.dataset.type,
    input.value
   );

  });

 });

}



window.addEventListener("load",()=>{

 setTimeout(()=>{

  if(typeof attachDraftManager==="function"){
   attachDraftManager();
  }

 },500);

});

