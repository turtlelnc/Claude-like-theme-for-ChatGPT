(()=>{
  if(window.__chatgptRootPseudoTracker)return;
  window.__chatgptRootPseudoTracker=true;

  const TOKENS=[
    "--main-surface-primary",
    "--main-surface-secondary",
    "--main-surface-tertiary",
    "--main-surface-background",
    "--surface-primary",
    "--surface-secondary",
    "--surface-tertiary",
    "--sidebar-surface-primary",
    "--composer-surface-primary",
    "--bg-primary",
    "--bg-secondary",
    "--bg-tertiary",
    "--bg-tooltip",
    "--bg-elevated-primary",
    "--bg-elevated-secondary",
    "--code-block-surface"
  ];

  const state={
    scanning:false,
    visited:0,
    visible:0,
    queue:[],
    scheduled:false,
    generation:0,
    elementHits:[],
    pseudoHits:[],
    tokenHits:[],
    edgeHits:[]
  };

  function parseColor(s){
    if(!s)return null;
    let m=s.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s\/]+([\d.]+))?\s*\)/i);
    if(m)return {r:+m[1],g:+m[2],b:+m[3],a:m[4]===undefined?1:+m[4]};
    m=s.match(/^#([0-9a-f]{3,8})$/i);
    if(!m)return null;
    let h=m[1];
    if(h.length===3) h=h.split("").map(x=>x+x).join("");
    if(h.length===4) h=h.split("").map(x=>x+x).join("");
    if(h.length===6||h.length===8){
      return {
        r:parseInt(h.slice(0,2),16),
        g:parseInt(h.slice(2,4),16),
        b:parseInt(h.slice(4,6),16),
        a:h.length===8?parseInt(h.slice(6,8),16)/255:1
      };
    }
    return null;
  }

  function darkness(s){
    const c=parseColor(s);
    if(!c || c.a<0.12)return null;
    return (c.r+c.g+c.b)/3;
  }

  function isSuspiciousDark(s){
    const c=parseColor(s);
    if(!c || c.a<0.12)return false;
    const avg=(c.r+c.g+c.b)/3;
    const max=Math.max(c.r,c.g,c.b);
    return avg<=25 && max<=32;
  }

  function blackishText(s){
    if(!s || s==="none")return false;
    return /#000(?:000)?\b/i.test(s) ||
      /\bblack\b/i.test(s) ||
      /rgba?\(\s*(?:0|[1-2]?\d)\s*[,\s]+(?:0|[1-2]?\d)\s*[,\s]+(?:0|[1-2]?\d)/i.test(s);
  }

  function cls(el){return el?.classList?[...el.classList]:[]}

  function desc(el){
    if(!el)return null;
    return {
      tag:el.tagName?.toLowerCase()||null,
      id:el.id||null,
      role:el.getAttribute?.("role")||null,
      dataTestId:el.getAttribute?.("data-testid")||null,
      classes:cls(el).slice(0,36)
    };
  }

  function chain(el){
    const a=[];
    let p=el?.parentElement;
    for(let i=0;p&&i<4;i++,p=p.parentElement)a.push(desc(p));
    return a;
  }

  function rectObj(r){
    return {
      x:Math.round(r.x),y:Math.round(r.y),
      width:Math.round(r.width),height:Math.round(r.height)
    };
  }

  function visible(el,r,s){
    if(el===document.documentElement||el===document.body)return true;
    if(r.width<2||r.height<2)return false;
    if(s.display==="none"||s.visibility==="hidden"||+s.opacity===0)return false;
    if(r.bottom<0||r.right<0||r.top>innerHeight||r.left>innerWidth)return false;
    return true;
  }

  function pushUnique(arr,item,key){
    if(arr.some(x=>x.key===key))return;
    item.key=key;
    arr.push(item);
  }

  function inspectPseudo(el,pseudo){
    let s;
    try{s=getComputedStyle(el,pseudo)}catch{return}
    const content=s.content;
    if((content==="none"||content==="normal") &&
       s.backgroundImage==="none" &&
       !isSuspiciousDark(s.backgroundColor) &&
       !blackishText(s.boxShadow)) return;

    const reasons=[];
    if(isSuspiciousDark(s.backgroundColor))reasons.push("background");
    if(blackishText(s.backgroundImage))reasons.push("gradient");
    if(blackishText(s.boxShadow))reasons.push("shadow");
    if(!reasons.length)return;

    const r=el.getBoundingClientRect();
    const key=[pseudo,el.tagName,el.id,cls(el).join("."),Math.round(r.x),Math.round(r.y)].join("|");
    pushUnique(state.pseudoHits,{
      pseudo,
      element:desc(el),
      reasons,
      style:{
        content:s.content,
        display:s.display,
        position:s.position,
        backgroundColor:s.backgroundColor,
        backgroundImage:s.backgroundImage,
        boxShadow:s.boxShadow,
        filter:s.filter,
        backdropFilter:s.backdropFilter||s.webkitBackdropFilter,
        opacity:s.opacity
      },
      rect:rectObj(r),
      ancestors:chain(el)
    },key);
  }

  function inspectTokens(el,s){
    const local=[];
    for(const name of TOKENS){
      const value=s.getPropertyValue(name).trim();
      if(!value)continue;
      const d=darkness(value);
      if(value==="#000"||value==="#000000"||(d!==null&&d<=24)){
        local.push({name,value});
      }
    }
    if(!local.length)return;

    const r=el.getBoundingClientRect();
    const key=[el.tagName,el.id,cls(el).join("."),local.map(x=>x.name+"="+x.value).join(";")].join("|");
    pushUnique(state.tokenHits,{
      element:desc(el),
      tokens:local,
      rect:rectObj(r),
      ancestors:chain(el)
    },key);
  }

  function process(el){
    if(!(el instanceof Element))return;
    state.visited++;
    const r=el.getBoundingClientRect();
    const s=getComputedStyle(el);
    if(!visible(el,r,s))return;
    state.visible++;

    const reasons=[];
    if(isSuspiciousDark(s.backgroundColor))reasons.push("background");
    if(blackishText(s.backgroundImage))reasons.push("gradient");
    if(blackishText(s.boxShadow))reasons.push("shadow");

    if(reasons.length){
      const key=[el.tagName,el.id,cls(el).join("."),Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)].join("|");
      pushUnique(state.elementHits,{
        element:desc(el),
        reasons,
        style:{
          backgroundColor:s.backgroundColor,
          backgroundImage:s.backgroundImage,
          boxShadow:s.boxShadow,
          position:s.position,
          zIndex:s.zIndex,
          opacity:s.opacity
        },
        rect:rectObj(r),
        ancestors:chain(el)
      },key);
    }

    inspectTokens(el,s);

    const cn=cls(el).join(" ");
    if(el===document.documentElement||el===document.body||
       /before|after|surface|footer|header|composer|sidebar|overlay|backdrop|fade|shadow|sticky|fixed/i.test(cn)){
      inspectPseudo(el,"::before");
      inspectPseudo(el,"::after");
    }
  }

  function edgeProbe(){
    state.edgeHits=[];
    const pts=[];
    const xs=[1,Math.floor(innerWidth*.25),Math.floor(innerWidth*.5),Math.floor(innerWidth*.75),innerWidth-2];
    const ys=[1,innerHeight-2];
    for(const x of xs)for(const y of ys)pts.push([x,y]);
    for(const y of [Math.floor(innerHeight*.25),Math.floor(innerHeight*.5),Math.floor(innerHeight*.75)]){
      pts.push([1,y],[innerWidth-2,y]);
    }

    for(const [x,y] of pts){
      const el=document.elementFromPoint(x,y);
      if(!el)continue;
      const s=getComputedStyle(el);
      const parents=[];
      let p=el;
      for(let i=0;p&&i<5;i++,p=p.parentElement){
        const ps=getComputedStyle(p);
        parents.push({
          element:desc(p),
          backgroundColor:ps.backgroundColor,
          backgroundImage:ps.backgroundImage,
          tokens:Object.fromEntries(TOKENS.map(t=>[t,ps.getPropertyValue(t).trim()]).filter(([,v])=>v))
        });
      }
      state.edgeHits.push({x,y,topElement:desc(el),chain:parents});
    }
  }

  function runChunk(deadline){
    state.scheduled=false;
    state.scanning=true;
    let n=0;
    while(state.queue.length&&n<35){
      process(state.queue.shift());
      n++;
      if(deadline?.timeRemaining&&deadline.timeRemaining()<3)break;
    }
    if(state.queue.length)schedule();
    else{
      edgeProbe();
      state.scanning=false;
    }
  }

  function schedule(){
    if(state.scheduled)return;
    state.scheduled=true;
    if("requestIdleCallback" in window)requestIdleCallback(runChunk,{timeout:250});
    else setTimeout(()=>runChunk(null),16);
  }

  function scan(){
    state.generation++;
    state.visited=0;
    state.visible=0;
    state.elementHits=[];
    state.pseudoHits=[];
    state.tokenHits=[];
    state.edgeHits=[];
    state.queue=[document.documentElement,document.body,...document.querySelectorAll("body *")];
    schedule();
  }

  function clear(){
    state.generation++;
    state.queue=[];
    state.visited=0;
    state.visible=0;
    state.elementHits=[];
    state.pseudoHits=[];
    state.tokenHits=[];
    state.edgeHits=[];
    state.scanning=false;
    state.scheduled=false;
  }

  function exportData(){
    return {
      meta:{
        url:location.href,
        title:document.title,
        capturedAt:new Date().toISOString(),
        scanning:state.scanning,
        visited:state.visited,
        visible:state.visible
      },
      root:{
        html:{
          backgroundColor:getComputedStyle(document.documentElement).backgroundColor,
          backgroundImage:getComputedStyle(document.documentElement).backgroundImage
        },
        body:{
          backgroundColor:getComputedStyle(document.body).backgroundColor,
          backgroundImage:getComputedStyle(document.body).backgroundImage
        }
      },
      elementHits:state.elementHits,
      pseudoHits:state.pseudoHits,
      tokenOverrides:state.tokenHits,
      edgeProbes:state.edgeHits
    };
  }

  chrome.runtime.onMessage.addListener((msg,sender,sendResponse)=>{
    try{
      if(msg.type==="SCAN"){scan();sendResponse({ok:true})}
      else if(msg.type==="CLEAR"){clear();sendResponse({ok:true})}
      else if(msg.type==="EXPORT"){sendResponse(exportData())}
      else if(msg.type==="STATUS"){
        sendResponse({
          scanning:state.scanning,
          visited:state.visited,
          visible:state.visible,
          elementHits:state.elementHits.length,
          pseudoHits:state.pseudoHits.length,
          tokenHits:state.tokenHits.length,
          edgeHits:state.edgeHits.length,
          queue:state.queue.length
        });
      }else sendResponse({ok:true});
    }catch(e){sendResponse({error:String(e)})}
    return true;
  });
})();
