// Only deliberate screen navigation is recorded; answer states are never replayed.
export function createJourney(){
 const entries=[];
 const key=r=>[r.view,r.tab,r.dealsSrc,r.dealsFrom].join('|');
 return {remember(route){if(!route)return;if(key(entries.at(-1)||{})!==key(route))entries.push({...route});if(entries.length>50)entries.shift();},previous(){return entries.pop()||null;},clear(){entries.length=0;},get length(){return entries.length;}};
}
