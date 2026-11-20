import fs from "node:fs";
const base = new URL("../",import.meta.url);
const read = p => fs.readFileSync(new URL(p,base),"utf8");
const people = JSON.parse(read("js/character-data.js").replace(/^window.dwCharacters = /,"").replace(/;\s*$/,""));
const gadgets = [...read("js/gadgets.js").matchAll(/name:\s*"([^"]+)",\s*category:[\s\S]*?description:\s*"([^"]+)"/g)];
const hindi = {"Doraemon":["doremon","dorenmon","डोरेमोन","डोरेमॉन"],"Nobita Nobi":["nobita","नोबिता"],"Shizuka Minamoto":["shizuka","शिजुका"],"Gian":["जियान","जयान"],"Suneo Honekawa":["sunio","सुनियो"],"Dorami":["डोरामी"]};
const records = people.map(p=>({name:p.name,aliases:[p.name,...(p.aliases||[]),...(hindi[p.name]||[])],answer:p.description,facts:{birthday:p.birthday,family:p.family,home:p.home,role:p.role,movie:p.movie}}));
for(const [,name,answer] of gadgets) records.push({name,aliases:[name],answer});
for(const [name,aliases,answer] of [
  ["Test",["quiz","test","password kaise milega"],"Test mein 20 questions hain. 20/20 par promotion ke baad Show code dabao."],
  ["Wallpapers",["wallpaper","background download"],"Wallpapers page kholo, apni pasand ki image chuno aur Download dabao."],
  ["Live chat",["chat room","live chat","online baat"],"Live Chat page par nickname aur message likho, phir Send dabao."]])
  records.push({name,aliases,answer});
function tokens(s){return [...new Set(s.toLowerCase().match(/[\p{L}\p{M}\p{N}]+/gu)||[])];}
const docs=records.map(r=>tokens(r.aliases.join(" ")));
const df={};
for(const doc of docs)for(const word of doc)df[word]=(df[word]||0)+1;
const idf=Object.fromEntries(Object.entries(df).map(([w,n])=>[w,Math.log((docs.length+1)/(n+1))+1]));
const model={idf,records:records.map((r,i)=>({...r,terms:docs[i]}))};
fs.writeFileSync(new URL("js/buddy-model.js",base),"window.dwBuddyModel = "+JSON.stringify(model)+";\n");
console.log(records.length+" topics trained from the site catalogue");
