/* Teacher portal pages */
V.teacher={
 dash(){const mine=mySubs(),sent=S.notes.filter(n=>n.by===me.key),cnt=c=>stuOf(c).reduce((b,s)=>b+PER.filter(p=>(S.g[K(s.id,c,NOW,p)]||{}).st==='posted').length,0),
  tot=mine.reduce((a,c)=>a+stuOf(c).length*PER.length,0),done=mine.reduce((a,c)=>a+cnt(c),0),pc=tot?Math.round(done/tot*100):0,
  crs=[...new Set(mine.map(c=>SUB[c][2]))].map(k=>CRS[k]).join(', ');
  return `<section class="hero"><div><small>${NOW}</small><h1>Welcome, ${esc(me.name)}</h1><p>Here is a summary of your classes.</p><div class="chips"><span>${crs}</span><span>${mine.length} classes</span></div></div><div class="gwa"><small>Grades posted</small><b>${pc}%</b><span>${done} of ${tot} entries</span></div></section>
  <div class="stats"><div class="st"><b>${mine.length}</b><span>Classes</span></div><div class="st"><b>${stuOf(mine[0]).length}</b><span>Students</span></div><div class="st"><b>${tot-done}</b><span>Entries pending</span></div><div class="st"><b>${sent.length}</b><span>Notices sent</span></div></div>
  <h2>Assigned classes</h2><div class="grid sg">${mine.map(c=>{const n=stuOf(c).length,t=n*PER.length,d=cnt(c),p=t?Math.round(d/t*100):0;return `<div class="sc ${p==100?'':'pend'}"><div><b>${SUB[c][0]}</b><small style="display:block;color:var(--mute)"><span class="code">${SUB[c][3]}</span>${n} students</small></div><div class="bar"><i style="width:${p}%"></i></div><div class="sc-foot"><span>${t-d} grade entries pending</span><button class="link" onclick="gc='${c}';go('grading')">Enter grades</button></div></div>`}).join('')}</div>
  <h2 style="margin-top:26px">Recent notices you sent</h2>${sent.length?sent.slice(0,3).map(n=>`<div class="note"><b>${esc(n.act)}</b> to ${n.to.map(nm).join(', ')}</div>`).join(''):'<p class="sub">You have not sent any notices yet.</p>'}`},
 classes(){const mine=mySubs(),c=mine.includes(cc)?cc:mine[0];cc=c;
  const tg=(sid,p)=>{const r=S.g[K(sid,c,NOW,p)];return r?`<span class="${r.st==='draft'?'dr':''}"><b>${fmt(eq(r.v))}</b> <small>${r.v}%${r.st==='draft'?' · draft':''}</small></span>`:'–'};
  return `<h1>My classes</h1><p class="sub">You can only open classes assigned to you.</p>${picker(mine,c,'setCC')}
  <div class="row"><input id="q" placeholder="Search by name or ID" oninput="flt(this.value)" style="width:280px"></div>
  <div class="card tw"><table id="st"><tr><th>Student</th>${PER.map(p=>`<th>${p}</th>`).join('')}<th>Status</th><th></th></tr>${stuOf(c).map(s=>`<tr data-s="${(s.name+s.id).toLowerCase()}"><td><div class="who"><span class="avs">${ini(s.name)}</span><div><b>${s.name}</b><small>${s.id}</small></div></div></td>${PER.map(p=>`<td>${tg(s.id,p)}</td>`).join('')}<td>${badge(stat(s.id,c,NOW))}</td><td><button class="pb sec sm" onclick="rec('${s.id}','${c}')">Open record</button></td></tr>`).join('')}</table></div><div id="rec"></div>`},
 grading(){const mine=mySubs(),c=mine.includes(gc)?gc:mine[0];gc=c;const st=stuOf(c);
  const rows=st.map(s=>{const r=S.g[K(s.id,c,NOW,gp)],po=r&&r.st==='posted';return `<tr><td><div class="who"><span class="avs">${ini(s.name)}</span><div><b>${s.name}</b><small>${s.id}</small></div></div></td><td><input class="gi" type="number" min="0" max="100" step="0.1" inputmode="decimal" data-s="${s.id}" value="${r?r.v:''}" ${po?'disabled':''} aria-label="Grade for ${s.name}" oninput="eqUpd(this)">${po?` <button class="link" onclick="this.previousElementSibling.disabled=false;this.remove()">Edit</button>`:''}</td><td class="eqc"><span class="pill ${r&&eq(r.v)>3?'low':''}">${r?fmt(eq(r.v)):'–'}</span></td><td>${badge(r?(po?'Posted':'Draft'):'Pending')}</td></tr>`}).join('');
  const vals=st.map(s=>(S.g[K(s.id,c,NOW,gp)]||{}).v).filter(v=>v!=null);
  return `<h1>Grading</h1><p class="sub">Save drafts as often as you like. Students only see grades after you post them.</p>${picker(mine,c,'setGC')}
  <div class="row"><div class="row seg" style="display:inline-flex;margin:0" role="group" aria-label="Grading period">${PER.map(p=>`<button class="tab ${p===gp?'on':''}" onclick="gp='${p}';render()">${p}</button>`).join('')}</div><span class="meta">${NOW}</span></div>
  <div id="gsum" class="stats">${gsumHtml(vals,st.length)}</div>
  <div class="card tw"><table><tr><th>Student</th><th>Grade (%)</th><th>Equivalent</th><th>Status</th></tr>${rows}</table></div><div id="pv"></div>
  <div class="actbar noprint"><button class="pb sec" onclick="draft()">Save draft</button><button class="pb sec" onclick="prev()">Preview</button><button class="pb hlb" onclick="post()">Post grades</button></div>`},
 msgs(){const mine=mySubs(),sent=S.notes.filter(n=>n.by===me.key);
  return `<h1>Notices</h1><p class="sub">Tell students which activities or requirements are incomplete.</p>
  <div class="card"><div class="row"><div><label for="ns">Subject</label><select id="ns" onchange="$('rcs').innerHTML=rcs(this.value)">${mine.map(c=>`<option value="${c}">${SUB[c][3]} ${SUB[c][0]} (${SUB[c][2]})</option>`).join('')}</select></div>
  <div><label for="na">Activity name</label><input id="na" placeholder="e.g. Lab 4"></div><div><label for="nd">Deadline</label><input id="nd" type="date"></div></div>
  <label>Students</label><div><label class="chk"><input type="checkbox" onchange="document.querySelectorAll('.rc').forEach(i=>i.checked=this.checked)"> <b>Select all</b></label><span id="rcs">${rcs(mine[0])}</span></div>
  <label for="ni" style="margin-top:8px">Instructions</label><textarea id="ni" rows="3" style="width:100%"></textarea>
  <p><button class="pb" onclick="send()">Send notice</button></p></div>
  <h2>Sent notices</h2>${sent.length?sent.map(n=>`<div class="note"><b>${esc(n.act)}</b> (${SUB[n.sub][3]}, due ${esc(n.due||'no deadline')})<br>To: ${n.to.map(nm).join(', ')}</div>`).join(''):'<p class="sub">Nothing sent yet.</p>'}`}};