import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

// Query strings are part of ESM identity: checking the path alone misses this bug.
const root=new URL('../',import.meta.url);
const html=await readFile(new URL('index.html',root),'utf8');
const release=html.match(/data-release="([^"]+)"/)?.[1];
assert.ok(release,'The entry declares its release');
const entry=html.match(/<script type="module" src="([^"]+)"/)?.[1];
assert.ok(entry,'The public entry is present');
const seen=new Set(),identities=new Map();
async function visit(url){
  if(seen.has(url.href))return;seen.add(url.href);
  const file=new URL(url);file.search='';file.hash='';
  const source=await readFile(file,'utf8');
  const versions=identities.get(file.href)||new Set();versions.add(url.search);
  identities.set(file.href,versions);
  assert.equal(url.search,'?v='+release,'The module must share the entry release: '+url.href);
  for(const match of source.matchAll(/(?:from\s*|import\s*\(\s*|import\s*)['"]([^'"]+)['"]/g)){
    if(match[1].startsWith('.'))await visit(new URL(match[1],url));
  }
}
await visit(new URL(entry,root));
for(const [file,versions]of identities)assert.equal(versions.size,1,'Duplicate module instances: '+file);
console.log(`Startup graph passed: ${identities.size} modules, one release, one identity per module.`);
