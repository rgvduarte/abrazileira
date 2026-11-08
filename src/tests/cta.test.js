// The hero action «Entrar na lista de espera» jumps to the list without playing the sequence and focuses the email.
// Usage: node src/tests/cta.test.js docs
// focuses the email field; keyboard Enter does the same; Tab from the CTA lands on the email with the list in view;
// reduced motion: same jump. Records every rAF frame after the click.
const {chromium}=require('playwright'),serve=require('./serve.js');const [,,dir]=process.argv;
(async()=>{const {srv,base}=await serve(dir);const b=await chromium.launch();let fail=0;
for(const [n,w,h] of [['m390',390,844],['d1440',1440,900]]) for(const mode of ['click','enter','tab','reduced-click']){
 const c=await b.newContext({viewport:{width:w,height:h},isMobile:w<900,hasTouch:w<900,reducedMotion:mode==='reduced-click'?'reduce':'no-preference'});const pg=await c.newPage();await serve.offline(pg);
 await pg.goto(base,{waitUntil:'networkidle'});await pg.waitForTimeout(1200);
 await pg.evaluate(()=>{window.__fr=[];const L=()=>{const s=new DOMMatrix(getComputedStyle(document.querySelector('.scene')).transform).a,o=+getComputedStyle(document.querySelector('.intro')).opacity;__fr.push([Math.round(scrollY),+s.toFixed(3),+o.toFixed(3)]);if(__fr.length<60)requestAnimationFrame(L)};requestAnimationFrame(L)});
 if(mode==='click'||mode==='reduced-click')await pg.click('.cta');else{await pg.focus('.cta');await pg.keyboard.press(mode==='enter'?'Enter':'Tab');}
 await pg.waitForTimeout(1200);
 const r=await pg.evaluate(()=>{const fr=__fr;const a=document.activeElement;const er=document.getElementById('email').getBoundingClientRect(),lr=document.getElementById('lista').getBoundingClientRect();
   const ys=[...new Set(fr.map(f=>f[0]))];const mids=fr.filter(f=>f[1]>1.001&&f[2]===1||(f[2]>0&&f[2]<1));
   return {active:a&&a.id,emailInView:er.top>=0&&er.bottom<=innerHeight,listTop:Math.round(lr.top),scrollYs:ys,intermediate:mids.length,frames:fr.length,last:fr[fr.length-1],seq:document.documentElement.dataset.sequence}});
 const ok=r.active==='email'&&r.emailInView&&r.intermediate===0&&r.scrollYs.length<=2;if(!ok)fail++;
 console.log(ok?'PASS':'FAIL',n,mode,JSON.stringify(r));await c.close();}
console.log('cta',fail?'FAILED':'ok');await b.close();srv.close();process.exit(fail?1:0)})();
