/* ------------------------------------------------------------------ workspace: conversation + dashboard */
var WS_CUR = "Northstar Notes helps teams record meetings and organize notes.";
var WS_Q = "How do I turn meeting notes into action items?";
var WS_A = "After each meeting, list every to-do and check its owner and due date, so the team can keep following up.";
var WS_QUOTE = "“When choosing a tool, look at whether it can pick out owners, deadlines and follow-ups from your meeting notes.”";
function wsFresh(){ return {page:"overview", stage:"none", returned:false, measuring:false, asked:10, discussion:false,
  open:{details:false, ans:false, hist:false, draft:false, earlier:false}, extra:[]}; }
function hasTopic(){ return S.ws.stage!=="none" || S.ws.discussion; }
function wsDraftName(){ return S.ws.stage==="declined" ? t("w.res.orig") : t("w.res.faq"); }
function wsDraftStatus(){ return {pending:t("w.st.pending"), adopted:t("w.st.adopted"), declined:t("w.st.declined")}[S.ws.stage]||""; }
function tog(key, label){ return '<button class="ws-toggle'+(S.ws.open[key]?' open':'')+'" data-act="ws-open" data-k="'+key+'" aria-expanded="'+S.ws.open[key]+'">'+label+'</button>'; }
function linkBtn(label, a, extra){ return '<button class="link" data-act="'+a+'"'+(extra||'')+'>'+label+'</button>'; }

function wsSide(){
  var W = S.ws, h = '';
  h += '<div class="logo">'+LOGO_IMG+'opcmaster</div>';
  h += '<button class="site-switch" type="button" data-act="ws-soon"><span class="site-fav">N</span><span><b>'+esc(S.undBrand)+'</b><small>'+esc(S.domain)+'</small></span></button>';
  h += '<div class="ws-group"><button class="ws-item'+(W.page==="overview"?' on':'')+'" data-act="ws-go" data-p="overview">'+t("w.nav.overview")+'</button></div>';
  h += '<div class="ws-group"><div class="ws-gh">'+t("w.nav.topics")+'</div>';
  if(hasTopic()) h += '<button class="ws-item'+(W.page!=="overview"?' on':'')+'" data-act="ws-go" data-p="topic">'+t(W.discussion&&W.stage==="none"?"w.topic.site":"w.topic.name")+'</button>';
  else h += '<div class="ws-empty">'+t("w.nav.notopics")+'</div>';
  h += '<button class="ws-add" data-act="ws-discuss">+ '+t("w.nav.startsite")+'</button></div>';
  h += '<div class="ws-group"><div class="ws-gh">'+t("w.nav.results")+'</div>';
  if(W.stage!=="none"){ var dot = W.stage==="pending"?"hot":(W.stage==="adopted"?"ok":"");
    h += '<button class="ws-item'+(W.page==="review"?' on':'')+'" data-act="ws-go" data-p="review">'+wsDraftName()+'<small><i class="'+dot+'"></i>'+wsDraftStatus()+'</small></button>'; }
  else h += '<div class="ws-empty">'+t("w.nav.noresults")+'</div>';
  h += '</div>';
  h += '<div class="ws-group"><div class="ws-gh">'+t("w.nav.more")+'</div>';
  ["w.more.briefs","w.more.rank","w.more.audit","w.more.cms"].forEach(function(k){ h += '<button class="ws-item row" data-act="ws-soon"><span>'+t(k)+'</span><span class="soon">'+t("w.soon")+'</span></button>'; });
  h += '</div>';
  h += '<div class="ws-foot"><button data-act="ws-soon">'+t("w.nav.scope")+'</button><button data-act="lang">'+t("lang.name")+'</button>';
  if(S.user) h += '<button data-act="ws-soon"><span class="av-s">'+esc(S.user.email.charAt(0).toUpperCase())+'</span><span>'+esc(S.user.email)+'</span></button>';
  h += '<button data-act="home">'+t("side.back")+'</button></div>';
  return h;
}

function wsOverview(){
  var W = S.ws, h = '<div class="ws-crumb">'+t("w.nav.overview")+'</div><h1 class="ws-h1">'+t("w.ov.h1")+'</h1>';
  h += '<p class="ws-sub">'+t("d16full")+(W.returned?' · '+t("w.ov.lastfull"):'')+'</p>';
  h += '<div class="ws-tiles">';
  [["w.m.mentioned",6,false],["w.m.cited",2,!W.returned]].forEach(function(m){
    h += '<div class="ws-tile'+(m[2]&&!W.measuring?' focus':'')+'"><label>'+t(m[0])+'</label>'+(W.measuring?'<div class="skel"></div>':'<div class="num">'+m[1]+'<span> / 10</span></div>')+'</div>'; });
  h += '</div>';
  if(W.measuring) h += '<p class="ws-sub">'+t("w.ov.measuring",{n:W.asked})+'</p>';
  else {
    h += tog("details", t("w.ov.details"));
    if(W.open.details) h += '<div class="ws-box"><p>'+t("w.ov.pos")+' <b class="mono">#3 / 8</b></p><p class="muted">'+t("w.ov.meta")+'</p><p class="muted">'+t("w.ov.sample")+'</p><p class="muted small">'+t("w.ov.scopeNote")+'</p></div>';
  }
  h += '<hr class="ws-hr">';
  h += '<div class="ws-sec"><h3>'+t("w.ov.latest")+'</h3><p>'+t(W.measuring?"w.ov.latest.run":(W.returned?"w.ov.latest.none":"w.ov.latest.done"))+'</p></div>';
  h += '<div class="ws-sec"><h3>'+t("w.ov.recent")+'</h3>';
  if(!hasTopic()) h += '<p class="muted">'+t("w.ov.norecent")+'</p></div>';
  else {
    var st = W.stage==="none" ? t("w.st.discussion") : (W.stage==="pending"?t("w.st.pendingSite"):wsDraftStatus());
    var see = {pending:"w.see.change", adopted:"w.see.draft", declined:"w.see.orig"}[W.stage];
    h += '</div><div class="ws-recent"><div class="t"><small>'+t("w.ov.recent")+'</small><b>'+t(W.stage==="none"?"w.topic.site":"w.topic.name")+'</b><small>'+st+'</small></div>'+
      '<button class="btn btn-primary" data-act="ws-go" data-p="topic">'+t("w.cont")+' →</button>'+(see?'<button class="btn btn-quiet" data-act="ws-go" data-p="review">'+t(see)+'</button>':'')+'</div>';
  }
  h += '<div class="ws-sec"><h3>'+t("w.ov.more")+'</h3></div><div class="ws-soonrow">'+
    ["w.more.rank","w.more.audit","w.more.briefs"].map(function(k){ return '<div><b>'+t(k)+'</b><span class="soon">'+t("w.soon")+'</span></div>'; }).join("")+'</div>';
  return h;
}

function wsTopic(){
  var W = S.ws, disc = W.discussion && W.stage==="none";
  var h = '<div class="ws-crumb">'+t("w.nav.topics")+' / '+t(disc?"w.topic.site":"w.topic.name")+'</div><h1 class="ws-h1">'+t(disc?"w.topic.siteH":"w.topic.page")+'</h1>';
  if(disc){ h += '<p class="ws-sub">'+t("w.topic.siteSub")+'</p><div class="ws-box"><span class="ws-lab">'+t("w.topic.home")+'</span><p>'+WS_CUR+'</p></div>'; return h; }
  h += '<div class="ws-url">northstar-notes.example/meetings</div>';
  h += '<div class="ws-box"><span class="ws-lab">'+t(W.stage==="pending"?"w.topic.orig":"w.topic.record")+'</span><p>'+WS_CUR+'</p></div>';
  h += tog("ans", t("w.topic.ans"));
  if(W.open.ans) h += '<div class="ws-box"><span class="ws-lab">'+t("w.topic.ansLab")+'</span><p><b>'+WS_Q+'</b></p><p class="ws-quote">'+WS_QUOTE+'</p><p><span class="pill">'+t("w.topic.notm")+'</span></p><p class="muted small">'+t("w.topic.ansMeta")+'</p><p class="muted small">'+t("w.topic.ansNote")+'</p></div>';
  var lk = {pending:"w.topic.openChange", adopted:"w.topic.openDraft", declined:"w.topic.openOrig"}[W.stage];
  if(lk) h += '<div>'+linkBtn(t(lk)+' ↗',"ws-go",' data-p="review"')+'</div>';
  h += '<p class="ws-sub">'+t("w.topic.ctx")+'</p>';
  return h;
}

function wsReview(){
  var W = S.ws, h = '<div class="ws-crumb">'+t("w.topic.name")+' / '+t("w.rv.crumb")+'</div><h1 class="ws-h1">'+wsDraftName()+'</h1>';
  h += '<div class="ws-status">'+linkBtn('← '+t("w.rv.back"),"ws-go",' data-p="topic"')+'<span class="pill">'+t(W.stage==="declined"?"w.rv.unchanged":"w.rv.notpub")+'</span></div>';
  if(W.stage==="pending"){
    h += '<div class="ws-box"><span class="ws-lab">'+t("w.rv.saved")+'</span><p>'+WS_CUR+'</p></div>';
    h += '<div class="ws-box"><span class="ws-lab">'+t("w.rv.keepAdd")+'</span><p class="muted">'+WS_CUR+'</p><div class="ws-add-block" style="margin-top:10px"><b>'+WS_Q+'</b>'+WS_A+'</div></div>';
  } else if(W.stage==="adopted"){
    h += '<div class="ws-box"><span class="ws-lab">'+t("w.rv.draft")+'</span><p>'+WS_CUR+'</p><div class="ws-add-block" style="margin-top:10px"><b>'+WS_Q+'</b>'+WS_A+'</div></div>';
  } else {
    h += '<div class="ws-box"><span class="ws-lab">'+t("w.rv.kept")+'</span><p>'+WS_CUR+'</p><p class="muted small">'+t("w.rv.notChanged")+'</p></div>';
  }
  h += tog("hist", t("w.rv.hist"));
  if(W.open.hist) h += '<div class="ws-box"><span class="ws-lab">'+t("w.rv.src")+' · northstar-notes.example/meetings</span><p>'+WS_CUR+'</p><p class="muted small">'+t("w.rv.srcNote")+'</p><p class="mono small">'+t({pending:"w.rv.v.pending",adopted:"w.rv.v.adopted",declined:"w.rv.v.declined"}[W.stage])+'</p></div>';
  h += '<div class="ws-callout"><div><b>'+t("w.rv.publishH")+'</b><p>'+t("w.rv.publishP")+'</p></div><span class="soon">'+t("w.rv.publishSoon")+'</span></div>';
  return h;
}

function wsChatBody(){
  var W = S.ws, h = '', who = '<span class="who">OPCMASTER</span>';
  function a(inner){ h += '<div class="cb-a">'+who+inner+'</div>'; }
  function u(text){ h += '<div class="cb-u">'+esc(text)+'</div>'; }
  if(W.discussion && W.stage==="none"){ u(t("w.c.discU")); a('<p>'+t("w.c.discA")+'</p>'); }
  else if(W.stage==="none"){
    if(W.measuring) a('<p>'+t("w.c.measuring")+'</p>');
    else a('<p>'+t("w.c.suggest")+'</p><button class="btn btn-primary" data-act="ws-see">'+t("w.c.see")+' →</button>');
  }
  else if(W.stage==="pending"){
    a('<div class="cc"><div class="cc-h">'+t("w.c.ccH")+'</div><div class="cc-b"><div><span class="ws-lab">'+t("w.c.orig")+'</span><div class="cc-cur">'+WS_CUR+'</div></div>'+
      '<div class="ws-add-block"><span class="ws-lab" style="color:var(--accent-ink)">'+t("w.c.new")+'</span><b>'+WS_Q+'</b>'+WS_A+'</div></div>'+
      '<div class="cc-f"><button class="btn btn-primary" data-act="ws-adopt">'+t("w.c.use")+'</button><button class="btn btn-quiet" data-act="ws-decline">'+t("w.c.notnow")+'</button><small>'+t("w.c.hint")+'</small></div></div>');
  }
  else if(W.returned && W.page==="overview"){ a('<p>'+t(W.stage==="adopted"?"w.c.savedMsg":(W.stage==="declined"?"w.c.declinedMsg":"w.c.pendingLeft"))+'</p>'); }
  else {
    var ad = W.stage==="adopted";
    u(t(ad?"w.c.useU":"w.c.notnowU"));
    a('<p>'+t(ad?"w.c.savedMsg":"w.c.declinedMsg")+'</p>');
    h += '<div class="cb-fold">'+tog("draft", t(ad?"w.c.seeDraft":"w.c.seeOrig"))+(W.open.draft?'<div class="ws-box"><p>'+WS_CUR+'</p>'+(ad?'<div class="ws-add-block" style="margin-top:8px"><b>'+WS_Q+'</b>'+WS_A+'</div>':'')+'</div>':'')+'</div>';
    h += '<div class="cb-fold">'+tog("earlier", t("w.c.earlier"))+(W.open.earlier?'<div class="ws-box"><span class="ws-lab">OPCMASTER · '+t("w.c.firstOrig")+'</span><p>'+WS_CUR+'</p><p>'+t("w.c.suggest")+'</p><p class="muted small">'+t("w.c.prepared")+' '+WS_Q+'</p></div>':'')+'</div>';
  }
  W.extra.forEach(function(m){ if(m.u) u(m.u); else a('<p>'+t(m.k)+'</p>'); });
  return h;
}
function wsChat(){
  var W = S.ws, ctx = hasTopic() && (W.page!=="overview" || W.returned) ? t(W.stage==="none"?"w.topic.site":"w.topic.name") : S.undBrand;
  var ph = W.returned&&W.page==="overview" ? "w.c.phReturn" : (W.stage==="none"&&!W.discussion ? "w.c.phStart" : "w.c.phMore");
  var btn = W.returned&&W.page==="overview" ? t("w.cont")+" →" : (W.stage==="none"&&!W.discussion ? t("w.c.chat") : t("w.c.send"));
  return '<div class="ws-chat-h"><b>'+t("w.c.title")+'</b><small>'+t("w.c.current",{x:esc(ctx)})+'</small></div>'+
    '<div class="ws-chat-b" id="ws-chat-b">'+wsChatBody()+'</div>'+
    '<div class="ws-chat-f"><form id="ws-form"><label for="ws-input" class="sr">'+t(ph)+'</label><textarea id="ws-input" rows="2" placeholder="'+esc(t(ph))+'"></textarea><div class="row"><button class="btn btn-line" type="submit">'+btn+'</button></div></form></div>';
}
function renderWS(){
  if(S.view!=="ws" || !S.ws) return;
  var main = S.ws.page==="overview" ? wsOverview() : (S.ws.page==="topic" ? wsTopic() : wsReview());
  $("ws-side").innerHTML = wsSide();
  $("ws-main").innerHTML = '<div class="ws-in">'+main+'</div>';
  var draft = $("ws-input") ? $("ws-input").value : "";
  $("ws-chat").innerHTML = wsChat();
  if(draft) $("ws-input").value = draft;
  var cb = $("ws-chat-b"); if(cb) cb.scrollTop = cb.scrollHeight;
}
async function enterWS(mode){
  runId++; var id = runId;
  S.ws = wsFresh(); if(mode==="measuring"){ S.ws.measuring = true; S.ws.asked = 0; }
  show("ws"); renderWS();
  if(mode!=="measuring") return;
  try{ for(var n=1;n<=10;n++){ await sleep(450); check(id); S.ws.asked = n; renderWS(); }
    S.ws.measuring = false; S.metrics = {m:6,c:2}; renderWS(); toast(t("w.toast.done")); }catch(e){ if(e!=="cancel") throw e; }
}
function finishOnboarding(mode){
  if(S.user){ enterWS(mode); return; }
  S.pending = "ws:"+mode; openAuth("workspace");
}
function wsJump(k){
  if(!S.user) S.user = {email:"owner@northstar-notes.example"};
  runId++; S.ws = wsFresh(); var W = S.ws;
  if(k==="c06"){ W.stage="pending"; W.page="topic"; }
  if(k==="c06b"){ W.stage="adopted"; W.page="topic"; }
  if(k==="c06c"){ W.stage="declined"; W.page="topic"; }
  if(k==="c06d"){ W.discussion=true; W.page="topic"; }
  if(k==="c07"){ W.stage="pending"; W.page="review"; }
  if(k==="c07b"){ W.stage="adopted"; W.page="review"; }
  if(k==="c08"){ W.stage="adopted"; W.returned=true; }
  show("ws"); renderWS();
}
