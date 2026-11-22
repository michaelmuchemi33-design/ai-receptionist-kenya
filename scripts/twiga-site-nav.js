(() => {
const body=document.body;
if(!body||body.dataset.twigaNavReady==="1")return;
body.dataset.twigaNavReady="1";
body.classList.add("twiga-navigation-active");
document.querySelectorAll("body > header:not(.twiga-site-header),.site-header,.topbar,.learn-article-header,.article-header,#main .framer-1xuw6qv,#mobileMenuOverlay,.twiga-nav-overlay").forEach(node=>{
 if(node.id==="mobileMenuOverlay"||node.classList.contains("twiga-nav-overlay"))node.remove();
 else node.classList.add("twiga-legacy-header");
});
const items=[
 ["What TWIGA does","/pages/about.html"],
 ["100 industries","/pages/ai-receptionist-industries-kenya.html"],
 ["How it works","/pages/ai-receptionist-how-it-works-kenya.html"],
 ["FAQs","/pages/faq.html"],
 ["Pricing","/pages/pricing.html"]
];
const current=location.pathname.replace(/\/$/,"/");
const active=href=>current===href||(href==="/"&&current==="/index.html");
const make=(label,href)=>{
 const a=document.createElement("a");a.href=href;a.textContent=label;
 if(active(href))a.setAttribute("aria-current","page");
 return a;
};
const header=document.createElement("header");
header.className="twiga-site-header";
header.innerHTML='<div class="twiga-site-nav-inner"><a class="twiga-site-brand" href="/" aria-label="TWIGA home"><img src="/images/twiga-logo.svg" alt="TWIGA logo"><span><strong>TWIGA</strong><small>AI receptionist for Kenyan businesses</small></span></a><nav class="twiga-site-links" aria-label="Main navigation"></nav><div class="twiga-site-actions"><a class="twiga-site-login" href="https://app.twiga.co.ke/">Log in</a><a class="twiga-site-cta" href="https://app.twiga.co.ke/">Start 7-day trial</a><button class="twiga-site-menu-button" type="button" aria-expanded="false" aria-controls="twiga-site-mobile-menu" aria-label="Open menu"><span></span><span></span><span></span></button></div></div><nav class="twiga-site-mobile-menu" id="twiga-site-mobile-menu" aria-label="Mobile navigation" hidden></nav>';
const desktop=header.querySelector(".twiga-site-links");
const mobile=header.querySelector(".twiga-site-mobile-menu");
items.forEach(([label,href])=>{desktop.append(make(label,href));mobile.append(make(label,href));});
mobile.append(make("Log in","https://app.twiga.co.ke/"));
const button=header.querySelector(".twiga-site-menu-button");
const close=()=>{
 mobile.hidden=true;button.setAttribute("aria-expanded","false");
 button.setAttribute("aria-label","Open menu");header.classList.remove("twiga-menu-open");
};
button.addEventListener("click",()=>{
 const open=button.getAttribute("aria-expanded")!=="true";
 button.setAttribute("aria-expanded",String(open));
 button.setAttribute("aria-label",open?"Close menu":"Open menu");
 mobile.hidden=!open;header.classList.toggle("twiga-menu-open",open);
});
mobile.addEventListener("click",e=>{if(e.target.closest("a"))close();});
document.addEventListener("keydown",e=>{
 if(e.key==="Escape"&&!mobile.hidden){close();button.focus();}
});
const loader=document.getElementById("twiga-page-loader");
if(loader&&loader.parentNode===body)body.insertBefore(header,loader.nextSibling);
else body.insertBefore(header,body.firstChild);
})();