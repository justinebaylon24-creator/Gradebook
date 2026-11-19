/* Data, fake users, saved state, and helper functions */
const NOW='1st Sem 2026-2027',PER=['Midterm','Finals'];
const CRS={BSCS:'BS Computer Science',BSTM:'BS Tourism Management'};
/* id:[title,teacher,course,code shown] -- 1st year, 1st semester */
const SUB={
CS101:['Introduction to Computing','t1','BSCS','CS 101'],
CS102:['Programming 1','t1','BSCS','CS 102'],
GEE1C:['Living in the IT Era','t1','BSCS','GEE 1'],
GE1C:['Mathematics in the Modern World','t1','BSCS','GE 1'],
PF1C:['Movement Competency Training','t1','BSCS','PATHFIT 1'],
CW1:['Civic Welfare Training Service 1','t1','BSCS','CWTS 1'],
TH1:['Tourism & Hospitality 1','t2','BSTM','THC 1'],
TH2:['Risk Management as Applied to Safety, Security and Sanitation','t2','BSTM','THC 2'],
GE1T:['Mathematics in the Modern World','t2','BSTM','GE 1'],
GEE1T:['IT in New Era','t2','BSTM','GEE 1'],
PF1T:['Wellness','t2','BSTM','PATHFIT 1'],
NS1:['National Service Training Program 1','t2','BSTM','NSTP 1']};
const U=[
{id:'2026-0101',name:'Ana Reyes',role:'student',pw:'student123',course:'BSCS'},
{id:'2026-0102',name:'Ben Cruz',role:'student',pw:'student123',course:'BSCS'},
{id:'2026-0103',name:'Carla Santos',role:'student',pw:'student123',course:'BSCS'},
{id:'2026-0104',name:'Dino Lim',role:'student',pw:'student123',course:'BSTM'},
{id:'2026-0105',name:'Ella Garcia',role:'student',pw:'student123',course:'BSTM'},
{id:'2026-0106',name:'Faye Mendoza',role:'student',pw:'student123',course:'BSTM'},
{id:'T-001',name:'Mr. Paolo Ramos',role:'teacher',pw:'teacher123',key:'t1'},
{id:'T-002',name:'Ms. Liza Villanueva',role:'teacher',pw:'teacher123',key:'t2'},
{id:'ADMIN',name:'Registrar Office',role:'admin',pw:'admin123'}];
let STU=U.filter(u=>u.role==='student');
const DEMO={student:['2026-0101','student123'],teacher:['T-001','teacher123'],admin:['ADMIN','admin123']};
const K=(s,c,m,p)=>[s,c,m,p].join('|');
const $=i=>document.getElementById(i);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nm=id=>U.find(u=>u.id===id).name;
const tn=k=>{const u=U.find(u=>u.key===k);return u?u.name:'Unassigned'};
const subsOf=c=>Object.keys(SUB).filter(k=>SUB[k][2]===c);
const stuOf=c=>STU.filter(s=>s.course===SUB[c][2]);
const rcs=c=>stuOf(c).map(s=>`<label class="chk"><input type="checkbox" class="rc" value="${s.id}"> ${s.name}</label>`).join('');
/* Grading and Equivalent scale (percent -> decimal) */
const eq=v=>v==null?null:v>=96.5?1:v>=93.5?1.25:v>=90.5?1.5:v>=87.5?1.75:v>=84.5?2:v>=81.5?2.25:v>=78.5?2.5:v>=75.5?2.75:v>=74.5?3:5;
const fmt=x=>Number.isInteger(x)?x.toFixed(1):String(x);

function seed(){const g={};let n=7;
 STU.forEach(s=>subsOf(s.course).slice(0,2).forEach(c=>{n=(n*37+11)%23;g[K(s.id,c,NOW,'Midterm')]={v:76+n,st:'posted'}}));
 g[K('2026-0101','GEE1C',NOW,'Midterm')]={v:88,st:'draft'};
 return{g,off:{},del:[],acc:[],pw:{},must:{},pub:{Midterm:true,Finals:false},log:[],
  notes:[{id:1,to:['2026-0102'],sub:'CS102',act:'Lab 3: Programming 1 exercise',due:'2026-11-05',ins:'Submit the file in the class folder.',by:'t1',at:'2026-10-24'}]}}
let S;try{S=JSON.parse(localStorage.getItem('ogs2'))}catch(e){}
if(!S)S=seed();
S.acc=S.acc||[];S.pw=S.pw||{};S.must=S.must||{};S.acc.forEach(u=>U.push(u));S.del=S.del||[];for(let i=U.length-1;i>=0;i--)if(S.del.includes(U[i].id))U.splice(i,1);STU=U.filter(u=>u.role==='student');
S.asg=S.asg||{};Object.keys(S.asg).forEach(c=>{if(SUB[c])SUB[c][1]=S.asg[c]});
function save(){try{localStorage.setItem('ogs2',JSON.stringify(S))}catch(e){}}
function toast(t){const e=$('toast');e.textContent=t;e.className='on';clearTimeout(toast.t);toast.t=setTimeout(()=>e.className='',2600)}

let me=null,view='dash',lr='student',sem=NOW,cc=null,gc=null,gp='Midterm';

const vis=(sid,c,m,p)=>{const r=S.g[K(sid,c,m,p)];return r&&r.st==='posted'&&(m!==NOW||S.pub[p])?r.v:null};
const avg=a=>{a=a.filter(x=>x!=null);return a.length?Math.round(a.reduce((x,y)=>x+y,0)/a.length*10)/10:null};
const hasNote=(sid,c)=>S.notes.some(n=>n.to.includes(sid)&&n.sub===c);
const stat=(sid,c,m)=>PER.some(p=>vis(sid,c,m,p)!=null)?'Posted':hasNote(sid,c)?'Incomplete':'Pending';
const ring=v=>v==null?'<span class="ring none">–</span>':`<span class="ring ${eq(v)>3?'low':''}" title="${v}%">${fmt(eq(v))}</span>`;
const gcell=v=>`<span class="gc">${ring(v)}${v==null?'':`<small class="pc">${v}%</small>`}</span>`;
const badge=s=>`<span class="b ${s}">${s}</span>`;
const dash=v=>v==null?'–':fmt(eq(v))+' ('+v+'%)';
const noteHtml=n=>`<div class="note"><b>${esc(n.act)}</b><br>${SUB[n.sub][3]} ${SUB[n.sub][0]}, from ${tn(n.by)}<br>Deadline: ${esc(n.due||'none given')}<br>${esc(n.ins)}</div>`;
const mySubs=()=>Object.keys(SUB).filter(c=>SUB[c][1]===me.key);
const tabs=(list,cur,fn)=>`<div class="row">${list.map(c=>`<button class="tab ${c===cur?'on':''}" onclick="${fn}('${c}')">${SUB[c][3]} ${SUB[c][0]}</button>`).join('')}</div>`;

const ini=n=>n.replace(/^(Mr|Ms|Mrs|Dr)\.\s*/,'').split(' ').map(w=>w[0]).slice(0,2).join('');
const picker=(list,c,fn)=>{const st=stuOf(c),t=st.length*PER.length,d=st.reduce((a,s)=>a+PER.filter(p=>(S.g[K(s.id,c,NOW,p)]||{}).st==='posted').length,0),p=t?Math.round(d/t*100):0;
 return `<div class="card chead"><div><span class="code">${SUB[c][3]}</span><h2>${SUB[c][0]}</h2><span class="meta">${CRS[SUB[c][2]]} · Year 1, Section A · ${st.length} students</span></div>
 <div class="cp"><label for="cs">Switch class</label><select id="cs" onchange="${fn}(this.value)">${list.map(k=>`<option value="${k}" ${k===c?'selected':''}>${SUB[k][3]} ${SUB[k][0]}</option>`).join('')}</select><div class="bar"><i style="width:${p}%"></i></div><small>${d} of ${t} grades posted</small></div></div>`};

const V={};