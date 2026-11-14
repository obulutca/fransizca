const VER='e0937e1e95',CORE='core-'+VER,MEDIA='media-'+VER;
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CORE).then(c=>c.addAll(['./','index.html','fsrs.js','manifest.webmanifest','icon-180.png'])))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CORE&&k!==MEDIA&&!k.startsWith('ext')).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET')return;
  if(u.origin===location.origin&&u.pathname.endsWith('.mp3')){e.respondWith(caches.open(MEDIA).then(c=>c.match(u.pathname).then(r=>r||fetch(e.request).then(res=>{if(res.ok&&res.status===200)c.put(u.pathname,res.clone());return res}))));return}
  if(u.origin===location.origin){e.respondWith(fetch(e.request).then(res=>{if(res.ok){const cl=res.clone();caches.open(CORE).then(c=>c.put(e.request,cl))}return res}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));return}
  e.respondWith(caches.open('ext').then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(res=>{if(res.ok||res.type==='opaque')c.put(e.request,res.clone());return res}))))});
