function getDraftWorkout(){
 return JSON.parse(localStorage.getItem("draftWorkout") || "{}");
}

function storeDraftWorkout(draft){
 localStorage.setItem("draftWorkout", JSON.stringify(draft));
}

function saveDraftValue(day, exercise, set, type, value){
 const draft = getDraftWorkout();
 const dayDraft = draft[day] ??= {};
 const exerciseDraft = dayDraft[exercise] ??= {};
 const setDraft = exerciseDraft[set] ??= {};

 dayDraft.startedAt ??= Date.now();
 setDraft[type] = value;
 storeDraftWorkout(draft);
}

function restoreWorkoutDraft(content, day, exercises){
 const dayDraft = getDraftWorkout()[day];

 content.querySelectorAll("input[data-ex][data-set][data-type]").forEach(input=>{
  const {ex, set, type} = input.dataset;
  const exercise = exercises[ex].name;

  input.value = dayDraft?.[exercise]?.[set]?.[type] ?? "";
  input.addEventListener("input", ()=>{
   saveDraftValue(day, exercise, set, type, input.value);
  });
 });
}

function clearWorkoutDraft(day, exercises){
 const draft = getDraftWorkout();
 const dayDraft = draft[day];

 if(dayDraft){
  // Older versions could store values under an unknown exercise key.
  exercises.forEach(exercise=>delete dayDraft[exercise.name]);
  delete dayDraft.startedAt;

  if(!Object.keys(dayDraft).length){
   delete draft[day];
  }

  if(Object.keys(draft).length){
   storeDraftWorkout(draft);
  }else{
   localStorage.removeItem("draftWorkout");
  }
 }
}
