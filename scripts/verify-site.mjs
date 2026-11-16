import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const errors=[];
let checkedLinks=0;
const walk=(dir)=>fs.readdirSync(dir,{withFileTypes:true}).flatMap((entry)=>entry.isDirectory()&&![".git","node_modules"].includes(entry.name)?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]).filter(p=>!p.includes(path.sep+".git"+path.sep)&&!p.includes(path.sep+"node_modules"+path.sep));
const files=walk(root).map(p=>path.relative(root,p));
const htmlFiles=files.filter(p=>p.endsWith(".html"));
const decode=(s)=>s.replaceAll("&amp;","&").replaceAll("&#38;","&").replaceAll("&quot;",'"');
for(const file of htmlFiles){
 const html=fs.readFileSync(path.join(root,file),"utf8");
 for(const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)){
  let raw=decode(match[1]).trim();
  if(!raw||/^(?:https?:|mailto:|tel:|sms:|javascript:|data:|blob:|\/\/)/i.test(raw)||raw.startsWith("#"))continue;
  raw=raw.split(/[?#]/,1)[0];
  if(!raw)continue;
  let target;
  try{target=raw.startsWith("/")?path.join(root,decodeURIComponent(raw.slice(1))):path.resolve(path.dirname(path.join(root,file)),decodeURIComponent(raw));}
  catch{errors.push(file+": invalid local URL "+raw);continue;}
  const candidates=[target,path.join(target,"index.html")];
  if(!candidates.some(p=>fs.existsSync(p)))errors.push(file+": missing local target "+raw);
  checkedLinks++;
 }
}
const requireText=(file,needle,label)=>{const s=fs.readFileSync(path.join(root,file),"utf8");if(!s.includes(needle))errors.push(label+" missing from "+file)};
requireText("index.html","GTM-5CZQ9MJH","GTM container");
requireText("pages/pricing.html","../scripts/site-interactions.js","pricing experiment script");
requireText("pages/download.html","android-beta-2026-11-14-12/app-debug.apk","latest beta 12 APK link");
requireText("pages/download.html","GTM-5CZQ9MJH","download-page analytics");
requireText("pages/download.html","../scripts/site-interactions.js","download event script");
requireText("pages/contact.html",'data-twiga-form="demo"',"demo request form");
requireText("scripts/site-interactions.js","twiga_experiment_exposure","A/B exposure event");
requireText("scripts/site-interactions.js","Choose\\s+","pricing experiment selector");
requireText("scripts/site-interactions.js","2592000000","30-day experiment assignment expiry");
requireText("scripts/site-interactions.js","twiga_pricing_plan_click","pricing CTA event");
requireText("scripts/site-interactions.js","twiga_demo_request_submitted","demo conversion event");
requireText("scripts/site-interactions.js","twiga_apk_download_click","APK download event");
requireText("privacy.html","Analytics, cookies and website testing","privacy disclosure");
const sitemap=fs.readFileSync(path.join(root,"sitemap.xml"),"utf8");
for(const m of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)){
 const u=new URL(m[1]);const p=path.join(root,decodeURIComponent(u.pathname.replace(/^\//,""))||"index.html");
 if(!fs.existsSync(p))errors.push("sitemap URL missing: "+m[1]);
}
if(errors.length){console.error("TWIGA SITE QA FAILED");for(const e of errors)console.error(" - "+e);process.exit(1);}
console.log("TWIGA SITE QA PASSED: "+htmlFiles.length+" HTML pages, "+checkedLinks+" local links, sitemap targets, latest APK, GTM, A/B events and privacy disclosure.");
