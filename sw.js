const CACHE='pantry-shell-v8';
const ASSETS=['./','./index.html','./style.css','./app.mjs','./model.mjs','./storage.mjs','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png','./vendor/tesseract.min.js','./vendor/worker.min.js','./vendor/tesseract-core.wasm.js','./vendor/tesseract-core.wasm','./vendor/eng.traineddata.gz','./vendor/fin.traineddata.gz'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS.map(path=>new Request(path,{cache:'reload'})))));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('pantry-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request)));});
