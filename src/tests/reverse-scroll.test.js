// Regression test: the site title must never disappear when scrolling back up (reported on iPhone Safari).
// Usage (from the repository root, after python3 src/build.py; needs Playwright with Chromium):
//   node src/tests/reverse-scroll.test.js docs
// Scrolls down and back with wheel, touch drags, programmatic jumps, emulated rubber-band overscroll (scrollY < 0 and
// > max) and a viewport-height change mid-sequence (mobile toolbar). After each scenario the hero must be at its exact
// rest state: .intro computed opacity 1 and transform none, no inline style left, lockup at its original place,
// camera/leaves/plate/shade/flood at rest. During every scenario: opacity stays within [0, 1], scale within [1, S].
// Fast flicks (F): the title is back within 100ms of reaching the top, and a fling down never shows the list panel's
// edge over a stage that is not yet flat hall colour.
// The 3D path (review, door finish): each viewport runs again with ?3d=force (one theme each; R3D_ALL=1 for both), the 3D
// on before it starts; each rest check waits for r = p = 0 and no inline style (15 s at most: SwiftShader is slow) and
// also asks for the canvas hidden, the photograph shown and the 3D still on; during every scenario no frame shows neither
// the canvas nor the photograph under a stage that is not yet flat colour.
setTimeout(()=>{console.log('TIMEOUT');process.exit(2)},2400000);
const {chromium}=require('playwright'),serve=require('./serve.js');
const [,,dir]=process.argv;
const VPS=(process.env.VPS||'m390:390:844,d1440:1440:900').split(',').map(s=>s.split(':'));
(async()=>{const {srv,base}=await serve(dir);const b=await chromium.launch();let pass=0,fail=0;const results=[];
const b3=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const RUNS=[];for(const [n,w,h] of VPS){for(const scheme of ['light','dark'])RUNS.push([n,w,h,scheme,'']);}
VPS.forEach(([n,w,h],i)=>{for(const scheme of ['light','dark'])if(process.env.R3D_ALL==='1'||scheme===(i%2?'dark':'light'))RUNS.push([n,w,h,scheme,'?3d=force']);});
for(const [n0,w,h,scheme,Q] of RUNS){
  const mobile=+w<900,n=n0+(Q?'-3d':'');
  const c=await (Q?b3:b).newContext({viewport:{width:+w,height:+h},colorScheme:scheme,isMobile:mobile,hasTouch:mobile});
  // the default theme follows the sky over Torres Vedras, not the system: choose it, so both themes are covered whatever the hour
  await c.addInitScript(t=>{try{localStorage.setItem('ab-tema',t)}catch(e){}},scheme==='dark'?'noite':'dia');
  await c.addInitScript(()=>{ // fake scroll position hook (rubber-band emulation) + invariant monitor
    const d=Object.getOwnPropertyDescriptor(window,'pageYOffset')||Object.getOwnPropertyDescriptor(Window.prototype,'pageYOffset');
    const dy=Object.getOwnPropertyDescriptor(window,'scrollY')||Object.getOwnPropertyDescriptor(Window.prototype,'scrollY');
    window.__fakeY=null;
    Object.defineProperty(window,'pageYOffset',{configurable:true,get(){return window.__fakeY!==null?window.__fakeY:d.get.call(window)}});
    Object.defineProperty(window,'scrollY',{configurable:true,get(){return window.__fakeY!==null?window.__fakeY:dy.get.call(window)}});
    window.__bad=[];const mon=()=>{const i=document.querySelector('.intro'),s=document.querySelector('.scene');if(i&&s){const o=+getComputedStyle(i).opacity,m=new DOMMatrix(getComputedStyle(s).transform);if(!(o>=0&&o<=1))__bad.push('opacity '+o);if(m.a<0.999)__bad.push('scale '+m.a);if(window.__S&&m.a>window.__S*1.001)__bad.push('scale>S '+m.a);
      const cv=document.querySelector('.porta__3d'),fl=document.querySelector('.porta__flood');if(cv&&getComputedStyle(cv).visibility!=='visible'&&getComputedStyle(s).visibility==='hidden'&&fl&&+getComputedStyle(fl).opacity<0.999)__bad.push('blank (neither canvas nor photograph)')}requestAnimationFrame(mon)};requestAnimationFrame(mon);
  });
  const pg=await c.newPage();await serve.offline(pg);const errs=[];pg.on('pageerror',e=>errs.push(String(e)));
  await pg.goto(base+Q,{waitUntil:'networkidle'});await pg.waitForTimeout(1500);
  if(Q)await pg.waitForFunction(()=>document.documentElement.__porta&&document.documentElement.__porta.geo().d3==='on',null,{timeout:60000}).catch(()=>{});
  const rest0=await pg.evaluate(()=>{const l=document.querySelector('.lockup').getBoundingClientRect();return {top:l.top,left:l.left}});
  const geo=await pg.evaluate(()=>{const w=document.querySelector('.porta'),st=document.querySelector('.porta__stage');return {run:w.offsetHeight-st.offsetHeight,max:document.documentElement.scrollHeight-innerHeight}});
  const check=async(name)=>{await pg.waitForTimeout(900);
    await pg.waitForFunction(()=>{const P=document.documentElement.__porta&&document.documentElement.__porta.geo(),i=document.querySelector('.intro');return P&&P.r===0&&P.p===0&&!/opacity|transform/.test(i.getAttribute('style')||'')},null,{timeout:15000}).catch(()=>{});
    const r=await pg.evaluate(()=>{const q=s=>document.querySelector(s),cs=e=>getComputedStyle(e);const i=q('.intro'),l=q('.lockup').getBoundingClientRect();let op=1;for(let e=q('.lockup');e;e=e.parentElement)op*=+cs(e).opacity;
      return {y:scrollY,introOpacity:cs(i).opacity,introTransform:cs(i).transform,inline:i.getAttribute('style')||'',lockupOpacity:+op.toFixed(4),lockTop:l.top,lockLeft:l.left,
        scene:cs(q('.scene')).transform,leafL:cs(q('.leaf--l')).transform,plate:cs(q('.ph--plate')).transform,light:cs(q('.leaf__shade')).opacity,flood:cs(q('.porta__flood')).opacity,lede:cs(q('.lede')).opacity,bad:window.__bad.splice(0),
        canvas:q('.porta__3d')?cs(q('.porta__3d')).visibility:'none',sceneVis:cs(q('.scene')).visibility,d3:document.documentElement.__porta?document.documentElement.__porta.geo().d3:'-'}});
    const ok=(!Q||(r.canvas==='hidden'&&r.sceneVis==='visible'&&r.d3==='on'))&&r.y<=0&&r.introOpacity==='1'&&r.introTransform==='none'&&!/opacity|transform/.test(r.inline)&&r.lockupOpacity===1&&Math.abs(r.lockTop-rest0.top)<0.5&&Math.abs(r.lockLeft-rest0.left)<0.5&&r.scene==='none'&&r.leafL==='none'&&r.plate==='none'&&r.light==='0'&&r.flood==='0'&&r.bad.length===0;
    (ok?pass++:fail++);results.push({vp:n,scheme,name,ok,...(ok?{}:r)});console.log(ok?'PASS':'FAIL',n,scheme,name,ok?'':JSON.stringify(r));};
  const toTop=async()=>{await pg.evaluate(()=>{window.__fakeY=null;scrollTo(0,0)})};
  await pg.evaluate(()=>{const s=document.querySelector('.scene');window.__S=999});
  // A. wheel down through everything, then wheel back up (fast and slow)
  await pg.mouse.move(+w/2,+h/2);
  for(let y=0;y<geo.max+200;y+=100){await pg.mouse.wheel(0,100);await pg.waitForTimeout(16);}
  await pg.waitForTimeout(500);
  for(let y=geo.max+200;y>-400;y-=100){await pg.mouse.wheel(0,-100);await pg.waitForTimeout(16);}
  await check('A wheel down + back up');
  for(let k=0;k<6;k++){await pg.mouse.wheel(0,600);await pg.waitForTimeout(30);}for(let k=0;k<8;k++){await pg.mouse.wheel(0,-600);await pg.waitForTimeout(30);}
  await check('A2 fast wheel flick down + up');
  // B. touch-like drags (finger steps), down then up past the top
  if(mobile){const cdp=await c.newCDPSession(pg);const drag=async(total)=>{const dir=Math.sign(total);let done=0;while(done<Math.abs(total)){const leg=Math.min(320,Math.abs(total)-done);const y0=dir>0?Math.round(+h*0.8):Math.round(+h*0.2);
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:+w/2,y:y0}]});for(let m=20;m<=leg;m+=20){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:+w/2,y:y0-dir*m}]});await pg.waitForTimeout(12);}
      await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});done+=leg;}};
    await drag(geo.run*0.7);await pg.waitForTimeout(200);await drag(-(geo.run*0.9));await check('B touch drags down to p~0.7 + back up');
    await drag(geo.max);await drag(-(geo.max+300));await check('B2 touch drags to the end + back up');}
  // C. programmatic jumps
  for(const seq of [[geo.max,0],[Math.round(geo.run*0.5),0],[Math.round(geo.run*0.1),Math.round(geo.run*0.9),Math.round(geo.run*0.05),0]]){
    for(const y of seq){await pg.evaluate(y=>scrollTo(0,y),y);await pg.waitForTimeout(60);}await check('C jumps '+seq.join('>'));}
  // D. rubber-band emulation: mid-sequence, then scrollY < 0 (top overscroll), then back to 0; and > max at the end
  await pg.evaluate(y=>scrollTo(0,y),Math.round(geo.run*0.5));await pg.waitForTimeout(600);
  for(const fy of [Math.round(geo.run*0.3),Math.round(geo.run*0.1),-30,-90,-140,-60,-10]){await pg.evaluate(fy=>{window.__fakeY=fy;dispatchEvent(new Event('scroll'))},fy);await pg.waitForTimeout(40);}
  await pg.waitForTimeout(400);
  const neg=await pg.evaluate(()=>({o:getComputedStyle(document.querySelector('.intro')).opacity,t:getComputedStyle(document.querySelector('.intro')).transform}));
  await toTop();await check('D rubber-band above the top (scrollY -140..-10), held at -10: '+JSON.stringify(neg));
  await pg.evaluate(m=>{scrollTo(0,m)},geo.max);await pg.waitForTimeout(400);
  for(const fy of [geo.max+40,geo.max+120,geo.max+60]){await pg.evaluate(fy=>{window.__fakeY=fy;dispatchEvent(new Event('scroll'))},fy);await pg.waitForTimeout(40);}
  await pg.evaluate(()=>{window.__fakeY=null});for(let y=geo.max;y>-300;y-=150){await pg.mouse.wheel(0,-150);await pg.waitForTimeout(16);}await check('D2 overscroll past the end, then wheel back up');
  // E. viewport height changes mid-sequence (toolbar shows / hides), then back up
  await pg.evaluate(y=>scrollTo(0,y),Math.round(geo.run*0.45));await pg.waitForTimeout(500);
  await pg.setViewportSize({width:+w,height:+h-84});await pg.waitForTimeout(300);
  for(let k=0;k<4;k++){await pg.mouse.wheel(0,-60);await pg.waitForTimeout(16);}
  await pg.setViewportSize({width:+w,height:+h});await pg.waitForTimeout(200);
  for(let y=0;y<geo.run;y+=120){await pg.mouse.wheel(0,-120);await pg.waitForTimeout(16);}
  await check('E viewport height -84px mid-sequence and back, wheel up');
  await pg.evaluate(y=>scrollTo(0,y),Math.round(geo.run*0.8));await pg.waitForTimeout(400);
  await pg.setViewportSize({width:+w,height:+h+60});await pg.waitForTimeout(150);await pg.evaluate(()=>scrollTo(0,0));await pg.setViewportSize({width:+w,height:+h});
  await check('E2 viewport taller at p~0.8, jump to top, restore');
  // F. fast flicks (3000-3500 px/s). A recorder reads every frame after the driver has written it (a ResizeObserver
  // fires after the frame's rAF callbacks and layout): F1 a flick back to the top must find the title there within
  // 100ms of scrollY reaching 0; F2 a fling down through the hand-off must never show the list panel's edge over a
  // stage that is not yet flat hall colour (the flood covers the stage before the panel arrives).
  const REC=()=>{const q=s=>document.querySelector(s);window.__rf=[];const d=document.createElement('div');d.style.cssText='position:fixed;left:0;top:0;width:1px;height:1px;pointer-events:none;opacity:0';document.body.appendChild(d);
    const ro=new ResizeObserver(()=>{let o=1;for(let e=q('.lockup');e;e=e.parentElement)o*=+getComputedStyle(e).opacity;__rf.push([performance.now(),scrollY,o,+(q('.porta__flood').style.opacity||0),Math.round(q('.porta').getBoundingClientRect().bottom),innerHeight])});ro.observe(d);
    let k=0;const L=()=>{d.style.width=(1+(k++%2))+'px';if(window.__rf.length<900)requestAnimationFrame(L)};requestAnimationFrame(L)};
  const cdpF=await c.newCDPSession(pg);
  const flick=async(dy,speed)=>cdpF.send('Input.synthesizeScrollGesture',{x:Math.round(+w/2),y:Math.round(+h*(dy>0?0.3:0.7)),yDistance:dy,speed,gestureSourceType:'mouse',preventFling:true});
  await pg.evaluate(y=>scrollTo(0,y),Math.round(geo.run*0.6));await pg.waitForTimeout(700);
  await pg.evaluate(REC);await flick(Math.round(geo.run*0.6+geo.run*0.25),3000);await pg.waitForTimeout(900);
  {const rf=await pg.evaluate(()=>__rf);const i0=rf.findIndex(f=>f[1]<=0);const i1=i0<0?-1:rf.findIndex((f,i)=>i>=i0&&f[2]>=0.9);
   const ms=i0<0||i1<0?999:Math.round(rf[i1][0]-rf[i0][0]);const ok=ms<=100;(ok?pass++:fail++);
   console.log(ok?'PASS':'FAIL',n,scheme,'F1 flick to the top at 3000px/s: title back within',ms+'ms',ok?'':JSON.stringify(rf.slice(Math.max(0,i0-2),i0+6).map(f=>f.map(v=>+(+v).toFixed(2)))));}
  await check('F1 rest after the flick');
  await pg.evaluate(REC);await flick(-Math.round(geo.max),3500);await pg.waitForTimeout(900);
  {const rf=await pg.evaluate(()=>__rf);const seam=rf.filter(f=>f[4]<f[5]-0.5&&f[3]<1);const ok=rf.length>10&&seam.length===0;(ok?pass++:fail++);
   console.log(ok?'PASS':'FAIL',n,scheme,'F2 fling down at 3500px/s: frames with the panel on screen over an unflooded stage:',seam.length,ok?'':JSON.stringify(seam.slice(0,4)));}
  for(let y=geo.max;y>-300;y-=200){await pg.mouse.wheel(0,-200);await pg.waitForTimeout(16);}
  await check('F2 rest after the fling, wheel back up');
  if(errs.length){fail++;console.log('FAIL errors',errs)}
  await c.close();}
console.log(`reverse-scroll regression: ${pass} passed, ${fail} failed`);await b.close();await b3.close();srv.close();process.exit(fail?1:0);})();
