/* Student portal pages */
const SCALE=[['1.0','96.5 – 100'],['1.25','93.5 – 96.4'],['1.5','90.5 – 93.4'],['1.75','87.5 – 90.4'],['2.0','84.5 – 87.4'],['2.25','81.5 – 84.4'],['2.5','78.5 – 81.4'],['2.75','75.5 – 78.4'],['3.0','74.5 – 75.4'],['5.0','Below 74.5']];
V.student={
 dash(){const n=S.notes.filter(x=>x.to.includes(me.id)),subs=subsOf(me.course),
  av=subs.map(c=>avg(PER.map(p=>vis(me.id,c,NOW,p)))),all=avg(av),ok=av.filter(x=>x!=null).length;
  return `<section class="hero"><div><small>${NOW}</small><h1>Hello, ${esc(me.name.split(' ')[0])}</h1><p>Here is where your grades stand this term.</p>
  <div class="chips"><span>ID ${me.id}</span><span>${esc(CRS[me.course])}</span><span>1st year, Section A</span></div></div>
  <div class="gwa"><small>Semester standing</small><b>${all==null?'–':fmt(eq(all))}</b><span>${all==null?'No grades posted yet':all+'%'}</span></div></section>
  <div class="stats"><div class="st"><b>${subs.length}</b><span>Subjects</span></div><div class="st"><b>${ok}</b><span>Graded</span></div><div class="st"><b>${subs.length-ok}</b><span>Waiting for grades</span></div><div class="st"><b>${n.length}</b><span>Notices</span></div></div>
  <h2>Your subjects</h2><div class="grid sg">${subs.map((c,k)=>{const a=av[k];return `<div class="sc ${a==null?'pend':eq(a)>3?'low':''}"><div class="sc-top">${gcell(a)}<div><b>${SUB[c][0]}</b><small>${SUB[c][3]}, ${tn(SUB[c][1])}</small></div></div>
  <div class="bar"><i style="width:${a||0}%"></i></div><div class="sc-foot">${badge(stat(me.id,c,NOW))}<span>${PER.map(p=>p+' '+(vis(me.id,c,NOW,p)!=null?vis(me.id,c,NOW,p)+'%':'–')).join(' · ')}</span></div></div>`}).join('')}</div>
  <h2 style="margin-top:26px">Notices from teachers</h2>
  ${n.length?n.slice(0,3).map(noteHtml).join('')+`<button class="link" onclick="go('msgs')">See all requirements</button>`:'<p class="sub">No notices. You are all caught up.</p>'}`},
 grades(){const subs=subsOf(me.course),all=avg(subs.map(c=>avg(PER.map(p=>vis(me.id,c,NOW,p)))));
  const rows=subs.map(c=>{const v=PER.map(p=>vis(me.id,c,NOW,p)),a=avg(v);return `<tr><td><b>${SUB[c][0]}</b><br><small><span class="code">${SUB[c][3]}</span>${tn(SUB[c][1])}</small></td>${v.map(x=>`<td>${gcell(x)}</td>`).join('')}<td class="avc ${a!=null&&eq(a)>3?'low':''}">${a==null?'–':`<b>${fmt(eq(a))}</b><small>${a}%</small>`}</td><td>${badge(stat(me.id,c,NOW))}</td></tr>`}).join('');
  return `<div class="ph"><div><h1>My grades</h1><p class="sub">Grades appear here once your teacher posts them. Drafts are never shown.</p></div><button class="pb sec noprint" onclick="window.print()">Print / Save as PDF</button></div>
  <div class="card rep"><div><small class="sch">Gateways Institute of Science and Technology</small><h2 style="margin:2px 0 4px">${esc(me.name)}</h2><span class="meta">${me.id} · ${esc(CRS[me.course])} · 1st year, Section A · ${NOW}</span></div><div class="gwa2"><small>Semester standing</small><b>${all==null?'–':fmt(eq(all))}</b><span>${all==null?'No grades yet':all+'%'}</span></div></div>
  <div class="card tw"><table><tr><th>Subject</th>${PER.map(p=>`<th>${p}</th>`).join('')}<th>Average</th><th>Status</th></tr>${rows}</table></div>
  <details class="card noprint"><summary><b>Grading scale</b> (percent to decimal)</summary><div class="scale">${SCALE.map(x=>`<span><b>${x[0]}</b>${x[1]}</span>`).join('')}</div></details>`},
 msgs(){const n=S.notes.filter(x=>x.to.includes(me.id)),inc=subsOf(me.course).filter(c=>hasNote(me.id,c));
  return `<h1>Requirements and messages</h1><p class="sub">Incomplete activities your teachers have flagged for you.</p>
  ${inc.length?`<p>Subjects with incomplete requirements: <b>${inc.map(c=>SUB[c][0]).join(', ')}</b></p>`:''}
  ${n.length?n.map(noteHtml).join(''):'<div class="card">No requirements are waiting on you.</div>'}`}};