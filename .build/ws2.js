/* ------------------------------------------------------------------ workspace: tasks + dashboard + tour */
var TASKS = [
  {page:"northstar-notes.example/meetings", cur:"Northstar Notes helps teams record meetings and organize notes.",
   addQ:"How do I turn meeting notes into action items?", addA:"After each meeting, list every to-do and check its owner and due date, so the team can keep following up.",
   q:"How do I turn meeting notes into action items?", quote:"“When choosing a tool, look at whether it can pick out owners, deadlines and follow-ups from your meeting notes.”"},
  {page:"northstar-notes.example/pricing", cur:"Simple pricing for teams of every size. Start free and upgrade as you grow.",
   addQ:"How is Northstar Notes different?", addA:"Unlike general note apps, Northstar Notes turns every meeting into a list of owners and due dates. Teams moving from Atlas Notes or Minute Flow can keep their templates.",
   q:"Best AI meeting notes app for small teams", quote:"“For small teams, Atlas Notes and Echo Notes are popular picks; Minute Flow suits teams that rely on templates.”"},
  {page:"northstar-notes.example", cur:"Meeting notes, organized.",
   addQ:"", addA:"AI meeting notes for small teams of 2–20 people. Northstar Notes records the call, writes the summary and lists every follow-up.",
   q:"Meeting notes software for startups", quote:"“Startups often pick tools built for small teams, such as Echo Notes or Tally Minutes.”"}
];
var WS_CUR = TASKS[0].cur, WS_Q = TASKS[0].addQ, WS_A = TASKS[0].addA;
function wsFresh(){ return {page:"overview", cur:-1, returned:false, measuring:false, asked:10, discussion:false, firstVisit:false, tour:-1,
  tasks:[0,1,2].map(function(){ return {st:"todo", copied:false, live:false}; }),
  open:{details:false, ans:false, hist:false, draft:false, earlier:false}, extra:[],
  checking:false, checked:false, same:false, last:"d16", auto:{on:false, freq:"3d"}, autoMsg:false}; }
var FREQ_NEXT = {daily:"d19", "3d":"d21", weekly:"d25"};
function freqLabel(f){ return t("w.freq."+f); }
function curTask(){ return S.ws.cur>=0 ? S.ws.tasks[S.ws.cur] : null; }
function hasTopic(){ return !S.ws.measuring; }
function taskStatus(i){ var k = S.ws.tasks[i]; if(k.st==="adopted"){ if(k.live && S.ws.checked && i===0) return "checked"; return k.live ? "live" : "adopted"; } return k.st; }
function taskDot(i){ return {todo:"hot", open:"hot", adopted:"hot", live:"ok", checked:"ok", declined:""}[taskStatus(i)]; }
function tasksDone(){ return S.ws.tasks.filter(function(k){ return k.st==="declined" || (k.st==="adopted" && k.live); }).length; }
function nextUndone(from){ for(var j=1;j<=3;j++){ var i=(from+j)%3, k=S.ws.tasks[i]; if(k.st==="todo"||k.st==="open") return i; } return -1; }
function tog(key, label){ return '<button class="ws-toggle'+(S.ws.open[key]?' open':'')+'" data-act="ws-open" data-k="'+key+'" aria-expanded="'+S.ws.open[key]+'">'+label+'</button>'; }
function linkBtn(label, a, extra){ return '<button class="link" data-act="'+a+'"'+(extra||'')+'>'+label+'</button>'; }
function addBlock(T){ return '<div class="ws-add-block">'+(T.addQ?'<b>'+T.addQ+'</b>':'')+T.addA+'</div>'; }

function wsControls(){
  var W = S.ws, n = W.last==="d16" ? 1 : 2;
  var h = '<div class="ws-ctl"><div class="ws-ctl-row"><div class="l"><b>'+t("w.ctl.h")+'</b><small>'+t("w.ctl.manual2",{n:n, d:t(W.last==="d16"?"d16full":"d18full")})+'</small></div>';
  h += W.checking ? '<span class="pill">'+t("w.ctl.running",{n:W.asked})+'</span>' : '<button class="btn btn-line" data-act="ws-check"'+(W.measuring?' disabled':'')+'>'+t("w.ctl.now")+'</button>';
  h += '</div><div class="ws-ctl-row ws-auto"><button class="sw'+(W.auto.on?' on':'')+'" role="switch" aria-checked="'+W.auto.on+'" data-act="ws-auto-toggle" aria-label="'+t("w.auto.label")+'"><i></i></button><span>'+t("w.auto.label")+'</span>';
  if(W.auto.on){ h += '<div class="seg" role="radiogroup">'+["daily","3d","weekly"].map(function(f){ return '<button class="'+(W.auto.freq===f?'on':'')+'" data-act="ws-auto-freq" data-f="'+f+'" role="radio" aria-checked="'+(W.auto.freq===f)+'">'+freqLabel(f)+'</button>'; }).join("")+'</div><small class="muted">'+t("w.auto.next",{d:t(FREQ_NEXT[W.auto.freq])})+'</small>'; }
  return h+'</div></div>';
}

function wsSide(){
  var W = S.ws, h = '';
  h += '<div class="logo">'+LOGO_IMG+'opcmaster</div>';
  h += '<button class="site-switch" id="tour-project" type="button" data-act="ws-soon"><span class="site-fav">N</span><span><b>'+esc(S.undBrand)+'</b><small>'+esc(S.domain)+'</small></span></button>';
  h += '<div class="ws-group"><button class="ws-item'+(W.page==="overview"?' on':'')+'" data-act="ws-go" data-p="overview">'+t("w.nav.overview")+'</button></div>';
  h += '<div class="ws-group"><div class="ws-gh">'+t("w.nav.topics")+(hasTopic()?'<span>'+tasksDone()+'/3</span>':'')+'</div>';
  if(hasTopic()) [0,1,2].forEach(function(i){ h += '<button class="ws-item'+(W.cur===i&&W.page!=="overview"?' on':'')+'" data-act="ws-task" data-i="'+i+'">'+t("t"+(i+1)+".title")+'<small><i class="'+taskDot(i)+'"></i>'+t("tst."+taskStatus(i))+'</small></button>'; });
  else h += '<div class="ws-empty">'+t("w.nav.notopics")+'</div>';
  h += '<button class="ws-add" data-act="ws-discuss">+ '+t("w.nav.startsite")+'</button></div>';
  h += '<div class="ws-group"><div class="ws-gh">'+t("w.nav.more")+'</div>';
  ["w.more.briefs","w.more.rank","w.more.audit","w.more.cms"].forEach(function(k){ h += '<button class="ws-item row" data-act="ws-soon"><span>'+t(k)+'</span><span class="soon">'+t("w.soon")+'</span></button>'; });
  h += '</div>';
  h += '<div class="ws-foot"><button data-act="ws-tour">'+t("tour.open")+'</button><button data-act="ws-soon">'+t("w.nav.scope")+'</button><button data-act="lang">'+t("lang.name")+'</button>';
  if(S.user) h += '<button data-act="ws-soon"><span class="av-s">'+esc(S.user.email.charAt(0).toUpperCase())+'</span><span>'+esc(S.user.email)+'</span></button>';
  h += '<button data-act="home">'+t("side.back")+'</button></div>';
  return h;
}

function wsOverview(){
  var W = S.ws, h = '<div class="ws-crumb">'+t("w.nav.overview")+'</div><h1 class="ws-h1">'+t("w.ov.h1")+'</h1>';
  h += wsControls();
  h += '<div class="ws-tiles">';
  var busy = W.measuring || W.checking, up = W.checked;
  [["w.m.mentioned",up?7:6,false],["w.m.cited",up?3:2,!W.returned]].forEach(function(m){
    h += '<div class="ws-tile'+(m[2]&&!busy?' focus':'')+'"><label>'+t(m[0])+'</label>'+(busy?'<div class="skel"></div>':'<div class="num">'+m[1]+'<span> / 10</span></div>'+(up?'<span class="delta">'+t("w.ov.vs",{n:1})+'</span>':''))+'</div>'; });
  h += '</div>';
  if(W.measuring) h += '<p class="ws-sub">'+t("w.ov.measuring",{n:W.asked})+'</p>';
  else {
    h += tog("details", t("w.ov.details"));
    if(W.open.details) h += '<div class="ws-box"><p>'+t("w.ov.pos")+' <b class="mono">#3 / 8</b></p><p class="muted">'+t("w.ov.meta")+'</p><p class="muted">'+t("w.ov.sample")+'</p><p class="muted small">'+t("w.ov.scopeNote")+'</p></div>';
  }
  h += '<hr class="ws-hr"><div class="ws-sec"><h3>'+t("w.ov.fixes")+(hasTopic()?' · '+t("w.tasks.progress",{d:tasksDone()}):'')+'</h3>';
  if(!hasTopic()) h += '<p class="muted">'+t("w.ov.nofixes")+'</p></div>';
  else { h += '</div><div class="ws-tasklist">'+[0,1,2].map(function(i){ var s = taskStatus(i);
      return '<div class="ws-trow"><span class="tn'+(s==="live"||s==="checked"||s==="declined"?' done':'')+'">'+(s==="live"||s==="checked"?I.check:(i+1))+'</span><div class="t"><b>'+t("t"+(i+1)+".title")+'</b><small>'+t("t"+(i+1)+".why")+'</small></div><span class="pill">'+t("tst."+s)+'</span><button class="btn btn-line" data-act="ws-task" data-i="'+i+'">'+t("w.open")+'</button></div>'; }).join("")+'</div>'; }
  h += '<div class="ws-sec"><h3>'+t("w.ov.more")+'</h3></div><div class="ws-soonrow">'+
    ["w.more.rank","w.more.audit","w.more.briefs"].map(function(k){ return '<div><b>'+t(k)+'</b><span class="soon">'+t("w.soon")+'</span></div>'; }).join("")+'</div>';
  return h;
}

function wsTopic(){
  var W = S.ws;
  if(W.cur<0){ return '<div class="ws-crumb">'+t("w.nav.topics")+' / '+t("w.topic.site")+'</div><h1 class="ws-h1">'+t("w.topic.siteH")+'</h1><p class="ws-sub">'+t("w.topic.siteSub")+'</p><div class="ws-box"><span class="ws-lab">'+t("w.topic.home")+'</span><p>'+TASKS[2].cur+'</p></div>'; }
  var T = TASKS[W.cur], k = curTask(), n = W.cur+1;
  var h = '<div class="ws-crumb">'+t("w.nav.topics")+' / '+t("t"+n+".title")+'</div><h1 class="ws-h1">'+t("t"+n+".page")+'</h1>';
  h += '<div class="ws-url">'+T.page+'</div><p class="ws-sub">'+t("t"+n+".why")+'</p>';
  h += '<div class="ws-box"><span class="ws-lab">'+t(k.st==="open"||k.st==="todo"?"w.topic.orig":"w.topic.record")+'</span><p>'+T.cur+'</p></div>';
  h += tog("ans", t("w.topic.ans"));
  if(W.open.ans) h += '<div class="ws-box"><span class="ws-lab">'+t("w.topic.ansLab")+'</span><p><b>'+T.q+'</b></p><p class="ws-quote">'+T.quote+'</p><p><span class="pill">'+t("w.topic.notm")+'</span></p><p class="muted small">'+t("w.topic.ansMeta")+'</p><p class="muted small">'+t("w.topic.ansNote")+'</p></div>';
  var lk = {open:"w.topic.openChange", adopted:"w.topic.openDraft", declined:"w.topic.openOrig"}[k.st];
  if(lk) h += '<div>'+linkBtn(t(lk)+' ↗',"ws-go",' data-p="review"')+'</div>';
  return h;
}

function wsReview(){
  var W = S.ws; if(W.cur<0) W.cur = 0;
  var T = TASKS[W.cur], k = curTask(), n = W.cur+1;
  var h = '<div class="ws-crumb">'+t("t"+n+".title")+' / '+t("w.rv.crumb")+'</div><h1 class="ws-h1">'+t("t"+n+".title")+'</h1>';
  h += '<div class="ws-status">'+linkBtn('← '+t("w.rv.back"),"ws-go",' data-p="topic"')+'<span class="pill">'+t(k.st==="declined"?"w.rv.unchanged":(k.live?"tst.live":"w.rv.notpub"))+'</span></div>';
  if(k.st==="adopted") h += '<div class="ws-box"><span class="ws-lab">'+t("w.rv.draft")+'</span><p>'+T.cur+'</p><div style="margin-top:10px">'+addBlock(T)+'</div></div>';
  else if(k.st==="declined") h += '<div class="ws-box"><span class="ws-lab">'+t("w.rv.kept")+'</span><p>'+T.cur+'</p><p class="muted small">'+t("w.rv.notChanged")+'</p></div>';
  else { h += '<div class="ws-box"><span class="ws-lab">'+t("w.rv.saved")+'</span><p>'+T.cur+'</p></div><div class="ws-box"><span class="ws-lab">'+t("w.rv.keepAdd2")+'</span><p class="muted">'+T.cur+'</p><div style="margin-top:10px">'+addBlock(T)+'</div></div>'; }
  h += tog("hist", t("w.rv.hist"));
  if(W.open.hist) h += '<div class="ws-box"><span class="ws-lab">'+t("w.rv.src")+' · '+T.page+'</span><p>'+T.cur+'</p><p class="muted small">'+t("w.rv.srcNote")+'</p><p class="mono small">'+t({open:"w.rv.v.pending",todo:"w.rv.v.pending",adopted:"w.rv.v.adopted",declined:"w.rv.v.declined"}[k.st])+'</p></div>';
  h += '<div class="ws-callout"><div><b>'+t("w.rv.publishH2")+'</b><p>'+t("w.rv.publishP2")+'</p></div><span class="soon">'+t("w.rv.publishSoon")+'</span></div>';
  return h;
}

function wsTaskCard(){
  var W = S.ws;
  var rows = [0,1,2].map(function(i){ var s = taskStatus(i), done = s==="live"||s==="checked"||s==="declined";
    return '<button class="tk'+(W.cur===i?' on':'')+(done?' done':'')+'" data-act="ws-task" data-i="'+i+'"><span class="tn">'+(s==="live"||s==="checked"?I.check:(i+1))+'</span><span class="tt"><b>'+t("t"+(i+1)+".title")+'</b><small>'+t("tst."+s)+'</small></span></button>'; }).join("");
  return '<div class="cc tasks"><div class="cc-h tasks-h"><span>'+t("w.tasks.h",{n:3})+'</span><span class="muted">'+t("w.tasks.progress",{d:tasksDone()})+'</span></div><div class="tk-list">'+rows+'</div></div>';
}

function wsChatBody(){
  var W = S.ws, h = '', who = '<span class="who">OPCMASTER</span>';
  function a(inner){ h += '<div class="cb-a">'+who+inner+'</div>'; }
  function u(text){ h += '<div class="cb-u">'+esc(text)+'</div>'; }
  if(W.firstVisit) h += '<div class="cb-intro">'+t("w.c.intro")+'</div>';
  if(W.measuring){ a('<p>'+t("w.c.measuring")+'</p>'); }
  else {
    if(W.returned && W.cur<0) a('<p>'+t("w.c.welcomeBack",{d:tasksDone()})+'</p>');
    else if(W.cur<0 && !W.discussion) a('<p>'+t("w.c.found2",{n:3})+'</p>');
    h += wsTaskCard();
    if(W.discussion && W.cur<0){ u(t("w.c.discU")); a('<p>'+t("w.c.discA")+'</p>'); }
    if(W.cur>=0){
      var T = TASKS[W.cur], k = curTask(), n = W.cur+1;
      h += '<div class="cb-div">'+t("t"+n+".title")+'</div>';
      if(k.st==="todo"||k.st==="open"){
        a('<p>'+t("t"+n+".why")+'</p><div class="cc"><div class="cc-h">'+t("t"+n+".title")+'</div><div class="cc-b"><div><span class="ws-lab">'+t("w.c.orig")+'</span><div class="cc-cur">'+T.cur+'</div></div>'+
          '<div class="ws-add-block"><span class="ws-lab" style="color:var(--accent-ink)">'+t("w.c.new")+'</span>'+(T.addQ?'<b>'+T.addQ+'</b>':'')+T.addA+'</div></div>'+
          '<div class="cc-f"><button class="btn btn-primary" data-act="ws-adopt">'+t("w.c.use")+'</button><button class="btn btn-quiet" data-act="ws-decline">'+t("w.c.notnow")+'</button><small>'+t("w.c.hint")+'</small></div></div>');
      } else if(k.st==="declined"){
        u(t("w.c.notnowU")); a('<p>'+t("w.c.declined2")+'</p>');
      } else {
        u(t("w.c.useU")); a('<p>'+t("w.c.savedMsg")+'</p>');
        if(!k.live){
          h += '<div class="cc"><div class="cc-h">'+t("w.c.addH")+'</div><div class="cc-b"><span class="muted small">'+t("w.c.addLead2",{p:t("t"+n+".page")})+'</span><ol class="todo">'+
            '<li><span class="n'+(k.copied?' ok':'')+'">'+(k.copied?I.check:'1')+'</span><span>'+t("w.c.s1b")+'</span><button class="btn btn-line" style="height:30px" data-act="ws-copy">'+t(k.copied?"w.c.copied":"w.c.copy")+'</button></li>'+
            '<li><span class="n">2</span><span>'+t("w.c.s2b",{p:t("t"+n+".page")})+'</span><button class="btn btn-line" style="height:30px" data-act="ws-open-page">'+t("w.c.open")+'</button></li>'+
            '<li><span class="n">3</span><span>'+t("w.c.s3")+'</span><button class="btn btn-primary" style="height:30px" data-act="ws-live">'+t("w.c.live")+'</button></li></ol></div></div>';
        } else {
          u(t("w.c.liveU"));
          var nx = nextUndone(W.cur);
          var body = '<p>'+t(nx>=0?"w.c.liveMore":"w.c.liveAll")+'</p>';
          if(!W.auto.on && !W.checked) body += '<div class="chips-row"><button class="btn btn-primary" style="height:32px" data-act="ws-auto-freq" data-f="3d" data-chat="1">'+t("w.c.auto3d")+'</button><button class="btn btn-line" style="height:32px" data-act="ws-auto-freq" data-f="weekly" data-chat="1">'+freqLabel("weekly")+'</button><button class="btn btn-line" style="height:32px" data-act="ws-auto-freq" data-f="daily" data-chat="1">'+freqLabel("daily")+'</button></div>';
          if(!W.checking && !W.checked) body += '<button class="link small" data-act="ws-check">'+t("w.c.checkAnyway")+'</button>';
          a(body);
        }
      }
      if((k.st==="declined" || (k.st==="adopted" && k.live))){ var nx2 = nextUndone(W.cur); if(nx2>=0) a('<button class="btn btn-line" data-act="ws-task" data-i="'+nx2+'">'+t("w.c.nextTask",{n:nx2+1, x:t("t"+(nx2+1)+".title")})+' →</button>'); }
    }
  }
  if(W.autoMsg && W.auto.on) a('<p>'+t("w.c.autoOn",{f:freqLabel(W.auto.freq)})+'</p>');
  if(W.checking) a('<p>'+t("w.c.checking",{n:W.asked})+'</p><div class="bar" style="width:100%"><i style="width:'+(W.asked*10)+'%"></i></div>');
  if(W.checked){ a('<p>'+t("w.c.result")+'</p><div class="cmp" style="width:100%"><div><small>'+t("d16")+'</small><b>'+t("r.beforev")+'</b></div><span class="arr">'+I.arrow+'</span><div class="after"><small>'+t(W.last)+'</small><b>'+t("r.afterv")+'</b></div></div><p class="muted small">'+t("w.c.resultNote")+'</p>'); }
  W.extra.forEach(function(m){ if(m.u) u(m.u); else a('<p>'+t(m.k)+'</p>'); });
  return h;
}
function wsChat(){
  var W = S.ws, ctx = W.cur>=0 ? t("t"+(W.cur+1)+".title") : S.undBrand;
  var ph = W.cur>=0 ? "w.c.phMore" : "w.c.phStart";
  return '<div class="ws-chat-h"><b>'+t("w.c.title")+'</b><small>'+t("w.c.current",{x:esc(ctx)})+'</small></div>'+
    '<div class="ws-chat-b" id="ws-chat-b">'+wsChatBody()+'</div>'+
    '<div class="ws-chat-f"><form id="ws-form"><label for="ws-input" class="sr">'+t(ph)+'</label><textarea id="ws-input" rows="2" placeholder="'+esc(t(ph))+'"></textarea><div class="row"><button class="btn btn-line" type="submit">'+t(W.cur>=0?"w.c.send":"w.c.chat")+'</button></div></form></div>';
}

/* ---------- first-visit tour: project → dashboard → assistant */
var TOUR = [["#tour-project","tour.1"],["#ws-main .ws-in","tour.2"],["#ws-chat","tour.3"]];
function renderTour(){
  var el = $("tour"), W = S.ws;
  if(!W || W.tour<0 || S.view!=="ws"){ el.hidden = true; return; }
  var step = TOUR[W.tour], target = document.querySelector(step[0]); if(!target){ el.hidden = true; return; }
  el.hidden = false;
  var r = target.getBoundingClientRect(), pad = 8, vw = window.innerWidth, vh = window.innerHeight;
  var hole = {x:Math.max(4,r.left-pad), y:Math.max(4,r.top-pad), w:Math.min(vw-8,r.width+pad*2), h:Math.min(vh-8, r.height+pad*2)};
  if(W.tour===1) hole.h = Math.min(hole.h, 430);
  var cw = 320, cx, cy;
  if(W.tour===0){ cx = hole.x+hole.w+16; cy = hole.y; }
  else if(W.tour===1){ cx = hole.x+hole.w/2-cw/2; cy = hole.y+hole.h+14; }
  else { cx = hole.x-cw-16; cy = hole.y+80; }
  cx = Math.max(12, Math.min(vw-cw-12, cx)); cy = Math.max(12, Math.min(vh-240, cy));
  var last = W.tour===TOUR.length-1;
  el.innerHTML = '<div class="tour-hole" style="left:'+hole.x+'px;top:'+hole.y+'px;width:'+hole.w+'px;height:'+hole.h+'px"></div>'+
    '<div class="tour-card" role="dialog" aria-labelledby="tour-t" style="left:'+cx+'px;top:'+cy+'px;width:'+cw+'px"><small class="mono">'+(W.tour+1)+' / 3</small><b id="tour-t">'+t(step[1]+".t")+'</b><p>'+t(step[1]+".d")+'</p>'+
    '<div class="tour-a"><button class="btn btn-quiet" data-act="tour-skip">'+t("tour.skip")+'</button><button class="btn btn-primary" data-act="tour-next">'+t(last?"tour.done":"tour.next")+'</button></div></div>';
}
window.addEventListener("resize", function(){ if(S.ws && S.ws.tour>=0) renderTour(); });

function renderWS(){
  if(S.view!=="ws" || !S.ws) return;
  var main = S.ws.page==="overview" ? wsOverview() : (S.ws.page==="topic" ? wsTopic() : wsReview());
  $("ws-side").innerHTML = wsSide();
  $("ws-main").innerHTML = '<div class="ws-in">'+main+'</div>';
  var draft = $("ws-input") ? $("ws-input").value : "";
  $("ws-chat").innerHTML = wsChat();
  if(draft) $("ws-input").value = draft;
  var cb = $("ws-chat-b"); if(cb) cb.scrollTop = cb.scrollHeight;
  renderTour();
}
async function enterWS(mode){
  runId++; var id = runId;
  S.ws = wsFresh(); S.ws.firstVisit = true; S.ws.tour = 0;
  if(mode==="measuring"){ S.ws.measuring = true; S.ws.asked = 0; }
  show("ws"); renderWS();
  if(mode!=="measuring") return;
  try{ for(var n=1;n<=10;n++){ await sleep(450); check(id); S.ws.asked = n; renderWS(); }
    S.ws.measuring = false; S.metrics = {m:6,c:2}; renderWS(); toast(t("w.toast.done")); }catch(e){ if(e!=="cancel") throw e; }
}
function finishOnboarding(mode){
  if(S.user){ enterWS(mode); return; }
  S.pending = "ws:"+mode; openAuth("workspace");
}
async function wsCheck(){
  var W = S.ws, id = runId; if(W.checking) return;
  W.checking = true; W.asked = 0; renderWS();
  try{ for(var n=1;n<=10;n++){ await sleep(260); check(id); W.asked = n; renderWS(); }
    W.checking = false; W.last = "d18";
    if(W.tasks[0].live){ W.checked = true; } else { W.same = true; W.extra.push({k:"w.c.nochange"}); }
    renderWS(); toast(t("w.toast.checked")); }catch(e){ if(e!=="cancel") throw e; }
}
function wsJump(k){
  if(!S.user) S.user = {email:"owner@northstar-notes.example"};
  runId++; S.ws = wsFresh(); var W = S.ws, T0 = W.tasks[0];
  if(k==="tour"){ W.firstVisit = true; W.tour = 0; }
  if(k==="c06"){ T0.st="open"; W.cur=0; W.page="topic"; }
  if(k==="c06b"){ T0.st="adopted"; W.cur=0; W.page="topic"; }
  if(k==="c06c"){ T0.st="declined"; W.cur=0; W.page="topic"; }
  if(k==="c06d"){ W.discussion=true; W.page="topic"; }
  if(k==="c07"){ T0.st="open"; W.cur=0; W.page="review"; }
  if(k==="c07b"){ T0.st="adopted"; W.cur=0; W.page="review"; }
  if(k==="c08"){ T0.st="adopted"; W.returned=true; }
  if(k==="c08b"){ T0.st="adopted"; T0.live=true; T0.copied=true; W.cur=0; W.page="topic"; }
  if(k==="c09"){ T0.st="adopted"; T0.live=true; T0.copied=true; W.tasks[1].st="declined"; W.checked=true; W.last="d18"; W.auto.on=true; }
  show("ws"); renderWS();
}

