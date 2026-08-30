const status=document.getElementById("status");
const buttons=[...document.querySelectorAll("button")];

async function tab(){
  const [t]=await chrome.tabs.query({active:true,currentWindow:true});
  if(!t?.id) throw new Error("NO_TAB");
  return t;
}
async function send(type){
  const t=await tab();
  return chrome.tabs.sendMessage(t.id,{type});
}
async function refresh(){
  try{
    const r=await send("STATUS");
    buttons.forEach(b=>b.disabled=false);
    status.textContent=
      `Scanning: ${r.scanning?"YES":"NO"}\n`+
      `Visited: ${r.visited}\n`+
      `Visible: ${r.visible}\n`+
      `Element hits: ${r.elementHits}\n`+
      `Pseudo hits: ${r.pseudoHits}\n`+
      `Token overrides: ${r.tokenHits}\n`+
      `Edge probes: ${r.edgeHits}\n`+
      `Queue: ${r.queue}`;
  }catch(e){
    buttons.forEach(b=>b.disabled=true);
    status.textContent="请切回 chatgpt.com，并刷新页面一次。";
  }
}
document.getElementById("scan").onclick=async()=>{
  try{await send("SCAN")}catch{}
  refresh();
};
document.getElementById("clear").onclick=async()=>{
  try{await send("CLEAR")}catch{}
  refresh();
};
document.getElementById("export").onclick=async()=>{
  try{
    const data=await send("EXPORT");
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download=`chatgpt-root-pseudo-scan-${new Date().toISOString().replace(/[:.]/g,"-")}.json`;
    a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }catch{}
};
refresh();
setInterval(refresh,800);
