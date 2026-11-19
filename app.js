/* Login, page shell, and button actions */
/* ---------- login ---------- */
function lgl(){return `<section class="lgl"><div class="lgt"><div class="lgo" role="img" aria-label="Gateways Institute of Science and Technology logo"></div><h1 class="brand">Gradebook</h1><p>Check your grades online. No trip to the registrar and no signatures needed for routine questions.</p><div class="lgs">Gateways Institute of Science and Technology<br>Antipolo City, Rizal</div></div><div class="lgb" role="img" aria-label="GIST Cogeo campus building"></div></section>`}
function login(){
 $('app').innerHTML=`<div class="lg">${lgl()}
 <form class="lgr" onsubmit="return doLogin(event)"><div class="wl"><small>WELCOME BACK</small><h2>Sign in to Gradebook</h2><p>Use the ID and password from your school.</p></div>
 <div class="row seg">${['student','teacher','admin'].map(r=>`<button type="button" class="tab ${r===lr?'on':''}" onclick="lr='${r}';login()">${r[0].toUpperCase()+r.slice(1)}</button>`).join('')}</div>
 <div><label for="li">${lr==='student'?'Student ID':lr==='teacher'?'Teacher ID':'Admin ID'}</label><input id="li" required autocomplete="username" style="width:100%"></div>
 <div><label for="lp">Password</label><input id="lp" type="password" required autocomplete="current-password" style="width:100%"></div>
 <p class="err" id="err" role="alert"></p>
 <button class="pb go">Sign in &rarr;</button>
 <div class="duo"><button type="button" class="pb sec" onclick="$('li').value=DEMO[lr][0];$('lp').value=DEMO[lr][1]">Fill demo ${lr} login</button>
 <button type="button" class="pb sec" onclick="act()">First time? Create your password</button></div>
 <div class="row"><button type="button" class="link" onclick="toast('Password resets are verified by the registrar. Contact the Admin office.')">Forgot password?</button>
 <button type="button" class="link" onclick="toast('New accounts are reviewed and approved by the school.')">Request an account</button></div>
 <small style="color:var(--mute)">Prototype with fictional students and sample grades only.</small></form></div>`}
function doLogin(e){e.preventDefault();
 const id=$('li').value.trim().toLowerCase();
 if(U.some(x=>x.id.toLowerCase()===id&&x.role===lr&&S.must[x.id]&&!S.pw[x.id])){$('err').textContent='This account has no password yet. Click "First time? Create your password".';return false}
 const u=U.find(x=>x.id.toLowerCase()===$('li').value.trim().toLowerCase()&&(S.pw[x.id]||x.pw)===$('lp').value&&x.role===lr);
 if(!u){$('err').textContent='ID, password, or role does not match. Check them and try again.';return false}
 if(S.off[u.id]){$('err').textContent='This account is deactivated. Contact the administrator.';return false}
 if(S.must[u.id]){pend=u;tmpIn=$('lp').value;setPw();return false}
 me=u;view='dash';cc=gc=null;render();return false}
function act(msg){$('app').innerHTML=`<div class="lg">${lgl()}<form class="lgr" onsubmit="return doAct(event)"><h2>Create your password</h2><p class="sub" style="margin:0">Type the ID your school gave you, then choose your own password.</p>
 <div><label for="ai2">ID</label><input id="ai2" required autocomplete="username" style="width:100%"></div>
 <div><label for="p1">New password (at least 8 characters)</label><input id="p1" type="password" required autocomplete="new-password" style="width:100%"></div>
 <div><label for="p2">Confirm new password</label><input id="p2" type="password" required autocomplete="new-password" style="width:100%"></div>
 <p class="err" id="err" role="alert">${msg||''}</p><button class="pb">Save password and sign in</button><button type="button" class="link" onclick="login()">Back to sign in</button></form></div>`}
function doAct(e){e.preventDefault();const id=$('ai2').value.trim().toLowerCase(),a=$('p1').value,b=$('p2').value,u=U.find(x=>x.id.toLowerCase()===id);
 if(!u||!S.must[u.id]||S.pw[u.id])return act('This ID is not waiting for a password. Check the ID or ask the admin.'),false;
 if(a.length<8)return act('Use at least 8 characters.'),false;
 if(a!==b)return act('The two passwords do not match.'),false;
 S.pw[u.id]=a;delete S.must[u.id];save();me=u;view='dash';cc=gc=null;render();toast('Password saved. Welcome!');return false}
function setPw(msg){$('app').innerHTML=`<div class="lg">${lgl()}<form class="lgr" onsubmit="return doSetPw(event)"><h2>Create your password</h2><p class="sub" style="margin:0">Hi ${esc(pend.name.split(' ')[0])}, the password you were given is temporary. Choose your own to continue.</p>
 <div><label for="p1">New password (at least 8 characters)</label><input id="p1" type="password" required autocomplete="new-password" style="width:100%"></div>
 <div><label for="p2">Confirm new password</label><input id="p2" type="password" required autocomplete="new-password" style="width:100%"></div>
 <p class="err" id="err" role="alert">${msg||''}</p><button class="pb">Save password and sign in</button><button type="button" class="link" onclick="pend=null;login()">Back to sign in</button></form></div>`}
function doSetPw(e){e.preventDefault();const a=$('p1').value,b=$('p2').value;
 if(a.length<8)return setPw('Use at least 8 characters.'),false;
 if(a!==b)return setPw('The two passwords do not match.'),false;
 if(a===tmpIn)return setPw('Choose a different password from the temporary one.'),false;
 S.pw[pend.id]=a;delete S.must[pend.id];save();me=pend;pend=null;view='dash';cc=gc=null;render();toast('Password saved. Welcome!');return false}

/* ---------- shell ---------- */
const NAV={student:[['dash','Dashboard'],['grades','My grades'],['msgs','Requirements']],
 teacher:[['dash','Dashboard'],['classes','My classes'],['grading','Grading'],['msgs','Notices']],
 admin:[['dash','Overview'],['accts','Accounts'],['sys','Grade settings']]};
let om=null,pend=null,tmpIn='',tmp=null;
document.addEventListener('click',e=>{if(om&&!e.target.closest('.mw')){om=null;render()}});
function gsumHtml(v,n){const a=avg(v),ps=v.filter(x=>eq(x)<=3).length;return `<div class="st"><b>${v.length}/${n}</b><span>Grades entered</span></div><div class="st"><b>${a==null?'–':fmt(eq(a))}</b><span>Class average${a==null?'':' ('+a+'%)'}</span></div><div class="st"><b>${ps}</b><span>Passing</span></div><div class="st"><b class="${v.length-ps?'bad':''}">${v.length-ps}</b><span>Below passing</span></div>`}
function eqUpd(i){const c=i.closest('tr').querySelector('.eqc span'),v=i.value===''?null:Number(i.value),ok=v!=null&&!isNaN(v)&&v>=0&&v<=100;c.textContent=ok?fmt(eq(v)):'–';c.classList.toggle('low',ok&&eq(v)>3);
 const all=document.querySelectorAll('.gi'),g=[...all].map(x=>x.value===''?NaN:Number(x.value)).filter(x=>!isNaN(x)&&x>=0&&x<=100),s=$('gsum');if(s)s.innerHTML=gsumHtml(g,all.length)}
function go(v){om=null;tmp=null;view=v;render()}
function render(){
 if(!me)return login();
 $('app').innerHTML=`<div class="shell"><aside><div class="brand"><span class="sbl"></span>Gradebook</div>
 <div class="nvs">${NAV[me.role].map(n=>`<button class="nv ${view===n[0]?'on':''}" onclick="go('${n[0]}')">${n[1]}</button>`).join('')}</div>
 <div class="me"><div class="av">${esc(me.name.replace(/^(Mr|Ms|Mrs|Dr)\.\s*/,'').split(' ').map(w=>w[0]).slice(0,2).join(''))}</div>${esc(me.name)}<br>${me.id}<br><button onclick="me=null;render()">Log out</button></div></aside>
 <main>${me.role==='teacher'&&!mySubs().length?noCls():V[me.role][view]()}</main></div>`}
function noCls(){return `<h1>Welcome, ${esc(me.name)}</h1><div class="card"><h2>No classes assigned yet</h2><p class="sub">The administrator has not assigned any subject to your account yet. Please contact the Admin office, then sign in again.</p></div>`}

/* ---------- actions ---------- */
function setCC(c){cc=c;render()}
function setGC(c){gc=c;render()}
function flt(q){q=q.toLowerCase();document.querySelectorAll('#st tr[data-s]').forEach(r=>r.style.display=r.dataset.s.includes(q)?'':'none')}
function rec(sid,c){const rows=[NOW].map(m=>`<tr><td>${m}</td>${PER.map(p=>{const r=S.g[K(sid,c,m,p)];return `<td>${r?fmt(eq(r.v))+' ('+r.v+'%, '+r.st+')':'–'}</td>`}).join('')}</tr>`).join('');
 const n=S.notes.filter(x=>x.to.includes(sid)&&x.sub===c);
 $('rec').innerHTML=`<div class="card tw"><h2>${nm(sid)}, ${SUB[c][3]}</h2><table><tr><th>Semester</th>${PER.map(p=>`<th>${p}</th>`).join('')}</tr>${rows}</table>${n.length?'<h2 style="margin-top:16px">Incomplete requirements</h2>'+n.map(noteHtml).join(''):'<p>No incomplete requirements.</p>'}</div>`;
 $('rec').scrollIntoView({behavior:'smooth'})}
function coll(){const o=[];let bad=0;document.querySelectorAll('.gi').forEach(i=>{if(i.value==='')return;const v=Number(i.value);if(isNaN(v)||v<0||v>100)bad=1;o.push({sid:i.dataset.s,v})});
 if(bad){toast('Grades must be numbers from 0 to 100.');return null}return o}
function draft(){const o=coll();if(!o)return;let n=0;
 o.forEach(x=>{const k=K(x.sid,gc,NOW,gp),r=S.g[k];if(!r||r.st!=='posted'){S.g[k]={v:x.v,st:'draft'};n++}});
 save();toast(n+' draft grade(s) saved.');render()}
function prev(){const o=coll();if(!o)return;
 $('pv').innerHTML=`<div class="card tw"><h2>Preview: what students will see</h2>${o.length?`<table><tr><th>Student</th><th>${gp}</th></tr>${o.map(x=>`<tr><td>${nm(x.sid)}</td><td>${gcell(x.v)}</td></tr>`).join('')}</table><p>Average: <b>${dash(avg(o.map(x=>x.v)))}</b></p>`:'Enter at least one grade to preview.'}</div>`}
function post(){const o=coll();if(!o)return;if(!o.length){toast('Enter at least one grade before posting.');return}
 const at=new Date().toLocaleString();
 o.forEach(x=>{const k=K(x.sid,gc,NOW,gp),r=S.g[k],rc=nm(x.sid)+', '+gc+' '+gp;
  if(r&&r.st==='posted'){if(r.v!==x.v)S.log.unshift({at,who:me.name,rec:rc,ch:'Changed '+r.v+' to '+x.v})}
  else S.log.unshift({at,who:me.name,rec:rc,ch:'Posted '+x.v});
  S.g[k]={v:x.v,st:'posted'}});
 save();toast('Grades posted.');render()}
function send(){const to=[...document.querySelectorAll('.rc:checked')].map(i=>i.value),a=$('na').value.trim();
 if(!to.length||!a){toast('Choose at least one student and name the activity.');return}
 S.notes.unshift({id:Date.now(),to,sub:$('ns').value,act:a,due:$('nd').value,ins:$('ni').value.trim(),by:me.key,at:new Date().toISOString().slice(0,10)});
 save();toast('Notice sent.');render()}
function tog(id){om=null;if(S.off[id])delete S.off[id];else{if(!confirm('Deactivate this account? The user will not be able to sign in.'))return render();S.off[id]=1}save();render()}
render();

function addAcc(){const id=$('ai').value.trim(),n=$('an').value.trim();
 if(!id||!n){toast('Enter the student ID and full name.');return}
 if(U.some(u=>u.id.toLowerCase()===id.toLowerCase())){toast('That ID already exists.');return}
 const c=$('ac').value,t=tn(Object.values(SUB).find(s=>s[2]===c)[1]),u={id,name:n,role:'student',pw:'',course:c};
 S.acc.push(u);U.push(u);STU=U.filter(x=>x.role==='student');S.must[id]=1;tmp={id,n,t};save();render()}
function addTch(){const id=$('ti').value.trim(),n=$('tnm').value.trim();
 if(!id||!n){toast('Enter the teacher ID and full name.');return}
 if(U.some(u=>u.id.toLowerCase()===id.toLowerCase())){toast('That ID already exists.');return}
 const key='t'+Date.now().toString(36),sel=[...document.querySelectorAll('.ts:checked')].map(i=>i.value),u={id,name:n,role:'teacher',pw:'',key};
 S.acc.push(u);U.push(u);S.must[id]=1;sel.forEach(c=>{SUB[c][1]=key;S.asg[c]=key});
 tmp={id,n,t:sel.length?sel.length+' subject'+(sel.length>1?'s':'')+' assigned':'No subjects assigned yet',tch:1};save();render()}
function assign(c,k){SUB[c][1]=k;S.asg[c]=k;save();toast(SUB[c][3]+(k?' assigned to '+tn(k)+'.':' is now unassigned.'));render()}
function resetPw(id){delete S.pw[id];S.must[id]=1;tmp={id,n:nm(id),reset:1};om=null;save();render()}

function delAcc(id){om=null;const u=U.find(x=>x.id===id);if(!u)return render();
 if(!confirm('Delete '+u.name+' ('+id+')?\n\nThis removes the account and ALL of their grades and notices. It cannot be undone.\n\nIf the student only transferred and you may need the records later, use Deactivate instead.'))return render();
 U.splice(U.indexOf(u),1);STU=U.filter(x=>x.role==='student');S.acc=S.acc.filter(x=>x.id!==id);if(!S.del.includes(id))S.del.push(id);
 Object.keys(S.g).forEach(k=>{if(k.split('|')[0]===id)delete S.g[k]});
 S.notes.forEach(n=>n.to=n.to.filter(x=>x!==id));S.notes=S.notes.filter(n=>n.to.length);
 delete S.pw[id];delete S.must[id];delete S.off[id];save();toast(u.name+' was deleted.');render()}