(async()=>{try{const response=await fetch('/api/photos',{cache:'no-store',credentials:'same-origin'});if(!response.ok)return;const {photos}=await response.json();
function apply(node,key){const photo=photos[key];if(!node||!photo)return;const image=document.createElement('img');image.src=photo.url;image.alt=photo.alt;image.loading='lazy';image.dataset.managedPhoto=key;
if(node.matches('.swatch')){image.style.cssText='width:100%;height:100%;object-fit:cover;display:block;border-radius:inherit';node.replaceChildren(image);node.style.overflow='hidden';return}
if(node.closest('.service-waterproofing-background')){const holder=node.closest('.service-waterproofing-background');image.style.cssText='position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;transform:none!important';holder.replaceChildren(image);return}
const crop=node.closest('.waterproof-crop');const svg=node.closest('.waterproofing-slice');if(crop){crop.replaceWith(image)}else if(svg){image.style.cssText='width:100%;height:270px;object-fit:cover;border-radius:22px';svg.replaceWith(image)}else{image.className=node.getAttribute('class')||'';node.replaceWith(image)}
const link=image.closest('a');if(link&&link.getAttribute('href')?.startsWith('/assets/'))link.href=photo.url;
if(image.closest('.service-hero-visual')){image.style.cssText='width:100%;height:430px;object-fit:cover;display:block';image.closest('.service-hero-visual').classList.remove('portrait');}
}
function all(selector,key){document.querySelectorAll(selector).forEach(node=>apply(node,key))}
const slug=location.pathname.split('/').pop().replace(/\.html$/,'');const map={'esd-flooring':'esd','dielectric-flooring':'dielectric','industrial':'industrial','commercial':'commercial','decorative':'decorative','parking':'parking','epoxy':'epoxy','pu':'pu','food-flooring':'food','textile-flooring':'textile','pharma-flooring':'pharma','automotive-flooring':'automotive','warehousing-flooring':'warehousing','chemical-flooring':'chemical','engineering-flooring':'engineering','waterproofing':'waterproofing','tank-waterproofing':'tank','roof-waterproofing':'roof','pool-waterproofing':'pool'};
if(map[slug])all('.service-hero-visual img',map[slug]);
if(location.pathname==='/'||location.pathname==='/index.html'){
for(const key of ['industrial','commercial','decorative','parking']){all('#'+key+' .service-inner>img',key);all('.hero-card[href="/services/'+key+'.html"] img',key);all('.project>a[href="/services/'+key+'.html"] img',key)}
all('#waterproofing .service-waterproofing-background svg','waterproofing');all('.project>a[href="/services/waterproofing.html"] svg','waterproofing');
for(const [page,key] of [['epoxy','epoxy'],['pu','pu'],['decorative','metallic'],['waterproofing','waterproofing']])all('.finish-tile[href="/services/'+page+'.html"] .swatch',key);
}
}catch(error){/* Preserve original photos when the saved-photo service is unavailable. */}})();

// Owner controls are added only after a server-authorized session check.
(async()=>{try{const response=await fetch('/api/photo-session',{cache:'no-store',credentials:'same-origin'});if(!response.ok)return;const session=await response.json();if(session.canEdit!==true)return;const group=document.querySelector('footer .footer-links');if(!group)return;const link=document.createElement('a');link.href='/admin';link.textContent='Manage photos ↗';link.dataset.ownerControl='photos';group.append(link);}catch(error){/* Public visitors see no management or login control. */}})();
