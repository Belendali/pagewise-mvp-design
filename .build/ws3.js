/* ------------------------------------------------------------------ workspace: one chat per page, repeat checks */
var PAGES = {
  flash:{name:"p.flash", url:"answerai.pro/features?name=flashcard-generator", kind:"feature", cur:"Say goodbye to the hassle of making flashcards. With Answer.AI, just snap a photo of your textbook, and instantly get a set of custom flashcards tailored to your study needs."},
  pricing:{name:"p.pricing", url:"answerai.pro/pricing", kind:"pricing", cur:"An exclusive free trial, just for you. Unlimited chat time with AI · Ad-free experience · Unlimited question scanner · AI-generated flashcards"},
  faq:{name:"p.faq", url:"answerai.pro/#faq", kind:"faq", cur:"What is Answer.AI and how does it work? · What subjects does Answer.AI support? · Is Answer.AI free? · How can I get started with Answer.AI?"},
  home:{name:"p.home", url:"answerai.pro", kind:"hero", cur:"Ask anything, learn everything"}
};
var SUGG = {
  flash1:{page:"flash", check:1, t:"s.flash1.t", why:"s.flash1.why", addQ:"How do I turn my textbook into flashcards with AI?", addA:"Open Answer.AI, tap Flashcards and take a photo of the textbook page. In seconds you get a set of cards with key terms and definitions that you can edit, quiz yourself on, or share with your study group.", q:"How to make flashcards from a textbook with AI", quote:"“Quizlet and Knowt can turn your notes into flashcards, and Anki is a good free option if you make the cards yourself.”"},
  pricing1:{page:"pricing", check:1, t:"s.pricing1.t", why:"s.pricing1.why", addQ:"Is Answer.AI free?", addA:"Yes. You can start free and earn daily check-in rewards, then try Premium free before choosing a plan. Premium adds unlimited chat, the question scanner and AI flashcards.", q:"Free AI homework help app", quote:"“Free options include Socratic by Google and Brainly's free plan; Photomath is free for basic math help.”"},
  faq1:{page:"faq", check:1, t:"s.faq1.t", why:"s.faq1.why", addQ:"Is using Answer.AI for homework cheating?", addA:"Answer.AI explains every step instead of only giving the final answer, so you learn how to solve the problem yourself. Many students use it to check their work and prepare for tests.", q:"Is using AI for homework cheating?", quote:"“It depends on how you use it. Tools like Khanmigo are designed to guide you through a problem rather than hand you the answer.”"},
  pricing2:{page:"pricing", check:2, t:"s.pricing2.t", why:"s.pricing2.why", addQ:"How is Answer.AI different from Chegg or Photomath?", addA:"One plan covers every subject, not just math, and adds AI flashcards, AP prep and a college counselor. You can try it free before paying.", q:"Answer.AI vs Chegg", quote:"“Chegg Study is a popular paid option with a large solutions library, while Photomath focuses on math.”"},
  home2:{page:"home", check:2, t:"s.home2.t", why:"s.home2.why", addQ:"", addA:"Snap a photo of any math problem and Answer.AI walks you through the solution step by step, from algebra to calculus, 24/7.", q:"App that solves math problems from a photo", quote:"“Photomath and Gauth let you take a photo of a math problem and see a step-by-step solution.”"}
};
var SITE_T = {why:"site.why.t", more:"site.more.t", "new":"site.new.t", disc:"site.disc.t"};
var LOGO_IMG = LOGO_IMG || "";
function wsFresh(){ return {page:"overview", conv:null, sid:null, returned:false, measuring:false, asked:10, firstVisit:false, tour:-1,
  convs:[], meta:{}, sugg:{}, checkNo:1, check2Date:"d25full", open:{}, checking:false, auto:{on:false, freq:"3d"}, autoMsg:false, siteN:0}; }
var FREQ_NEXT = {daily:"d19", "3d":"d21", weekly:"d25"};
function freqLabel(f){ return t("w.freq."+f); }
function addPageConv(id, at){ var W = S.ws; if(!W.meta[id]){ W.convs.push(id); W.meta[id] = {kind:"page", page:id, created:at||1, unread:false, extra:[], asked:{}}; } return W.meta[id]; }
function addSugg(sid, st){ S.ws.sugg[sid] = {st:st||"todo", copied:false, live:false}; }
function applyCheck1(){ ["flash","pricing","faq"].forEach(function(p){ addPageConv(p,1); }); ["flash1","pricing1","faq1"].forEach(function(s){ addSugg(s); }); }
function applyCheck2(date){
  var W = S.ws; W.checkNo = 2; W.check2Date = date||"d25full";
  addSugg("pricing2"); W.meta.pricing.unread = true;
  addPageConv("home",2); addSugg("home2"); W.meta.home.unread = true;
  W.meta.flash.unread = true;
}
function addSiteConv(kind, title){ var W = S.ws; W.siteN++; var id = "site"+W.siteN; W.convs.push(id); W.meta[id] = {kind:"site", topic:kind, title:title, unread:false, extra:[], asked:{}, created:W.checkNo}; return id; }
function convSuggs(id){ var m = S.ws.meta[id]; if(!m || m.kind!=="page") return []; return Object.keys(S.ws.sugg).filter(function(s){ return SUGG[s].page===m.page; }); }
function suggStatus(sid){ var g = S.ws.sugg[sid]; if(!g) return ""; if(g.st==="adopted"){ if(g.live && sid==="flash1" && S.ws.checkNo>=2) return "cited"; return g.live?"live":"adopted"; } return g.st; }
function latestSugg(id){ var list = convSuggs(id); return list.length ? list[list.length-1] : null; }
function convStatus(id){ var m = S.ws.meta[id]; if(!m) return ""; if(m.kind==="site") return t("cst.site"); if(m.unread) return t("cst.new");
  var s = latestSugg(id); return s ? t("cst."+suggStatus(s)) : t("cst.talk"); }
function convDot(id){ var m = S.ws.meta[id]; if(m.unread) return "hot"; var s = latestSugg(id); if(!s) return ""; var st = suggStatus(s); return {todo:"hot",open:"hot",adopted:"hot",live:"ok",cited:"ok",declined:""}[st]; }
function convName(id){ var m = S.ws.meta[id]; if(!m) return S.undBrand; return m.kind==="page" ? t(PAGES[m.page].name) : (m.title || t(SITE_T[m.topic]||"site.new.t")); }
function doneCount(){ var n=0; Object.keys(S.ws.sugg).forEach(function(s){ var st = suggStatus(s); if(st==="live"||st==="cited"||st==="declined") n++; }); return n; }
function curSugg(){ var W = S.ws; if(W.sid && W.sugg[W.sid]) return W.sid; return W.conv ? latestSugg(W.conv) : null; }
function tog(key, label){ var o = !!S.ws.open[key]; return '<button class="ws-toggle'+(o?' open':'')+'" data-act="ws-open" data-k="'+key+'" aria-expanded="'+o+'">'+label+'</button>'; }
function linkBtn(label, a, extra){ return '<button class="link" data-act="'+a+'"'+(extra||'')+'>'+label+'</button>'; }
function addBlock(G){ return '<div class="ws-add-block">'+(G.addQ?'<b>'+G.addQ+'</b>':'')+G.addA+'</div>'; }
function lastDate(){ return S.ws.checkNo>=2 ? S.ws.check2Date : "d16full"; }

function wsControls(){
  var W = S.ws;
  var h = '<div class="ws-ctl"><div class="ws-ctl-row"><div class="l"><b>'+t("w.ctl.h")+'</b><small>'+t("w.ctl.manual2",{n:W.checkNo, d:t(lastDate())})+'</small></div>';
  h += W.checking ? '<span class="pill">'+t("w.ctl.running",{n:W.asked})+'</span>' : '<button class="btn btn-line" data-act="ws-check"'+(W.measuring?' disabled':'')+'>'+t("w.ctl.now")+'</button>';
  h += '</div><div class="ws-ctl-row ws-auto"><button class="sw'+(W.auto.on?' on':'')+'" role="switch" aria-checked="'+W.auto.on+'" data-act="ws-auto-toggle" aria-label="'+t("w.auto.label")+'"><i></i></button><span>'+t("w.auto.label")+'</span>';
  if(W.auto.on){ h += '<div class="seg" role="radiogroup">'+["daily","3d","weekly"].map(function(f){ return '<button class="'+(W.auto.freq===f?'on':'')+'" data-act="ws-auto-freq" data-f="'+f+'" role="radio" aria-checked="'+(W.auto.freq===f)+'">'+freqLabel(f)+'</button>'; }).join("")+'</div><small class="muted">'+t("w.auto.next",{d:t(FREQ_NEXT[W.auto.freq])})+'</small>'; }
  return h+'</div></div>';
}

function wsSide(){
  var W = S.ws, h = '';
  h += '<div class="logo">'+LOGO_IMG+'opcmaster</div>';
  h += '<button class="site-switch" id="tour-project" type="button" data-act="ws-soon"><span class="site-fav">A</span><span><b>'+esc(S.undBrand)+'</b><small>'+esc(S.domain)+'</small></span></button>';
  h += '<div class="ws-group"><button class="ws-item'+(W.page==="overview"&&!W.conv?' on':'')+'" data-act="ws-home">'+t("w.nav.overview")+'</button></div>';
  h += '<div class="ws-group"><div class="ws-gh">'+t("w.nav.convs")+'<button class="gh-add" data-act="ws-newchat" aria-label="'+t("w.nav.new")+'" title="'+t("w.nav.new")+'">+</button></div>';
  if(W.measuring) h += '<div class="ws-empty">'+t("w.nav.notopics")+'</div>';
  W.convs.forEach(function(id){ var m = W.meta[id];
    h += '<button class="ws-item'+(W.conv===id?' on':'')+(m.kind==="site"?' site':'')+'" data-act="ws-conv" data-c="'+id+'"><span class="ci-t">'+(m.kind==="site"?'<i class="hash">#</i>':'')+esc(convName(id))+(m.unread?'<i class="nd"></i>':'')+'</span><small><i class="'+convDot(id)+'"></i>'+convStatus(id)+'</small></button>'; });
  h += '</div>';
  h += '<div class="ws-group"><div class="ws-gh">'+t("w.nav.more")+'</div>';
  ["w.more.briefs","w.more.rank","w.more.audit","w.more.cms"].forEach(function(k){ h += '<button class="ws-item row" data-act="ws-soon"><span>'+t(k)+'</span><span class="soon">'+t("w.soon")+'</span></button>'; });
  h += '</div><div class="ws-foot">';
  if(S.user) h += '<button data-act="ws-soon"><span class="av-s">'+esc(S.user.email.charAt(0).toUpperCase())+'</span><span>'+esc(S.user.email)+'</span></button>';
  return h+'</div>';
}

function wsOverview(){
  var W = S.ws, h = '<div class="ws-crumb">'+t("w.nav.overview")+' · <span class="soon">'+t("w.sample")+'</span></div><h1 class="ws-h1">'+t("w.ov.h1")+'</h1>';
  h += wsControls();
  var busy = W.measuring || W.checking, up = W.checkNo>=2 && W.sugg.flash1 && W.sugg.flash1.live;
  h += '<div class="ws-tiles">';
  [["w.m.mentioned",up?7:6,false],["w.m.cited",up?3:2,true]].forEach(function(m){
    h += '<div class="ws-tile'+(m[2]&&!busy?' focus':'')+'"><label>'+t(m[0])+'</label>'+(busy?'<div class="skel"></div>':'<div class="num">'+m[1]+'<span> / 10</span></div>'+(up?'<span class="delta">'+t("w.ov.vs",{n:1})+'</span>':''))+'</div>'; });
  h += '</div>';
  if(W.measuring) h += '<p class="ws-sub">'+t("w.ov.measuring",{n:W.asked})+'</p>';
  else { h += tog("details", t("w.ov.details"));
    if(W.open.details) h += '<div class="ws-box"><p>'+t("w.ov.pos")+' <b class="mono">#3 / 8</b></p><p class="muted">'+t("w.ov.meta")+'</p><p class="muted">'+t("w.ov.sample")+'</p></div>'; }
  h += '<hr class="ws-hr"><div class="ws-sec"><h3>'+t("w.ov.pages")+(W.measuring?'':' · '+t("w.tasks.progress2",{d:doneCount(), n:Object.keys(W.sugg).length}))+'</h3>';
  if(W.checkNo>=2) h += '<p class="ws-sum">'+t("w.ov.sum2")+'</p>';
  if(W.measuring) h += '<p class="muted">'+t("w.ov.nofixes")+'</p></div>';
  else { h += '</div><div class="ws-tasklist">'+W.convs.filter(function(id){ return W.meta[id].kind==="page"; }).map(function(id){
      var s = latestSugg(id), st = s?suggStatus(s):"", done = st==="live"||st==="cited"||st==="declined", n = convSuggs(id).length;
      return '<div class="ws-trow'+(PLAN!=="A"&&W.conv===id?' cur':'')+'"><span class="tn'+(done?' done':'')+'">'+(st==="live"||st==="cited"?I.check:'')+'</span><div class="t"><b>'+t(PAGES[id].name)+(n>1?' <span class="mono small muted">· '+t("w.ov.nsugg",{n:n})+'</span>':'')+'</b><small>'+(s?t(SUGG[s].t):'')+'</small></div>'+(W.meta[id].unread?'<span class="pill accent">'+t("cst.new")+'</span>':'<span class="pill">'+(PLAN!=="A"&&W.conv===id?t("w.b.working"):convStatus(id))+'</span>')+'<button class="btn btn-line" data-act="ws-conv" data-c="'+id+'">'+t("w.open")+'</button></div>'; }).join("")+'</div>'; }
  h += '<div class="ws-sec"><h3>'+t("w.ov.more")+'</h3></div><div class="ws-soonrow">'+["w.more.rank","w.more.audit","w.more.briefs"].map(function(k){ return '<div><b>'+t(k)+'</b><span class="soon">'+t("w.soon")+'</span></div>'; }).join("")+'</div>';
  return h;
}

function wsTopic(){
  var W = S.ws, m = W.meta[W.conv];
  if(!m || m.kind==="site"){ return '<div class="ws-crumb">'+t("w.nav.convs")+' / '+esc(convName(W.conv))+'</div><h1 class="ws-h1">'+t("w.topic.siteH")+'</h1><p class="ws-sub">'+t("w.topic.siteSub")+'</p><div class="ws-box"><span class="ws-lab">'+t("w.topic.home")+'</span><p>'+PAGES.home.cur+'</p></div><p class="ws-sub">'+t("w.topic.ctx")+'</p>'; }
  var P = PAGES[m.page], sid = curSugg(), h = '<div class="ws-crumb">'+t("w.nav.convs")+' / '+t(P.name)+'</div><h1 class="ws-h1">'+t(P.name)+'</h1><div class="ws-url">'+P.url+'</div>';
  if(!sid){ return h+'<div class="ws-box"><span class="ws-lab">'+t("w.topic.orig")+'</span><p>'+P.cur+'</p></div><p class="ws-sub">'+t("w.topic.ctx")+'</p>'; }
  var G = SUGG[sid], g = W.sugg[sid];
  h += '<p class="ws-sub">'+t(G.why)+'</p><div class="ws-box"><span class="ws-lab">'+t(g.st==="adopted"||g.st==="declined"?"w.topic.record":"w.topic.orig")+'</span><p>'+P.cur+'</p></div>';
  h += tog("ans:"+sid, t("w.topic.ans"));
  if(W.open["ans:"+sid]) h += '<div class="ws-box"><span class="ws-lab">'+t("w.topic.ansLab")+'</span><p><b>'+G.q+'</b></p><p class="ws-quote">'+G.quote+'</p><p><span class="pill">'+t("w.topic.notm")+'</span></p><p class="muted small">'+t("w.topic.ansNote")+'</p></div>';
  h += '<div>'+linkBtn(t({todo:"w.topic.openChange",open:"w.topic.openChange",adopted:"w.topic.openDraft",declined:"w.topic.openOrig"}[g.st])+' ↗',"ws-go",' data-p="review"')+'</div>';
  var list = convSuggs(W.conv);
  if(list.length>1) h += '<div class="ws-sec"><h3>'+t("w.topic.hist")+'</h3></div><div class="ws-tasklist">'+list.map(function(s){ return '<div class="ws-trow"><div class="t"><b>'+t(SUGG[s].t)+'</b><small>'+t("w.chk.div",{n:SUGG[s].check, d:t(SUGG[s].check===1?"d16full":W.check2Date)})+'</small></div><span class="pill">'+t("cst."+suggStatus(s))+'</span></div>'; }).join("")+'</div>';
  return h;
}

function wsReview(){
  var W = S.ws, sid = curSugg(); if(!sid) return wsTopic();
  var G = SUGG[sid], g = W.sugg[sid], P = PAGES[G.page];
  var h = '<div class="ws-crumb">'+t(P.name)+' / '+t("w.rv.crumb")+'</div><h1 class="ws-h1">'+t(G.t)+'</h1>';
  h += '<div class="ws-status">'+linkBtn('← '+t("w.rv.back"),"ws-go",' data-p="topic"')+'<span class="pill">'+t(g.st==="declined"?"w.rv.unchanged":(g.live?"cst.live":"w.rv.notpub"))+'</span></div>';
  if(g.st==="adopted") h += '<div class="ws-box"><span class="ws-lab">'+t("w.rv.draft")+'</span><p>'+P.cur+'</p><div style="margin-top:10px">'+addBlock(G)+'</div></div>';
  else if(g.st==="declined") h += '<div class="ws-box"><span class="ws-lab">'+t("w.rv.kept")+'</span><p>'+P.cur+'</p><p class="muted small">'+t("w.rv.notChanged")+'</p></div>';
  else h += '<div class="ws-box"><span class="ws-lab">'+t("w.rv.saved")+'</span><p>'+P.cur+'</p></div><div class="ws-box"><span class="ws-lab">'+t("w.rv.keepAdd2")+'</span><p class="muted">'+P.cur+'</p><div style="margin-top:10px">'+addBlock(G)+'</div></div>';
  h += tog("hist", t("w.rv.hist"));
  if(W.open.hist) h += '<div class="ws-box"><span class="ws-lab">'+t("w.rv.src")+' · '+P.url+'</span><p>'+P.cur+'</p><p class="muted small">'+t("w.rv.srcNote")+'</p><p class="mono small">'+t({open:"w.rv.v.pending",todo:"w.rv.v.pending",adopted:"w.rv.v.adopted",declined:"w.rv.v.declined"}[g.st])+'</p></div>';
  h += '<div class="ws-callout"><div><b>'+t("w.rv.publishH2")+'</b><p>'+t("w.rv.publishP2")+'</p></div><span class="soon">'+t("w.rv.publishSoon")+'</span></div>';
  return h;
}

var PLAN = "A"; try{ var sp = localStorage.getItem("opc-plan"); if(sp==="A"||sp==="B"||sp==="C") PLAN = sp; }catch(e){}
function insBlock(sid){
  var G = SUGG[sid], g = S.ws.sugg[sid], cls, tag;
  if(g.st==="declined") return '';
  if(g.st==="todo"||g.st==="open"){ cls = "ghost"; tag = "w.c3.here"; } else if(!g.live){ cls = "draft"; tag = "w.c3.draft"; } else { cls = "live"; tag = "w.c3.live"; }
  return '<div class="pv-ins '+cls+(sid===curSugg()?' focus':'')+'"><span class="pv-tag">'+t(tag)+'</span>'+(G.addQ?'<h4>'+G.addQ+'</h4>':'')+'<p>'+G.addA+'</p></div>';
}
function wsPagePreview(){
  var W = S.ws, m = W.meta[W.conv]; if(!m || m.kind!=="page") return wsTopic();
  var P = PAGES[m.page], ins = convSuggs(W.conv).map(insBlock).join(""), sid = curSugg();
  var body = '<div class="pv-nav"><b>Answer.AI</b><span class="'+(P.kind==="feature"?'on':'')+'">Features</span><span>Learn More</span><span class="'+(P.kind==="pricing"?'on':'')+'">Pricing</span><span>Blog</span><span class="pv-cta">Download</span></div>';
  if(P.kind==="hero") body += '<div class="pv-hero"><h3 class="pv-curh">'+P.cur+'</h3>'+ins+'<div class="pv-btns"><span></span><span></span></div><p class="pv-stat">6 million and counting use Answer.AI</p></div><div class="pv-ph w80"></div>';
  else if(P.kind==="faq") body += '<div class="pv-body"><h3>FAQ</h3><ul class="pv-faq">'+P.cur.split(" · ").map(function(x){ return '<li>'+x+'<span>+</span></li>'; }).join("")+'</ul>'+ins+'</div>';
  else if(P.kind==="pricing") body += '<div class="pv-body"><h3>Pricing</h3><div class="pv-trial"><b>An exclusive free trial, just for you.</b><i><s>$71.90</s> $0</i><ul>'+["Unlimited chat time with AI","Ad-free experience","Unlimited question scanner","AI-generated flashcards"].map(function(x){ return '<li>'+x+'</li>'; }).join("")+'</ul></div>'+ins+'</div>';
  else body += '<div class="pv-body"><h3>Create Personalized Flashcards in Seconds</h3><p class="pv-cur">'+P.cur+'</p>'+ins+'<ul>'+["Snap a photo of your textbook","Quiz yourself anytime","Share sets with your study group"].map(function(x){ return '<li>'+x+'</li>'; }).join("")+'</ul></div>';
  var h = '<div class="ws-status">'+linkBtn(t("w.c3.back"),"ws-home")+'</div><div class="ws-crumb">'+t("w.nav.convs")+' / '+t(P.name)+'</div><h1 class="ws-h1">'+t(P.name)+'</h1>'+(sid?'<p class="ws-sub">'+t(SUGG[sid].why)+'</p>':'');
  h += '<div class="pv"><div class="pv-bar"><i></i><i></i><i></i><span>'+P.url+'</span></div><div class="pv-page">'+body+'</div></div><p class="ws-sub small">'+t("w.c3.note")+'</p>';
  return h;
}
function openWsSheet(){ $("tabs").hidden = true; $("drawer-b").innerHTML = '<div class="ws-in">'+wsReview().replace(/<div class="ws-status">.*?<\/div>/,'')+'</div>'; $("drawer").classList.add("on"); $("drawer").setAttribute("aria-hidden","false"); $("scrim").classList.add("on"); }

/* ---------- chat panel */
var WHO = '<span class="who">OPCMASTER</span>';
function A(inner){ return '<div class="cb-a">'+WHO+inner+'</div>'; }
function U(text){ return '<div class="cb-u">'+esc(text)+'</div>'; }
function divider(n){ return '<div class="cb-div">'+t("w.chk.div",{n:n, d:t(n===1?"d16full":S.ws.check2Date)})+'</div>'; }
function suggBlock(sid){
  var W = S.ws, G = SUGG[sid], g = W.sugg[sid], P = PAGES[G.page], h = '';
  h += A('<p>'+t(G.why)+'</p><div class="cc"><div class="cc-h">'+t(P.name)+' · '+t(G.t)+'</div><div class="cc-b"><div><span class="ws-lab">'+t("w.c.orig")+'</span><div class="cc-cur">'+P.cur+'</div></div><div class="ws-add-block"><span class="ws-lab" style="color:var(--accent-ink)">'+t("w.c.new")+'</span>'+(G.addQ?'<b>'+G.addQ+'</b>':'')+G.addA+'</div></div>'+
    ((g.st==="todo"||g.st==="open")?'<div class="cc-f"><button class="btn btn-primary" data-act="ws-adopt" data-s="'+sid+'">'+t("w.c.use")+'</button><button class="btn btn-quiet" data-act="ws-decline" data-s="'+sid+'">'+t("w.c.notnow")+'</button><small>'+t("w.c.hint")+'</small></div>':'')+'</div>');
  if((g.st==="todo"||g.st==="open") && PLAN==="B") h += '<div class="cb-fold">'+tog("ans:"+sid, t("w.b.evidence"))+(W.open["ans:"+sid]?'<div class="ws-box"><span class="ws-lab">'+t("w.topic.ansLab")+'</span><p><b>'+G.q+'</b></p><p class="ws-quote" style="font-size:15px">'+G.quote+'</p></div>':'')+'</div><button class="link small" data-act="ws-sheet" data-s="'+sid+'">'+t("w.b.full")+' ↗</button>';
  if(g.st==="declined"){ h += U(t("w.c.notnowU")) + A('<p>'+t("w.c.declined2")+'</p>'); }
  if(g.st==="adopted"){
    h += U(t("w.c.useU")) + A('<p>'+t("w.c.savedMsg")+'</p>');
    if(!g.live){
      h += '<div class="cc"><div class="cc-h">'+t("w.c.addH")+'</div><div class="cc-b"><span class="muted small">'+t("w.c.addLead2",{p:t(P.name)})+'</span><ol class="todo">'+
        '<li><span class="n'+(g.copied?' ok':'')+'">'+(g.copied?I.check:'1')+'</span><span>'+t("w.c.s1b")+'</span><button class="btn btn-line" style="height:30px" data-act="ws-copy" data-s="'+sid+'">'+t(g.copied?"w.c.copied":"w.c.copy")+'</button></li>'+
        '<li><span class="n">2</span><span>'+t("w.c.s2b",{p:t(P.name)})+'</span><button class="btn btn-line" style="height:30px" data-act="ws-open-page">'+t("w.c.open")+'</button></li>'+
        '<li><span class="n">3</span><span>'+t("w.c.s3")+'</span><button class="btn btn-primary" style="height:30px" data-act="ws-live" data-s="'+sid+'">'+t("w.c.live")+'</button></li></ol></div></div>';
    } else {
      h += U(t("w.c.liveU"));
      var body = '<p>'+t("w.c.liveMore")+'</p>';
      if(!W.auto.on && W.checkNo<2) body += '<div class="chips-row"><button class="btn btn-primary" style="height:32px" data-act="ws-auto-freq" data-f="3d" data-chat="1">'+t("w.c.auto3d")+'</button><button class="btn btn-line" style="height:32px" data-act="ws-auto-freq" data-f="weekly" data-chat="1">'+freqLabel("weekly")+'</button><button class="btn btn-line" style="height:32px" data-act="ws-auto-freq" data-f="daily" data-chat="1">'+freqLabel("daily")+'</button></div>';
      h += A(body);
    }
  }
  return h;
}
function extrasAt(m, at){ return m.extra.filter(function(x){ return x.at===at; }).map(renderExtra).join(""); }
function renderExtra(x){
  if(x.u) return U(x.u);
  if(x.typing) return A('<span class="typing" aria-label="typing"><i></i><i></i><i></i></span>');
  if(x.stream!=null) return A('<p class="streamed" data-stream="1">'+esc(t(x.k).slice(0,x.stream))+(x.stream<t(x.k).length?'<span class="caret"></span>':'')+'</p>');
  var btn = x.btn ? '<button class="btn btn-line" data-act="'+x.btn.act+'"'+(x.btn.c?' data-c="'+x.btn.c+'"':'')+(x.btn.topic?' data-topic="'+x.btn.topic+'"':'')+'>'+t(x.btn.k)+' →</button>' : '';
  return A('<p class="streamed">'+esc(t(x.k))+'</p>'+btn);
}
function overviewChat(){
  var W = S.ws, h = '';
  if(W.firstVisit) h += '<div class="cb-intro">'+t("w.c.intro")+'</div>';
  if(W.measuring) return h + A('<p>'+t("w.c.measuring")+'</p>');
  var rows = function(ids){ return '<div class="cc tasks"><div class="tk-list">'+ids.map(function(id){ return '<button class="tk" data-act="ws-conv" data-c="'+id+'"><span class="tt"><b>'+t(PAGES[id].name)+'</b><small>'+t(SUGG[latestSugg(id)].t)+'</small></span><span class="pill">'+convStatus(id)+'</span></button>'; }).join("")+'</div></div>'; };
  h += divider(1) + A('<p>'+t("w.c.first")+'</p>'+rows(["flash","pricing","faq"]));
  if(W.returned) h += A('<p>'+t("w.c.welcomeBack2",{d:doneCount(), n:Object.keys(W.sugg).length})+'</p>');
  if(W.checkNo>=2){
    var f = W.sugg.flash1 && W.sugg.flash1.live;
    var lines = [[f?"w.c.l.flash.cited":"w.c.l.flash.not","flash"],["w.c.l.pricing","pricing"],["w.c.l.home","home"]];
    if(W.sugg.faq1 && W.sugg.faq1.st==="declined") lines.push(["w.c.l.faq",null]);
    h += divider(2) + A('<p>'+t("w.c.second",{d:t(W.check2Date)})+'</p><ul class="sum-list">'+lines.map(function(l){ return '<li><span>'+t(l[0])+'</span>'+(l[1]?'<button class="link small" data-act="ws-conv" data-c="'+l[1]+'">'+t("w.open")+' →</button>':'')+'</li>'; }).join("")+'</ul>');
  }
  return h;
}
function pageChat(id){
  var W = S.ws, m = W.meta[id], h = '';
  [1,2].forEach(function(c){
    var mine = convSuggs(id).filter(function(s){ return SUGG[s].check===c; });
    var flashResult = (id==="flash" && c===2 && W.checkNo>=2);
    var pendingOld = (c===2 && W.checkNo>=2 && id==="pricing" && W.sugg.pricing1 && (W.sugg.pricing1.st==="todo"||W.sugg.pricing1.st==="open"));
    if(!mine.length && !flashResult && !(m.created===c && c<=W.checkNo) && !extrasAt(m,c)) return;
    if(c>W.checkNo) return;
    h += divider(c);
    if(c===2 && id==="home") h += A('<p>'+t("w.c.homeNew")+'</p>');
    if(flashResult) h += A('<p>'+t(W.sugg.flash1&&W.sugg.flash1.live?"w.c.flashResult":"w.c.flashNot")+'</p>'+(W.sugg.flash1&&W.sugg.flash1.live?'<div class="cmp" style="width:100%"><div><small>'+t("d16")+'</small><b>'+t("r.beforev")+'</b></div><span class="arr">'+I.arrow+'</span><div class="after"><small>'+t(W.check2Date)+'</small><b>'+t("r.afterv")+'</b></div></div>':''));
    if(pendingOld) h += A('<p>'+t("w.c.pendingOld")+'</p>');
    if(c===2 && mine.length && id!=="home") h += A('<p>'+t("w.c.newFound")+'</p>');
    mine.forEach(function(s){ h += suggBlock(s); });
    h += extrasAt(m,c);
  });
  if(m.created>W.checkNo) h += extrasAt(m, m.created);
  return h;
}
function siteChat(id){ var m = S.ws.meta[id]; return [1,2].map(function(c){ return extrasAt(m,c); }).join(""); }
var CHIPS = {page:["q.same","q.why","q.other"], site:["q.more"], overview:["q.more"]};
function wsChat(){
  var W = S.ws, m = W.conv ? W.meta[W.conv] : null, kind = m ? m.kind : "overview";
  var ctx = m ? (m.kind==="page" ? t(PAGES[m.page].name) : t("w.c.scopeSite")) : S.undBrand;
  var body = !m ? overviewChat() : (m.kind==="page" ? pageChat(W.conv) : siteChat(W.conv));
  var asked = m ? m.asked : (W.ovAsked||{});
  var chips = W.measuring ? [] : CHIPS[kind].filter(function(k){ return !asked[k] && !(k==="q.other" && m && m.page==="home"); });
  return '<div class="ws-chat-h"><div><b>'+(m?esc(convName(W.conv)):t("w.c.title"))+'</b><small>'+t("w.c.current",{x:esc(ctx)})+'</small></div><button class="btn btn-line newchat" data-act="ws-newchat">+ '+t("w.nav.new")+'</button></div>'+
    '<div class="ws-chat-b" id="ws-chat-b">'+body+'</div>'+
    '<div class="ws-chat-f">'+chips.map(function(k){ return '<button type="button" class="ask-chip" data-act="ws-ask" data-q="'+k+'">'+t(k)+'</button>'; }).join("")+
    '<form id="ws-form"><label for="ws-input" class="sr">'+t("w.c.phStart")+'</label><textarea id="ws-input" rows="2" placeholder="'+esc(t(m?"w.c.phMore":"w.c.phStart"))+'"></textarea><div class="row"><button class="btn btn-line" type="submit">'+t("w.c.send")+'</button></div></form></div>';
}

/* ---------- tour */
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
  if(W.tour===0){ cx = hole.x+hole.w+16; cy = hole.y; } else if(W.tour===1){ cx = hole.x+hole.w/2-cw/2; cy = hole.y+hole.h+14; } else { cx = hole.x-cw-16; cy = hole.y+80; }
  cx = Math.max(12, Math.min(vw-cw-12, cx)); cy = Math.max(12, Math.min(vh-240, cy));
  var last = W.tour===TOUR.length-1;
  el.innerHTML = '<div class="tour-hole" style="left:'+hole.x+'px;top:'+hole.y+'px;width:'+hole.w+'px;height:'+hole.h+'px"></div>'+
    '<div class="tour-card" role="dialog" aria-labelledby="tour-t" style="left:'+cx+'px;top:'+cy+'px;width:'+cw+'px"><small class="mono">'+(W.tour+1)+' / 3</small><b id="tour-t">'+t(step[1]+".t")+'</b><p>'+t(step[1]+".d")+'</p>'+
    '<div class="tour-a"><button class="btn btn-quiet" data-act="tour-skip">'+t("tour.skip")+'</button><button class="btn btn-primary" data-act="tour-next">'+t(last?"tour.done":"tour.next")+'</button></div></div>';
}
window.addEventListener("resize", function(){ if(S.ws && S.ws.tour>=0) renderTour(); });

function renderWS(){
  if(S.view!=="ws" || !S.ws) return;
  var W = S.ws, pg = W.page;
  if(!W.conv && pg!=="overview") pg = "overview";
  if(W.conv && W.meta[W.conv].kind==="site" && PLAN!=="A") pg = "overview";
  if(PLAN==="B") pg = "overview";
  var main = pg==="overview" ? wsOverview() : (pg==="topic" ? (PLAN==="C" ? wsPagePreview() : wsTopic()) : wsReview());
  $("ws-side").innerHTML = wsSide();
  $("ws-main").innerHTML = '<div class="ws-in">'+main+'</div>';
  var draft = $("ws-input") ? $("ws-input").value : "";
  $("ws-chat").innerHTML = wsChat();
  if(draft) $("ws-input").value = draft;
  var cb = $("ws-chat-b"); if(cb) cb.scrollTop = cb.scrollHeight;
  renderTour();
}
function openConv(id){ var W = S.ws; W.conv = id; W.sid = null; W.firstVisit = false; var m = W.meta[id]; if(m){ m.unread = false; var s = latestSugg(id); if(s && W.sugg[s].st==="todo") W.sugg[s].st = "open"; }
  W.page = (m && m.kind==="page") || PLAN==="A" ? "topic" : "overview"; renderWS(); $("ws-main").scrollTop = 0; }
async function enterWS(mode){
  runId++; var id = runId;
  S.ws = wsFresh(); S.ws.firstVisit = true; S.ws.tour = 0;
  if(mode==="measuring"){ S.ws.measuring = true; S.ws.asked = 0; } else applyCheck1();
  show("ws"); renderWS();
  if(mode!=="measuring") return;
  try{ for(var n=1;n<=10;n++){ await sleep(450); check(id); S.ws.asked = n; renderWS(); }
    S.ws.measuring = false; applyCheck1(); S.metrics = {m:6,c:2}; renderWS(); toast(t("w.toast.done")); }catch(e){ if(e!=="cancel") throw e; }
}
function finishOnboarding(mode){ if(S.user){ enterWS(mode); return; } S.pending = "ws:"+mode; openAuth("workspace"); }
async function wsCheck(){
  var W = S.ws, id = runId; if(W.checking) return;
  W.checking = true; W.asked = 0; renderWS();
  try{ for(var n=1;n<=10;n++){ await sleep(260); check(id); W.asked = n; renderWS(); }
    W.checking = false;
    if(W.checkNo<2){ applyCheck2("d18full"); W.conv = null; W.page = "overview"; renderWS(); toast(t("w.toast.check2")); }
    else { renderWS(); toast(t("w.toast.nochange")); }
  }catch(e){ if(e!=="cancel") throw e; }
}
function wsJump(k){
  if(!S.user) S.user = {email:"you@answerai.pro"};
  runId++; S.ws = wsFresh(); var W = S.ws; applyCheck1();
  if(k==="tour"){ W.firstVisit = true; W.tour = 0; }
  if(k==="c06"){ openConv("flash"); }
  if(k==="c06b"){ W.sugg.flash1.st="adopted"; W.conv="flash"; W.page="topic"; }
  if(k==="c06c"){ W.sugg.flash1.st="declined"; W.conv="flash"; W.page="topic"; }
  if(k==="c06d"){ var sid = addSiteConv("disc"); W.meta[sid].extra.push({u:t("w.c.discU"), at:1},{k:"w.c.discA", at:1}); W.conv = sid; W.page = "topic"; }
  if(k==="c07"){ W.sugg.flash1.st="open"; W.conv="flash"; W.page="review"; }
  if(k==="c07b"){ W.sugg.flash1.st="adopted"; W.conv="flash"; W.page="review"; }
  if(k==="c08"){ W.sugg.flash1.st="adopted"; W.returned = true; }
  if(k==="c08b"){ W.sugg.flash1.st="adopted"; W.sugg.flash1.live=true; W.sugg.flash1.copied=true; W.conv="flash"; W.page="topic"; }
  if(k==="c09"||k==="c09b"||k==="c09c"||k==="c09d"){
    ["flash1","pricing1"].forEach(function(s){ W.sugg[s].st="adopted"; W.sugg[s].live=true; W.sugg[s].copied=true; }); W.sugg.faq1.st="declined";
    applyCheck2("d25full"); W.auto.on = true;
    if(k==="c09b"){ W.conv="pricing"; W.meta.pricing.unread=false; W.sugg.pricing2.st="open"; W.page="topic"; }
    if(k==="c09c"){ W.conv="home"; W.meta.home.unread=false; W.sugg.home2.st="open"; W.page="topic"; }
    if(k==="c09d"){ W.conv="flash"; W.meta.flash.unread=false; W.page="topic"; }
  }
  if(PLAN==="B" && W.page!=="overview") W.page = "overview";
  show("ws"); renderWS();
}

/* ---------- conversation routing for typed or suggested questions */
async function streamReply(m, key, at, btn){
  var id = runId, ty = {typing:true, at:at}; m.extra.push(ty); renderWS();
  await sleep(800); check(id);
  m.extra.splice(m.extra.indexOf(ty),1); var x = {k:key, stream:0, at:at, btn:btn}; m.extra.push(x); renderWS();
  var full = t(key);
  while(x.stream < full.length){ await sleep(16); check(id); x.stream = Math.min(full.length, x.stream+2);
    var el = document.querySelector('#ws-chat [data-stream]'); if(!el){ renderWS(); continue; }
    el.innerHTML = esc(full.slice(0,x.stream)) + (x.stream<full.length?'<span class="caret"></span>':'');
    var cb = $("ws-chat-b"); if(cb) cb.scrollTop = cb.scrollHeight; }
  x.stream = null; renderWS();
}
function classify(v){
  if(/除了文案|besides (the )?copy|other than (the )?copy|else can improve/i.test(v)) return "q.more";
  if(/还有别的|别的地方|anything else|else to change/i.test(v)) return "q.same";
  if(/为什么|why/i.test(v)) return "q.why";
  if(/首页|homepage/i.test(v)) return "q.other";
  return "free";
}
async function wsAsk(v, key){
  var W = S.ws; key = key || classify(v);
  try{
  if(!W.conv){
    if(key==="q.more"){ var sid = addSiteConv("more"); W.conv = sid; W.page = PLAN==="A"?"topic":"overview"; var m = W.meta[sid]; m.asked["q.more"]=1; m.extra.push({u:v, at:W.checkNo}); await streamReply(m, "w.c.more.a", W.checkNo); return; }
    var s2 = addSiteConv("new", v.length>18 ? v.slice(0,18)+"…" : v); W.conv = s2; W.page = PLAN==="A"?"topic":"overview"; var m2 = W.meta[s2]; m2.extra.push({u:v, at:W.checkNo}); await streamReply(m2, "w.c.free2", W.checkNo); return;
  }
  var m = W.meta[W.conv]; m.asked[key] = 1; m.extra.push({u:v, at:W.checkNo});
  if(key==="q.more"){ await streamReply(m, "w.c.more.a", W.checkNo); return; }
  if(m.kind==="site"){ await streamReply(m, "w.c.free2", W.checkNo); return; }
  if(key==="q.same"){ await streamReply(m, convSuggs(W.conv).length>1 ? "r.same2" : "r.same1", W.checkNo); return; }
  if(key==="q.why"){ await streamReply(m, "r.why", W.checkNo, {act:"ws-newchat", topic:"why", k:"r.whyBtn"}); return; }
  if(key==="q.other"){ await streamReply(m, "r.other", W.checkNo, W.meta.home ? {act:"ws-conv", c:"home", k:"r.otherGo"} : {act:"ws-newpage", k:"r.otherNew"}); return; }
  await streamReply(m, "w.c.free2", W.checkNo);
  }catch(e){ if(e!=="cancel") throw e; }
}
async function newChat(topic){
  var W = S.ws;
  if(topic==="why"){ var id = addSiteConv("why"); openConv(id); var m = W.meta[id]; m.extra.push({u:t("q.why"), at:W.checkNo}); try{ await streamReply(m, "site.why.a", W.checkNo); }catch(e){ if(e!=="cancel") throw e; } return; }
  var id2 = addSiteConv("new"); W.meta[id2].extra.push({k:"site.new.a", at:W.checkNo}); openConv(id2);
}
function newHomeChat(){ var W = S.ws; addPageConv("home", W.checkNo); W.meta.home.created = W.checkNo; W.meta.home.extra.push({k:"r.homeTalk", at:W.checkNo}); openConv("home"); }

