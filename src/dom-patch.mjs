// Preserve existing controls, headings, images and dialogs during state updates.
const key=n=>n.nodeType!==1?null:n.getAttribute('data-key')||n.id||n.getAttribute('data-m')||(n.getAttribute('data-act')?`act:${n.getAttribute('data-act')}:${n.getAttribute('data-step')||''}`:null)||(n.getAttribute('role')==='dialog'?`dialog:${n.getAttribute('aria-labelledby')}`:null);
function compatible(a,b){return a.nodeType===b.nodeType&&a.nodeName===b.nodeName&&key(a)===key(b);}
function patchNode(old,next){
  if(old.nodeType!==1){if(old.nodeValue!==next.nodeValue)old.nodeValue=next.nodeValue;return;}
  for(const a of [...old.attributes])if(!next.hasAttribute(a.name))old.removeAttribute(a.name);
  for(const a of next.attributes)if(old.getAttribute(a.name)!==a.value)old.setAttribute(a.name,a.value);
  patchChildren(old,next);
}
function patchChildren(host,next){
  let at=host.firstChild;
  for(const node of [...next.childNodes]){
    let match=at;
    if(!match||!compatible(match,node)){
      const k=key(node);
      match=k?[...host.childNodes].find(n=>key(n)===k&&compatible(n,node)):null;
      if(match)host.insertBefore(match,at);
      else {match=node.cloneNode(true);host.insertBefore(match,at);}
    }
    patchNode(match,node);at=match.nextSibling;
  }
  while(at){const next=at.nextSibling;at.remove();at=next;}
}
export function patchHTML(host,html){const t=document.createElement('template');t.innerHTML=html;patchChildren(host,t.content);}
