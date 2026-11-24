const dietFileTypes = {
 pdf: "application/pdf",
 jpg: "image/jpeg",
 jpeg: "image/jpeg",
 png: "image/png",
 webp: "image/webp",
 heic: "image/heic",
 heif: "image/heif",
 avif: "image/avif"
};

const nutritionDietPanel = `
 <div class="exercise">
  <div class="exerciseBody">
   <details id="nutritionDiet">
    <summary>La mia dieta</summary>
    <form id="nutritionDietForm">
     <label for="nutritionDietFiles">Scegli il PDF o le foto della dieta</label>
     <input id="nutritionDietFiles" type="file" accept="${Object.keys(dietFileTypes).map(ext=>"."+ext).join(",")}" multiple required>
     <button class="backupButton" type="submit">Salva dieta</button>
    </form>
    <p id="nutritionDietStatus" role="status"></p>
    <ul id="nutritionDietDocuments"></ul>
   </details>
   <dialog id="nutritionDietPreview" class="nutritionDietPreview">
    <div class="nutritionDietPreviewHeader">
     <h3 id="nutritionDietPreviewName"></h3>
     <form method="dialog"><button type="submit" class="backupButton">Chiudi</button></form>
    </div>
    <div id="nutritionDietPreviewBody"></div>
    <a id="nutritionDietDownload" class="backupButton">Scarica il file originale</a>
   </dialog>
  </div>
 </div>
`;

async function withDietDocuments(mode, operation){
 const database = await new Promise((resolve, reject)=>{
  const request = indexedDB.open("myGymNutrition", 1);
  request.onupgradeneeded = ()=>{
   request.result.createObjectStore("dietDocuments", {keyPath:"id", autoIncrement:true});
  };
  request.onsuccess = ()=>resolve(request.result);
  request.onerror = ()=>reject(request.error);
 });

 try{
  return await new Promise((resolve, reject)=>{
   const transaction = database.transaction("dietDocuments", mode);
   const result = operation(transaction.objectStore("dietDocuments"));
   transaction.oncomplete = ()=>resolve(result?.result);
   transaction.onabort = ()=>reject(transaction.error);
  });
 }finally{
  database.close();
 }
}

function initNutritionDiet(){
 const panel = document.getElementById("nutritionDiet");
 const form = document.getElementById("nutritionDietForm");
 const input = document.getElementById("nutritionDietFiles");
 const status = document.getElementById("nutritionDietStatus");
 const list = document.getElementById("nutritionDietDocuments");
 const preview = document.getElementById("nutritionDietPreview");
 const previewName = document.getElementById("nutritionDietPreviewName");
 const previewBody = document.getElementById("nutritionDietPreviewBody");
 const download = document.getElementById("nutritionDietDownload");
 const save = form.querySelector("button");
 let previewUrl;

 function openDocument(entry){
  const url = URL.createObjectURL(entry.file);
  previewUrl = url;
  previewName.textContent = entry.name;
  const element = document.createElement(entry.file.type === "application/pdf" ? "iframe" : "img");
  element.src = url;
  element.title = entry.name;
  if(element.tagName === "IMG") element.alt = entry.name;
  previewBody.replaceChildren(element);
  download.href = url;
  download.download = entry.name;
  preview.showModal();
 }

 preview.addEventListener("close", ()=>{
  const url = previewUrl;
  previewBody.replaceChildren();
  download.removeAttribute("href");
  setTimeout(()=>URL.revokeObjectURL(url), 60000);
 });

 async function loadDocuments(){
  try{
   const entries = await withDietDocuments("readonly", store=>store.getAll());
   if(!list.isConnected) return;
   list.replaceChildren(...entries.map(entry=>{
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "backupButton";
    button.textContent = entry.name;
    button.addEventListener("click", ()=>openDocument(entry));
    item.append(button);
    return item;
   }));
  }catch(error){
   console.error("Errore durante la lettura della dieta:", error);
   status.textContent = "Impossibile aprire i file della dieta. Riprova.";
  }
 }

 panel.addEventListener("toggle", ()=>{
  if(panel.open) loadDocuments();
 });

 form.addEventListener("submit", async event=>{
  event.preventDefault();
  const entries = [...input.files].map(file=>{
   const extension = file.name.split(".").pop().toLowerCase();
   const type = Object.hasOwn(dietFileTypes, extension) ? dietFileTypes[extension] : "";
   return {name:file.name, type, file:file.slice(0, file.size, type)};
  });

  if(!entries.length || entries.some(entry=>!entry.type || !entry.file.size)){
   status.textContent = "Scegli un PDF o una foto con un formato supportato.";
   return;
  }

  save.disabled = true;
  input.disabled = true;
  status.textContent = "Salvataggio in corso…";
  try{
   await withDietDocuments("readwrite", store=>{
    entries.forEach(entry=>store.add({name:entry.name, file:entry.file}));
   });
   input.value = "";
   status.textContent = "Dieta salvata su questo dispositivo.";
   await loadDocuments();
  }catch(error){
   console.error("Errore durante il salvataggio della dieta:", error);
   status.textContent = "Salvataggio non riuscito. Riprova.";
  }finally{
   save.disabled = false;
   input.disabled = false;
  }
 });
}
