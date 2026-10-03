/* CONSTELLATION Mobile — framework-free sky guide */
(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const sky = $('sky'), ctx = sky.getContext('2d');
  const rim = $('ringmarks'), rctx = rim.getContext('2d');
  const inst = $('instrument'), tooltip = $('tooltip');
  const latInput = $('obs-lat'), lonInput = $('obs-lon'), dateInput = $('obs-datetime'), liveInput = $('live-time');
  const TAU = Math.PI*2, DEG=Math.PI/180, RAD=180/Math.PI;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const norm360=d=>((d%360)+360)%360;
  const norm24=h=>((h%24)+24)%24;
  const pad2=n=>String(n).padStart(2,'0');

  let W=0,H=0,R=0,DPR=1,zoom=1,panX=0,panY=0;
  let showLines=true,showLabels=false,showGrid=false,showEcliptic=true,showBodies=true;
  let selectedTarget=null, hitTargets=[], lastPointerDown=null;
  let compassHeading=null, compassAbsolute=false, deferredInstall=null;
  let catalogFilter='all', catalogSelected=null;
  const favorites = new Set(JSON.parse(localStorage.getItem('constellation-favorites') || '[]'));

  function localInputValue(d){return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;}
  function observerDate(){if(liveInput.checked)return new Date();const d=new Date(dateInput.value);return Number.isNaN(d.getTime())?new Date():d;}
  function observer(){return {date:observerDate(),lat:clamp(parseFloat(latInput.value)||0,-89.9,89.9),lon:clamp(parseFloat(lonInput.value)||0,-180,180)};}
  function julianDate(d){return d.getTime()/86400000+2440587.5;}
  function localSiderealDegrees(date,lon){const jd=julianDate(date),T=(jd-2451545)/36525;return norm360(280.46061837+360.98564736629*(jd-2451545)+.000387933*T*T-(T*T*T)/38710000+lon);}
  function equatorialToHorizontal(raHours,decDeg,obs){
    const lst=localSiderealDegrees(obs.date,obs.lon), hour=(norm360(lst-raHours*15))*DEG, dec=decDeg*DEG, lat=obs.lat*DEG;
    const alt=Math.asin(clamp(Math.sin(dec)*Math.sin(lat)+Math.cos(dec)*Math.cos(lat)*Math.cos(hour),-1,1));
    const y=-Math.sin(hour)*Math.cos(dec), x=Math.sin(dec)*Math.cos(lat)-Math.cos(dec)*Math.sin(lat)*Math.cos(hour);
    return {alt:alt*RAD,az:norm360(Math.atan2(y,x)*RAD),lst};
  }
  function projectEq(ra,dec,obs){const h=equatorialToHorizontal(ra,dec,obs);const rr=((90-h.alt)/90)*(R-12)*zoom,a=h.az*DEG;const x=W/2+Math.sin(a)*rr+panX,y=H/2-Math.cos(a)*rr+panY;return {...h,x,y,visible:h.alt>=0&&Math.hypot(x-(W/2+panX),y-(H/2+panY))<=(R-5)*zoom};}
  function dirName(az){const names=['N','NO','O','SO','S','SW','W','NW'];return names[Math.round(norm360(az)/45)%8];}
  function angleDiff(a,b){return ((a-b+540)%360)-180;}
  function formatTime(d){return d?d.toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'}):'—';}
  function formatDateTime(d){return d.toLocaleString('de-DE',{weekday:'short',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});}

  function constellationCenterEq(c){
    let x=0,y=0,z=0;
    for(const s of c.stars){const ra=s.ra*15*DEG,dec=s.dec*DEG,cd=Math.cos(dec);x+=cd*Math.cos(ra);y+=cd*Math.sin(ra);z+=Math.sin(dec);}
    const ra=norm24(Math.atan2(y,x)*RAD/15),dec=Math.atan2(z,Math.hypot(x,y))*RAD;return {ra,dec};
  }
  const centers=CONSTELLATIONS.map(constellationCenterEq);
  const plottedByName=new Map(CONSTELLATIONS.map((c,i)=>[c.name,i]));
  const catalogByName=new Map(CATALOG_88.map(c=>[c.name,c]));

  function resize(){
    DPR=Math.min(devicePixelRatio||1,2);const b=sky.getBoundingClientRect();W=b.width;H=b.height;R=Math.min(W,H)/2;sky.width=Math.round(W*DPR);sky.height=Math.round(H*DPR);ctx.setTransform(DPR,0,0,DPR,0,0);
    const rb=rim.getBoundingClientRect();rim.width=Math.round(rb.width*DPR);rim.height=Math.round(rb.height*DPR);rctx.setTransform(DPR,0,0,DPR,0,0);drawRim(rb.width,rb.height);clampPan();
  }
  function drawRim(w,h){const cx=w/2,cy=h/2,ro=w/2-4;rctx.clearRect(0,0,w,h);rctx.textAlign='center';rctx.textBaseline='middle';rctx.font='600 8px system-ui';for(let d=0;d<360;d+=5){const a=(d-90)*DEG,major=d%30===0,len=major?11:d%10===0?7:4;rctx.strokeStyle=major?'rgba(48,34,10,.88)':'rgba(60,44,16,.5)';rctx.lineWidth=major?1.3:.8;rctx.beginPath();rctx.moveTo(cx+Math.cos(a)*(ro-4),cy+Math.sin(a)*(ro-4));rctx.lineTo(cx+Math.cos(a)*(ro-4-len),cy+Math.sin(a)*(ro-4-len));rctx.stroke();if(major){rctx.fillStyle='rgba(42,30,8,.9)';const tr=ro-23;rctx.save();rctx.translate(cx+Math.cos(a)*tr,cy+Math.sin(a)*tr);rctx.rotate(a+Math.PI/2);rctx.fillText(String(d),0,0);rctx.restore();}}}
  function clampPan(){const lim=Math.max(0,R*(zoom-1)*.95);panX=clamp(panX,-lim,lim);panY=clamp(panY,-lim,lim);}

  let seed=0x5eeda11;function rnd(){seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;}
  const bgStars=Array.from({length:850},()=>({ra:rnd()*24,dec:Math.asin(rnd()*2-1)*RAD,m:4.5+rnd()*2.3,p:rnd()*TAU,s:.5+rnd()*1.2}));
  function starRadius(m){return Math.max(.8,(6.1-m)*.72)*(.8+zoom*.2);}

  function bodySnapshots(date,obs){return SkyEphemeris.bodies.map(b=>{const eq=b.calc(date),h=equatorialToHorizontal(eq.ra,eq.dec,obs);return {...b,...eq,...h};});}
  function skyState(sunAlt){if(sunAlt>=0)return ['Taghimmel','Die Sonne steht über dem Horizont. Sterne sind optisch weitgehend überstrahlt.'];if(sunAlt>=-6)return ['Bürgerliche Dämmerung','Helle Dämmerung – nur sehr helle Objekte sind gut erkennbar.'];if(sunAlt>=-12)return ['Nautische Dämmerung','Der Himmel wird deutlich dunkler.'];if(sunAlt>=-18)return ['Astronomische Dämmerung','Fast vollständige Dunkelheit.'];return ['Astronomische Nacht','Gute geometrische Bedingungen für Sterne und Sternbilder.'];}

  function drawGrid(){ctx.save();ctx.translate(panX,panY);ctx.strokeStyle='rgba(122,168,255,.10)';ctx.fillStyle='rgba(160,190,255,.32)';ctx.lineWidth=.7;ctx.font='9px system-ui';ctx.textAlign='center';for(const alt of [30,60]){const rr=((90-alt)/90)*(R-12)*zoom;ctx.beginPath();ctx.arc(W/2,H/2,rr,0,TAU);ctx.stroke();ctx.fillText(`${alt}°`,W/2+4,H/2-rr+11);}for(let az=0;az<360;az+=30){const a=az*DEG;ctx.beginPath();ctx.moveTo(W/2,H/2);ctx.lineTo(W/2+Math.sin(a)*(R-12)*zoom,H/2-Math.cos(a)*(R-12)*zoom);ctx.stroke();}ctx.restore();}
  function eclipticRaDec(l){const lam=l*DEG,eps=23.4393*DEG,x=Math.cos(lam),y=Math.cos(eps)*Math.sin(lam),z=Math.sin(eps)*Math.sin(lam);return {ra:norm24(Math.atan2(y,x)*RAD/15),dec:Math.asin(z)*RAD};}
  function drawEcliptic(obs){ctx.save();ctx.strokeStyle='rgba(240,217,160,.30)';ctx.setLineDash([5,5]);ctx.lineWidth=.9;ctx.beginPath();let pen=false;for(let l=0;l<=360;l+=3){const q=eclipticRaDec(l),p=projectEq(q.ra,q.dec,obs);if(!p.visible){pen=false;continue;}if(!pen){ctx.moveTo(p.x,p.y);pen=true;}else ctx.lineTo(p.x,p.y);}ctx.stroke();ctx.restore();}

  function drawFrame(ts){
    if(liveInput.checked)dateInput.value=localInputValue(new Date());
    const obs=observer(), time=ts/1000, bodies=bodySnapshots(obs.date,obs), sun=bodies.find(b=>b.id==='sun');hitTargets=[];ctx.clearRect(0,0,W,H);
    const state=skyState(sun.alt);$('sky-state').textContent=state[0];$('now-clock').textContent=formatDateTime(obs.date);$('visibility-note').textContent=state[1]+' Die Listen zeigen geometrisch über dem Horizont liegende Objekte.';$('sidereal-label').textContent=`Sternzeit ${(localSiderealDegrees(obs.date,obs.lon)/15).toFixed(2)} h`;
    for(const s of bgStars){const p=projectEq(s.ra,s.dec,obs);if(!p.visible)continue;const tw=.4+.6*Math.abs(Math.sin(time*s.s+s.p)),size=clamp((7-s.m)*.42,.2,1)*(.85+zoom*.15);ctx.fillStyle=`rgba(212,226,255,${.10+tw*.26})`;ctx.beginPath();ctx.arc(p.x,p.y,size,0,TAU);ctx.fill();}
    if(showGrid)drawGrid();if(showEcliptic)drawEcliptic(obs);
    let above=0;
    CONSTELLATIONS.forEach((c,ci)=>{
      const sel=selectedTarget?.kind==='constellation'&&selectedTarget.ci===ci || selectedTarget?.kind==='star'&&selectedTarget.ci===ci;
      const pts=c.stars.map(s=>projectEq(s.ra,s.dec,obs));
      if(showLines){ctx.save();ctx.lineWidth=sel?1.6:(c.family==='zodiac'?1.05:.8);ctx.strokeStyle=sel?'rgba(240,217,160,.92)':c.family==='zodiac'?'rgba(201,164,94,.43)':'rgba(150,190,255,.25)';if(sel){ctx.shadowColor='rgba(240,217,160,.6)';ctx.shadowBlur=9;}for(const [a,b] of c.lines){const A=pts[a],B=pts[b];if(!A?.visible||!B?.visible)continue;ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.stroke();}ctx.restore();}
      let vx=0,vy=0,vn=0;
      c.stars.forEach((s,si)=>{const p=pts[si];if(!p.visible)return;above++;vx+=p.x;vy+=p.y;vn++;const r=starRadius(s.m)*(sel?1.2:1),tw=.78+.22*Math.sin(time*2+si+ci);const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r*4.5);g.addColorStop(0,`rgba(255,252,240,${.52*tw})`);g.addColorStop(1,'rgba(160,190,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,r*4.5,0,TAU);ctx.fill();ctx.fillStyle=`rgba(255,253,246,${.9*tw})`;ctx.beginPath();ctx.arc(p.x,p.y,r,0,TAU);ctx.fill();if(showLabels||sel){ctx.fillStyle=sel?'rgba(240,217,160,.95)':'rgba(215,222,238,.65)';ctx.font=`${sel?13:11}px Georgia,serif`;ctx.textAlign='left';ctx.fillText(s.n,p.x+r+4,p.y+3);}hitTargets.push({kind:'star',ci,si,x:p.x,y:p.y,r:Math.max(10,r*2.3),alt:p.alt,az:p.az});});
      if(vn&&(showLabels||sel||c.family==='zodiac')){ctx.fillStyle=sel?'rgba(240,217,160,.48)':c.family==='zodiac'?'rgba(201,164,94,.24)':'rgba(170,195,240,.12)';ctx.font=`italic ${sel?19:13}px Georgia,serif`;ctx.textAlign='center';ctx.fillText(`${c.family==='zodiac'?c.symbol+' ':''}${c.name.toUpperCase()}`,vx/vn,vy/vn-(sel?25:18));}
    });
    if(showBodies){for(const b of bodies){if(b.alt<0)continue;const p=projectEq(b.ra,b.dec,obs);if(!p.visible)continue;const size=b.id==='sun'?8:b.id==='moon'?7:5;ctx.save();ctx.shadowColor=b.id==='sun'?'rgba(255,215,110,.8)':'rgba(220,225,255,.65)';ctx.shadowBlur=14;ctx.fillStyle=b.id==='sun'?'#f0d9a0':'#f3efe2';ctx.beginPath();ctx.arc(p.x,p.y,size,0,TAU);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle=b.id==='sun'?'#3b2c0e':'#11182a';ctx.font=`700 ${b.id==='sun'||b.id==='moon'?13:11}px Georgia,serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(b.symbol,p.x,p.y+.5);ctx.restore();ctx.fillStyle='rgba(240,217,160,.9)';ctx.font='11px system-ui';ctx.textAlign='center';ctx.fillText(b.name,p.x,p.y+size+13);hitTargets.push({kind:'body',id:b.id,x:p.x,y:p.y,r:15,alt:b.alt,az:b.az});}}
    $('ro-count').textContent=above;
    updateSelectedReadout(obs,bodies);
    requestAnimationFrame(drawFrame);
  }

  function targetPosition(target,date=observerDate()){
    const obs={date,lat:clamp(parseFloat(latInput.value)||0,-89.9,89.9),lon:clamp(parseFloat(lonInput.value)||0,-180,180)};
    if(!target)return null;
    if(target.kind==='body'){const b=SkyEphemeris.bodies.find(x=>x.id===target.id);const eq=b.calc(date);return {...eq,...equatorialToHorizontal(eq.ra,eq.dec,obs),name:b.name,symbol:b.symbol,type:b.kind};}
    if(target.kind==='star'){const c=CONSTELLATIONS[target.ci],s=c.stars[target.si];return {ra:s.ra,dec:s.dec,...equatorialToHorizontal(s.ra,s.dec,obs),name:s.n,symbol:'✦',type:'Stern',m:s.m};}
    if(target.kind==='constellation'){const c=CONSTELLATIONS[target.ci],eq=centers[target.ci];return {...eq,...equatorialToHorizontal(eq.ra,eq.dec,obs),name:c.name,symbol:c.symbol,type:'Sternbild'};}
    return null;
  }
  function targetKey(t){if(!t)return'';return t.kind==='body'?`body:${t.id}`:t.kind==='star'?`star:${t.ci}:${t.si}`:`const:${t.ci}`;}
  function targetMeta(t){
    if(!t)return null;
    if(t.kind==='body'){const b=SkyEphemeris.bodies.find(x=>x.id===t.id);const p=b.calc(observerDate());let desc=`${b.kind} im Sonnensystem. Position wird für deinen gewählten Standort und Zeitpunkt berechnet.`;let extra=b.kind;if(t.id==='moon')extra=`${p.phase} · ${Math.round(p.illumination*100)} %`;return {name:b.name,symbol:b.symbol,type:b.kind,description:desc,extraLabel:t.id==='moon'?'Phase':'Objekt',extra,story:null};}
    const c=CONSTELLATIONS[t.ci],story=CONSTELLATION_STORIES[c.name],cat=catalogByName.get(c.name);
    if(t.kind==='star'){const s=c.stars[t.si];return {name:s.n,symbol:'✦',type:`Stern · ${c.name}`,description:`Heller Katalogstern im Sternbild ${story?.de||c.name}. Visuelle Helligkeit etwa ${s.m.toFixed(2)} mag.`,extraLabel:'Magnitude',extra:s.m.toFixed(2),story:story?{text:story.story,tip:story.tip}:null};}
    const br=c.stars.reduce((a,b)=>a.m<b.m?a:b);return {name:story?.de||cat?.de||c.name,symbol:c.symbol,type:`Sternbild · ${c.iau}${c.family==='zodiac'?' · Tierkreis':''}`,description:c.description,extraLabel:'Hellster Stern',extra:br.n,story:story?{text:story.story,tip:story.tip}:null};
  }
  function updateSelectedReadout(obs,bodies){
    if(!selectedTarget){$('ro-name').textContent='—';$('ro-pos').textContent='—';return;}const p=targetPosition(selectedTarget,obs.date),m=targetMeta(selectedTarget);$('ro-name').textContent=m.name;$('ro-pos').textContent=p?`${p.alt.toFixed(0)}° / ${p.az.toFixed(0)}°`:'—';
  }
  function selectTarget(t,switchToSky=false){selectedTarget=t;const p=targetPosition(t),m=targetMeta(t);$('object-symbol').textContent=m?.symbol||'✦';$('object-type').textContent=m?.type||'HIMMELSATLAS';$('object-name').textContent=m?.name||'Objekt';$('object-description').textContent=m?.description||'';$('fact-alt').textContent=p?`${p.alt.toFixed(1)}°`:'—';$('fact-az').textContent=p?`${p.az.toFixed(1)}°`:'—';$('fact-dir').textContent=p?dirName(p.az):'—';$('fact-extra-label').textContent=m?.extraLabel||'Info';$('fact-extra').textContent=m?.extra||'—';$('story-box').open=false;if(m?.story){$('story-box').classList.remove('hidden');$('story-text').textContent=m.story.text;$('story-tip').textContent=`Beobachtung: ${m.story.tip}`;}else $('story-box').classList.add('hidden');updateFavButton();renderTrajectory();if(switchToSky)switchView('sky');}

  function renderTrajectory(){
    const box=$('trajectory-chart');if(!selectedTarget){box.innerHTML='<div class="empty">Objekt auswählen</div>';return;}
    const start=observerDate(),samples=[];for(let h=-2;h<=10;h+=.5){const d=new Date(start.getTime()+h*3600000),p=targetPosition(selectedTarget,d);samples.push({h,alt:p.alt,d});}
    const w=320,h=112,pad=12, x=v=>pad+(v+2)/12*(w-2*pad), y=a=>pad+(90-clamp(a,-10,90))/100*(h-2*pad);const pts=samples.map(s=>`${x(s.h).toFixed(1)},${y(s.alt).toFixed(1)}`).join(' '),hy=y(0),ny=x(0);
    box.innerHTML=`<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-label="Höhenverlauf"><line x1="${pad}" y1="${hy}" x2="${w-pad}" y2="${hy}" stroke="rgba(201,164,94,.25)" stroke-dasharray="3 4"/><line x1="${ny}" y1="${pad}" x2="${ny}" y2="${h-pad}" stroke="rgba(255,255,255,.12)"/><polyline points="${pts}" fill="none" stroke="rgba(240,217,160,.92)" stroke-width="2"/><text x="${pad}" y="${h-2}" fill="rgba(163,154,130,.8)" font-size="8">−2h</text><text x="${ny+2}" y="${h-2}" fill="rgba(240,217,160,.9)" font-size="8">jetzt</text><text x="${w-pad-18}" y="${h-2}" fill="rgba(163,154,130,.8)" font-size="8">+10h</text></svg>`;
    const rs=findRiseSet(selectedTarget,start);$('rise-time').textContent=rs.rise?formatTime(rs.rise):(rs.alwaysUp?'zirkumpolar':'—');$('set-time').textContent=rs.set?formatTime(rs.set):(rs.alwaysUp?'zirkumpolar':'—');let max=samples.reduce((a,b)=>a.alt>b.alt?a:b);$('max-alt').textContent=`${Math.max(-90,max.alt).toFixed(0)}° · ${formatTime(max.d)}`;$('trajectory-target').textContent=targetMeta(selectedTarget).name;
  }
  function findRiseSet(t,start){let prev=targetPosition(t,start).alt, rise=null,set=null,allUp=prev>0,allDown=prev<=0;for(let m=10;m<=24*60;m+=10){const d=new Date(start.getTime()+m*60000),alt=targetPosition(t,d).alt;if(prev<=0&&alt>0&&!rise)rise=d;if(prev>0&&alt<=0&&!set)set=d;if(alt>0)allDown=false;else allUp=false;prev=alt;}return {rise,set,alwaysUp:allUp,alwaysDown:allDown};}

  function nearestHit(x,y,max=18){let best=null,bd=max;for(const q of hitTargets){const d=Math.hypot(x-q.x,y-q.y);if(d<bd){bd=d;best=q;}}return best;}
  function localPoint(e){const b=sky.getBoundingClientRect();return {x:e.clientX-b.left,y:e.clientY-b.top};}
  inst.addEventListener('pointerdown',e=>{lastPointerDown={x:e.clientX,y:e.clientY,px:panX,py:panY};inst.setPointerCapture(e.pointerId);});
  inst.addEventListener('pointermove',e=>{if(lastPointerDown&&zoom>1.05){panX=lastPointerDown.px+e.clientX-lastPointerDown.x;panY=lastPointerDown.py+e.clientY-lastPointerDown.y;clampPan();tooltip.classList.remove('show');return;}if(e.pointerType==='mouse'){const p=localPoint(e),q=nearestHit(p.x,p.y,16);if(!q){tooltip.classList.remove('show');return;}let text;if(q.kind==='body'){const b=SkyEphemeris.bodies.find(x=>x.id===q.id);text=`<b>${b.name}</b><small>${b.kind} · ${q.alt.toFixed(0)}° ${dirName(q.az)}</small>`;}else{const c=CONSTELLATIONS[q.ci],s=c.stars[q.si];text=`<b>${s.n}</b><small>${c.name} · mag ${s.m.toFixed(2)} · ${q.alt.toFixed(0)}° ${dirName(q.az)}</small>`;}tooltip.innerHTML=text;tooltip.style.left=`${clamp(p.x,0,W-205)}px`;tooltip.style.top=`${clamp(p.y,0,H-55)}px`;tooltip.classList.add('show');}});
  inst.addEventListener('pointerup',e=>{if(!lastPointerDown)return;const moved=Math.hypot(e.clientX-lastPointerDown.x,e.clientY-lastPointerDown.y)>8;lastPointerDown=null;if(moved)return;const p=localPoint(e),q=nearestHit(p.x,p.y,20);if(q)selectTarget(q.kind==='body'?{kind:'body',id:q.id}:{kind:'star',ci:q.ci,si:q.si});});
  inst.addEventListener('pointercancel',()=>lastPointerDown=null);inst.addEventListener('pointerleave',()=>tooltip.classList.remove('show'));
  inst.addEventListener('wheel',e=>{e.preventDefault();zoom=clamp(zoom*(e.deltaY<0?1.15:.87),1,4);if(zoom===1){panX=panY=0;}clampPan();},{passive:false});
  let pinch=0;inst.addEventListener('touchstart',e=>{if(e.touches.length===2)pinch=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);},{passive:true});inst.addEventListener('touchmove',e=>{if(e.touches.length===2){e.preventDefault();const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);if(pinch)zoom=clamp(zoom*d/pinch,1,4);pinch=d;clampPan();}},{passive:false});

  function listButton(symbol,name,sub,alt,az,onClick){const b=document.createElement('button');b.className='list-item';b.type='button';b.innerHTML=`<span class="li-symbol">${symbol}</span><span class="li-main"><b>${name}</b><small>${sub}</small></span><span class="li-pos"><b>${alt.toFixed(0)}°</b><small>${dirName(az)} · ${az.toFixed(0)}°</small></span>`;b.addEventListener('click',onClick);return b;}
  function refreshVisibleLists(){
    const obs=observer(),bodies=bodySnapshots(obs.date,obs),bl=$('body-list');bl.innerHTML='';const vb=bodies.filter(x=>x.alt>0).sort((a,b)=>b.alt-a.alt);for(const b of vb)bl.appendChild(listButton(b.symbol,b.name,b.id==='moon'?`${b.phase} · ${Math.round(b.illumination*100)} %`:b.kind,b.alt,b.az,()=>selectTarget({kind:'body',id:b.id},true)));if(!vb.length)bl.innerHTML='<div class="empty">Keines der berechneten Sonnensystemobjekte über dem Horizont.</div>';$('body-visible-count').textContent=vb.length;
    const cl=$('visible-constellations');cl.innerHTML='';const vcs=CONSTELLATIONS.map((c,i)=>{const p=equatorialToHorizontal(centers[i].ra,centers[i].dec,obs);return {c,i,...p};}).filter(x=>x.alt>0).sort((a,b)=>b.alt-a.alt);for(const x of vcs){const story=CONSTELLATION_STORIES[x.c.name];cl.appendChild(listButton(x.c.family==='zodiac'?x.c.symbol:'✦',story?.de||catalogByName.get(x.c.name)?.de||x.c.name,`${x.c.iau}${x.c.family==='zodiac'?' · Tierkreiszeichen':''}`,x.alt,x.az,()=>selectTarget({kind:'constellation',ci:x.i},true)));}$('const-visible-count').textContent=vcs.length;
  }

  function switchView(name){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.dataset.view===name));document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.target===name));if(name==='visible')refreshVisibleLists();if(name==='catalog')renderCatalog();if(name==='compass')renderAheadList();window.scrollTo({top:0,behavior:'smooth'});}
  document.querySelectorAll('.nav-btn').forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.target)));

  function saveFavorites(){localStorage.setItem('constellation-favorites',JSON.stringify([...favorites]));}
  function updateFavButton(){const key=targetKey(selectedTarget),on=key&&favorites.has(key);$('favorite-btn').textContent=on?'★':'☆';$('favorite-btn').classList.toggle('active',on);}
  $('favorite-btn').addEventListener('click',()=>{if(!selectedTarget)return;const k=targetKey(selectedTarget);favorites.has(k)?favorites.delete(k):favorites.add(k);saveFavorites();updateFavButton();});

  function renderCatalog(){
    const q=$('catalog-search').value.trim().toLowerCase(),out=$('catalog-list');out.innerHTML='';let rows=CATALOG_88.filter(c=>{const plotted=plottedByName.has(c.name),fav=favorites.has(plotted?`const:${plottedByName.get(c.name)}`:`catalog:${c.iau}`);if(catalogFilter==='zodiac'&&c.kind!=='zodiac')return false;if(catalogFilter==='ecliptic'&&!(c.kind==='zodiac'||c.kind==='ecliptic'))return false;if(catalogFilter==='plotted'&&!plotted)return false;if(catalogFilter==='favorites'&&!fav)return false;return !q||`${c.name} ${c.de} ${c.iau}`.toLowerCase().includes(q);});
    for(const c of rows){const plotted=plottedByName.has(c.name),r=document.createElement('div');r.className='catalog-row';r.innerHTML=`<span class="sym">${c.symbol}</span><span><b>${c.de}</b><small>${c.name} · ${c.iau}${c.astrologyRange?' · '+c.astrologyRange:''}</small></span><span class="tag">${plotted?'KARTE':c.kind==='zodiac'?'ZODIAK':'IAU'}</span>`;r.addEventListener('click',()=>showCatalogDetail(c));out.appendChild(r);}if(!rows.length)out.innerHTML='<div class="empty">Keine Treffer.</div>';
  }
  function showCatalogDetail(c){catalogSelected=c;$('catalog-detail').classList.remove('hidden');$('cat-symbol').textContent=c.symbol;$('cat-iau').textContent=`IAU ${c.iau}${c.astrologyRange?' · astrologisch '+c.astrologyRange:''}`;$('cat-name').textContent=`${c.de} · ${c.name}`;const st=CONSTELLATION_STORIES[c.name];$('cat-note').textContent=(st?`${st.meaning}. ${st.story} `:'')+c.note;const plotted=plottedByName.has(c.name);$('cat-show').disabled=!plotted;$('cat-show').textContent=plotted?'Auf Karte zeigen':'Noch nicht gezeichnet';const key=plotted?`const:${plottedByName.get(c.name)}`:`catalog:${c.iau}`;$('cat-fav').textContent=favorites.has(key)?'★ Gemerkt':'☆ Merken';}
  $('catalog-search').addEventListener('input',renderCatalog);$('catalog-filters').addEventListener('click',e=>{const b=e.target.closest('.filter');if(!b)return;catalogFilter=b.dataset.filter;document.querySelectorAll('#catalog-filters .filter').forEach(x=>x.classList.toggle('active',x===b));renderCatalog();});$('cat-show').addEventListener('click',()=>{if(!catalogSelected)return;const i=plottedByName.get(catalogSelected.name);if(i!==undefined)selectTarget({kind:'constellation',ci:i},true);});$('cat-fav').addEventListener('click',()=>{if(!catalogSelected)return;const i=plottedByName.get(catalogSelected.name),key=i!==undefined?`const:${i}`:`catalog:${catalogSelected.iau}`;favorites.has(key)?favorites.delete(key):favorites.add(key);saveFavorites();showCatalogDetail(catalogSelected);renderCatalog();});

  function useGPS(button){if(!navigator.geolocation){$('location-label').textContent='GPS wird von diesem Browser nicht unterstützt';return;}const old=button.textContent;button.disabled=true;button.textContent='Standort …';navigator.geolocation.getCurrentPosition(pos=>{const {latitude,longitude,accuracy}=pos.coords;latInput.value=latitude.toFixed(5);lonInput.value=longitude.toFixed(5);localStorage.setItem('constellation-location',JSON.stringify({lat:latitude,lon:longitude}));$('location-label').textContent=`GPS · ${latitude.toFixed(3)}°, ${longitude.toFixed(3)}° · ±${Math.round(accuracy)} m`;button.disabled=false;button.textContent=old;refreshVisibleLists();renderTrajectory();},err=>{button.disabled=false;button.textContent=old;$('location-label').textContent=`GPS nicht verfügbar: ${err.message}`;},{enableHighAccuracy:true,timeout:12000,maximumAge:60000});}
  $('gps-btn').addEventListener('click',e=>useGPS(e.currentTarget));$('settings-gps').addEventListener('click',e=>useGPS(e.currentTarget));

  async function enableCompass(){
    try{if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function'){const p=await DeviceOrientationEvent.requestPermission();if(p!=='granted')throw new Error('Sensorfreigabe abgelehnt');}window.addEventListener('deviceorientationabsolute',orientationHandler,true);window.addEventListener('deviceorientation',orientationHandler,true);$('compass-btn').textContent='Kompass aktiv';$('compass-btn').disabled=true;$('compass-quality').textContent='Bewege das Telefon kurz in einer Acht, falls die Richtung ungenau wirkt.';}catch(e){$('compass-quality').textContent=`Kompass nicht verfügbar: ${e.message}`;}}
  function orientationHandler(e){let h=null;if(typeof e.webkitCompassHeading==='number'){h=e.webkitCompassHeading;compassAbsolute=true;}else if(typeof e.alpha==='number'){h=norm360(360-e.alpha);compassAbsolute=!!e.absolute;}if(h===null)return;compassHeading=h;$('heading-value').textContent=`${Math.round(h)}°`;$('heading-dir').textContent=dirName(h);$('compass-needle').style.transform=`rotate(${-h}deg)`;$('compass-quality').textContent=compassAbsolute?'Absoluter Gerätekompass':'Richtungssensor – kann relativ statt magnetisch Nord sein';renderAheadList();}
  $('compass-btn').addEventListener('click',enableCompass);
  function renderAheadList(){const out=$('ahead-list');if(compassHeading===null){out.innerHTML='<div class="empty">Kompass aktivieren</div>';return;}const obs=observer(),cand=[];for(const b of bodySnapshots(obs.date,obs)){if(b.alt<=0)continue;const diff=angleDiff(b.az,compassHeading);if(Math.abs(diff)<=25)cand.push({symbol:b.symbol,name:b.name,sub:b.kind,alt:b.alt,az:b.az,diff,target:{kind:'body',id:b.id}});}CONSTELLATIONS.forEach((c,i)=>{const p=equatorialToHorizontal(centers[i].ra,centers[i].dec,obs);if(p.alt<=0)return;const diff=angleDiff(p.az,compassHeading);if(Math.abs(diff)<=25)cand.push({symbol:c.family==='zodiac'?c.symbol:'✦',name:CONSTELLATION_STORIES[c.name]?.de||catalogByName.get(c.name)?.de||c.name,sub:`Sternbild${c.family==='zodiac'?' · Tierkreis':''}`,alt:p.alt,az:p.az,diff,target:{kind:'constellation',ci:i}});});cand.sort((a,b)=>Math.abs(a.diff)-Math.abs(b.diff)||b.alt-a.alt);out.innerHTML='';for(const c of cand.slice(0,10)){const side=Math.abs(c.diff)<4?'geradeaus':c.diff>0?`${Math.abs(c.diff).toFixed(0)}° rechts`:`${Math.abs(c.diff).toFixed(0)}° links`;out.appendChild(listButton(c.symbol,c.name,`${c.sub} · ${side}`,c.alt,c.az,()=>selectTarget(c.target,true)));}if(!cand.length)out.innerHTML='<div class="empty">Im ±25°-Sichtkegel liegt gerade keines der katalogisierten Objekte. Dreh dich langsam weiter.</div>';}

  function bindChip(id,setter){$(id).addEventListener('click',e=>{e.currentTarget.classList.toggle('active');setter(e.currentTarget.classList.contains('active'));});}
  bindChip('c-lines',v=>showLines=v);bindChip('c-labels',v=>showLabels=v);bindChip('c-bodies',v=>showBodies=v);bindChip('c-ecliptic',v=>showEcliptic=v);bindChip('c-grid',v=>showGrid=v);

  function manualChanged(){liveInput.checked=false;localStorage.setItem('constellation-location',JSON.stringify({lat:parseFloat(latInput.value)||0,lon:parseFloat(lonInput.value)||0}));$('location-label').textContent=`Manuell · ${Number(latInput.value).toFixed(3)}°, ${Number(lonInput.value).toFixed(3)}°`;refreshVisibleLists();renderTrajectory();}
  latInput.addEventListener('change',manualChanged);lonInput.addEventListener('change',manualChanged);dateInput.addEventListener('input',()=>{liveInput.checked=false;refreshVisibleLists();renderTrajectory();});liveInput.addEventListener('change',()=>{if(liveInput.checked){dateInput.value=localInputValue(new Date());refreshVisibleLists();renderTrajectory();}});$('set-now').addEventListener('click',()=>{liveInput.checked=true;dateInput.value=localInputValue(new Date());refreshVisibleLists();renderTrajectory();});

  $('fullscreen-btn').addEventListener('click',async()=>{try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen();}catch{}});
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;$('install-btn').classList.remove('hidden');});$('install-btn').addEventListener('click',async()=>{if(!deferredInstall)return;deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;$('install-btn').classList.add('hidden');});
  if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));

  window.addEventListener('resize',()=>{clearTimeout(window.__r);window.__r=setTimeout(resize,100);});
  const stored=JSON.parse(localStorage.getItem('constellation-location')||'null');if(stored&&Number.isFinite(stored.lat)&&Number.isFinite(stored.lon)){latInput.value=stored.lat.toFixed(5);lonInput.value=stored.lon.toFixed(5);$('location-label').textContent=`Gespeichert · ${stored.lat.toFixed(3)}°, ${stored.lon.toFixed(3)}°`;}
  dateInput.value=localInputValue(new Date());resize();refreshVisibleLists();renderCatalog();
  const moon=bodySnapshots(observerDate(),observer()).find(x=>x.id==='moon');if(moon?.alt>0)selectTarget({kind:'body',id:'moon'});else {const cas=plottedByName.get('Cassiopeia');if(cas!==undefined)selectTarget({kind:'constellation',ci:cas});}
  setInterval(()=>{if(liveInput.checked){refreshVisibleLists();renderTrajectory();if(compassHeading!==null)renderAheadList();}},30000);
  requestAnimationFrame(drawFrame);
})();
