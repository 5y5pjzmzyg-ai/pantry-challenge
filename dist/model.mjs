export const HOMES=['Tampere','Seinäjoki'];
export const CATEGORIES=['Fridge','Freezer','Cupboard','Household','Toiletries','Supplements','Medicines'];
export const AMOUNTS=['','Full','Plenty','About half','Some','A little','Nearly empty'];
export const today=()=>new Date().toLocaleDateString('en-CA');
export const empty=()=>({version:1,items:[],shopping:[]});
export function item(input){
 const x={id:crypto.randomUUID(),name:'',home:'Tampere',category:'Cupboard',unit:'packets',unopened:0,opened:0,amount:'',added:today(),date:'',dateKind:'Reminder',useUp:false,notes:'',...input};
 validateItem(x); return x;
}
const text=(x,n)=>typeof x==='string'&&x.length<=n;
const date=x=>x===''||(typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&!isNaN(Date.parse(x))&&new Date(x).toISOString().slice(0,10)===x);
export function validateItem(x){
 if(!x||!text(x.id,100)||!/^[a-zA-Z0-9_-]+$/.test(x.id)||!text(x.name,160)||!x.name.trim()||!HOMES.includes(x.home)||!CATEGORIES.includes(x.category)||!text(x.unit,40)||!x.unit.trim()||!AMOUNTS.includes(x.amount)||typeof x.useUp!=='boolean'||!text(x.notes,2000)||!date(x.date)||!date(x.added)||!x.added||!['Reminder','Best before','Use by'].includes(x.dateKind)||!['unopened','opened'].every(k=>Number.isFinite(x[k])&&x[k]>=0&&x[k]<=1000000))throw Error('Check the item name, quantities, unit and dates.');
 return x;
}
export function validateBackup(s){
 if(!s||s.version!==1||!Array.isArray(s.items)||!Array.isArray(s.shopping)||s.items.length>10000||s.shopping.length>10000)throw Error('This is not a Pantry Challenge backup.');
 s.items.forEach(validateItem);
 s.shopping.forEach(x=>{if(!x||!text(x.id,100)||!/^[a-zA-Z0-9_-]+$/.test(x.id)||!text(x.name,160)||!x.name.trim()||!HOMES.includes(x.home)||!text(x.note,160)||typeof x.done!=='boolean')throw Error('Invalid shopping list in backup.');});
 if(new Set([...s.items,...s.shopping].map(x=>x.id)).size!==s.items.length+s.shopping.length)throw Error('Duplicate IDs in backup.');
 // Whitelist fields: never carry unknown properties into application state.
 return {version:1,items:s.items.map(x=>Object.fromEntries(['id','name','home','category','unit','unopened','opened','amount','added','date','dateKind','useUp','notes'].map(k=>[k,x[k]]))),shopping:s.shopping.map(x=>Object.fromEntries(['id','name','home','note','done'].map(k=>[k,x[k]])))};
}
export function stock(x){return `${x.unopened} unopened + ${x.opened} opened ${x.unit}${x.amount?' · '+x.amount.toLowerCase():''}`;}
export function status(x,now=today()){
 const days=d=>Math.floor((Date.parse(now+'T12:00:00Z')-Date.parse(d+'T12:00:00Z'))/86400000);
 if(x.date){const d=days(x.date);return {label:`${x.dateKind} ${x.date}${d>0?' · passed':d>=-3?' · soon':''}`,attention:d>=-3};}
 const age=days(x.added),limit={Fridge:7,Freezer:90,Cupboard:180}[x.category];
 return {label:limit&&age>=limit?'Time to check':'No date set',attention:!!limit&&age>=limit};
}
export function move(s,id,home,category){
 if(!HOMES.includes(home)||!CATEGORIES.includes(category))throw Error('Invalid destination');
 return {...s,items:s.items.map(x=>x.id===id?{...x,home,category}:x)};
}
export function receiptLines(raw,home){
 return raw.split(/\r?\n/).map(s=>s.trim()).filter(s=>s&&/\p{L}/u.test(s)&&!/^\s*(total|subtotal|yhteens|summa|alv|vat|visa|mastercard|käteinen|change|kuitti|receipt|www\.|http|kiitos|tervetuloa|kassa|pvm|eur\b)/i.test(s)).map(s=>{
 let name=s.replace(/\s+[-+]?\d+[,.]\d{2}\s*[A-Z*]?\s*$/,'').trim();
 const m=name.match(/^(\d+(?:[,.]\d+)?)\s*[x×]\s*(.+)$/i);
 let quantity=m?Number(m[1].replace(',','.')):1;if(m)name=m[2];
 return {name:name.slice(0,160),home,category:'Cupboard',unit:'packets',unopened:quantity,opened:0,amount:'',date:'',dateKind:'Reminder',useUp:false,notes:''};
 }).filter(x=>x.name);
}
export function matches(name,query){return name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes(query.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim());}
