const APP='landmap-app-v1',TILES='tiles-v1';
const SHELL=['./','index.html','manifest.json','icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(APP).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==APP&&n!==TILES).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=e.request.url;
  if(u.includes('arcgisonline.com')){
    e.respondWith(caches.open(TILES).then(async c=>{const hit=await c.match(u);if(hit)return hit;try{const r=await fetch(e.request);if(r.ok||r.type==='opaque')c.put(u,r.clone());return r}catch(err){return new Response('',{status:504})}}));
    return;
  }
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(APP).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));
});
