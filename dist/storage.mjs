import {empty,validateBackup} from './model.mjs';
let db;
export async function connect(){
 db=await new Promise((resolve,reject)=>{let r=indexedDB.open('pantry-challenge',1);r.onupgradeneeded=()=>{r.result.createObjectStore('data');};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(Error('Close other Pantry Challenge tabs and retry.'));});
 db.onversionchange=()=>db.close();
 return db;
}
export async function read(){return new Promise((resolve,reject)=>{const t=db.transaction('data','readonly'),r=t.objectStore('data').get('current');r.onsuccess=()=>{try{resolve(r.result?validateBackup(r.result):empty());}catch(e){reject(e);}};r.onerror=()=>reject(r.error);});}
export async function write(state){
 const safe=validateBackup(state);
 return new Promise((resolve,reject)=>{const t=db.transaction('data','readwrite'),s=t.objectStore('data');const r=s.get('current');r.onsuccess=()=>{if(r.result)s.put(r.result,'previous');s.put(safe,'current');};t.oncomplete=()=>resolve();t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error||Error('Storage transaction cancelled'));});
}
export async function previous(){return new Promise((resolve,reject)=>{const r=db.transaction('data').objectStore('data').get('previous');r.onsuccess=()=>{try{resolve(r.result?validateBackup(r.result):null);}catch(e){reject(e);}};r.onerror=()=>reject(r.error);});}
export async function change(fn){return new Promise((resolve,reject)=>{const t=db.transaction('data','readwrite'),s=t.objectStore('data');let next;const r=s.get('current');r.onsuccess=()=>{try{const old=r.result?validateBackup(r.result):empty();next=validateBackup(fn(structuredClone(old)));s.put(old,'previous');s.put(next,'current');}catch(e){t.abort();reject(e);}};t.oncomplete=()=>resolve(next);t.onabort=()=>reject(t.error||Error('Change was not saved'));t.onerror=()=>reject(t.error);});}
