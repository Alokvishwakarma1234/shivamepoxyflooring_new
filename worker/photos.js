export const slots = {
 industrial:{label:'Industrial flooring',defaultUrl:'/assets/industrial-shivam-grey.webp',alt:'Industrial epoxy flooring'},
 commercial:{label:'Commercial flooring',defaultUrl:'/assets/industrial-shivam-white.webp',alt:'Commercial seamless flooring'},
 decorative:{label:'Residential & decorative flooring',defaultUrl:'/assets/decorative-shivam.webp',alt:'Decorative flooring'},
 parking:{label:'Parking & ramps',defaultUrl:'/assets/parking-shivam.webp',alt:'Parking floor with route markings'},
 waterproofing:{label:'Waterproofing overview',defaultUrl:'/assets/waterproofing-shivam-roof.webp',alt:'Tank, pool and roof waterproofing'},
 food:{label:'Food-processing flooring',defaultUrl:'/assets/industrial-shivam-blue.webp',alt:'Food-processing epoxy/PU flooring'},
 epoxy:{label:'Epoxy flooring finish',defaultUrl:'/assets/industrial-shivam-grey.webp',alt:'Epoxy flooring'},
 pu:{label:'PU flooring finish',defaultUrl:'/assets/industrial-shivam-green.webp',alt:'Industrial flooring'},
 metallic:{label:'Metallic / Italian-style finish',defaultUrl:'/assets/decorative-shivam.webp',alt:'Decorative floor with flowing accents'},
 tank:{label:'Tank waterproofing',defaultUrl:'/assets/waterproofing-shivam-roof.webp',alt:'Tank waterproofing reference'},
 roof:{label:'Roof waterproofing',defaultUrl:'/assets/waterproofing-shivam-roof.webp',alt:'Roof waterproofing reference'},
 pool:{label:'Swimming pool waterproofing',defaultUrl:'/assets/waterproofing-shivam-roof.webp',alt:'Swimming pool waterproofing reference'}
};
slots.textile={label:'Textile & garment',defaultUrl:'/assets/industrial-shivam-grey.webp',alt:'Textile flooring reference'};
slots.pharma={label:'Pharmaceutical',defaultUrl:'/assets/industrial-shivam-light.webp',alt:'Pharmaceutical flooring reference'};
slots.automotive={label:'Automotive',defaultUrl:'/assets/industrial-shivam-green.webp',alt:'Automotive flooring reference'};
slots.warehousing={label:'Warehousing & logistics',defaultUrl:'/assets/industrial-shivam-grey.webp',alt:'Warehouse floor'};
slots.chemical={label:'Chemical industry',defaultUrl:'/assets/industrial-shivam-grey.webp',alt:'Chemical industry flooring reference'};
slots.engineering={label:'Engineering & manufacturing',defaultUrl:'/assets/industrial-shivam-grey.webp',alt:'Industrial flooring'};
slots.esd={label:'ESD flooring',defaultUrl:'/assets/industrial-shivam-grey.webp',alt:'ESD flooring reference'};
slots.dielectric={label:'Dielectric flooring',defaultUrl:'/assets/industrial-shivam-grey.webp',alt:'Dielectric flooring reference'};
const OWNER_EMAIL='shivamvish901@outlook.com';
const signin='/signin-with-chatgpt?return_to=%2Fadmin';
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export function authorized(request){return Boolean(request.headers.get('oai-authenticated-user-id'))&&request.headers.get('oai-authenticated-user-email')?.toLowerCase()===OWNER_EMAIL;}
function safeWrite(request){return request.headers.get('Origin')===new URL(request.url).origin;}
export async function photoManifest(env){const list=await env.BUCKET.list({prefix:'settings/photos/'});const photos={};await Promise.all(list.objects.map(async item=>{const slot=item.key.split('/').pop();if(slots[slot]){const object=await env.BUCKET.get(item.key);if(object)photos[slot]=await object.json();}}));return photos;}
export async function photoRoute(request,env){
 const url=new URL(request.url),path=url.pathname;
 if(path==='/api/photo-session')return json({canEdit:authorized(request),signInUrl:signin});
 if(path==='/api/photos'&&request.method==='GET'){if(!env.BUCKET)return json({error:'Photo storage is unavailable.'},503);return json({slots,photos:await photoManifest(env)});}
 if(path.startsWith('/media/')){
  if(!['GET','HEAD'].includes(request.method))return json({error:'Method not allowed.'},405);
  const key=path.slice(7);if(!/^photos\/[a-z-]+\/[a-f0-9-]+\.(jpg|png|webp|gif)$/.test(key))return new Response('Not found',{status:404});
  const object=await env.BUCKET.get(key);if(!object)return new Response('Not found',{status:404});
  const headers=new Headers();object.writeHttpMetadata(headers);headers.set('Cache-Control','public, max-age=300, must-revalidate');headers.set('X-Content-Type-Options','nosniff');return new Response(request.method==='HEAD'?null:object.body,{headers});
 }
 if(path.startsWith('/api/photos/')){
  if(!['PUT','DELETE'].includes(request.method))return json({error:'Method not allowed.'},405);
  if(!authorized(request))return json({error:'Only the website owner can edit photos.',signInUrl:signin},request.headers.has('oai-authenticated-user-id')?403:401);
  if(!safeWrite(request))return json({error:'Open the photo manager on this website before saving.'},403);
  if(!env.BUCKET)return json({error:'Photo storage is unavailable.'},503);
  const slot=path.split('/').pop();if(!slots[slot])return json({error:'Unknown photo position.'},404);
  if(request.method==='DELETE'){const previousObject=await env.BUCKET.get('settings/photos/'+slot);const previous=previousObject?await previousObject.json():null;if(previous?.url?.startsWith('/media/photos/'+slot+'/'))await env.BUCKET.delete(previous.url.slice(7));await env.BUCKET.delete('settings/photos/'+slot);return json({ok:true});}
  if(request.headers.get('X-Photo-Permission')!=='confirmed')return json({error:'Confirm your permission to publish this photo before uploading.'},400);const max=8*1024*1024;const length=Number(request.headers.get('Content-Length'));if(length>max)return json({error:'Choose an image smaller than 8 MB.'},413);
  const types={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif'};const type=request.headers.get('Content-Type')?.split(';')[0];if(!types[type])return json({error:'Use a JPG, PNG, WebP or GIF photo.'},415);
  const reader=request.body?.getReader();if(!reader)return json({error:'Choose a photo first.'},400);const chunks=[];let size=0;while(true){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>max){await reader.cancel();return json({error:'Choose an image smaller than 8 MB.'},413)}chunks.push(part.value)}if(!size)return json({error:'Choose a photo first.'},400);const joined=new Uint8Array(size);let position=0;for(const chunk of chunks){joined.set(chunk,position);position+=chunk.length}const data=joined.buffer;
  const b=new Uint8Array(data),str=(n,k)=>String.fromCharCode(...b.slice(n,n+k));const matches=(type==='image/jpeg'&&b[0]===255&&b[1]===216&&b[2]===255)||(type==='image/png'&&b[0]===137&&str(1,3)==='PNG')||(type==='image/webp'&&str(0,4)==='RIFF'&&str(8,4)==='WEBP')||(type==='image/gif'&&str(0,3)==='GIF');if(!matches)return json({error:'The file does not match its image format.'},415);
  const previousObject=await env.BUCKET.get('settings/photos/'+slot);const previous=previousObject?await previousObject.json():null;const alt=(url.searchParams.get('alt')||slots[slot].alt).trim().slice(0,200);const key='photos/'+slot+'/'+crypto.randomUUID()+'.'+types[type];
  await env.BUCKET.put(key,data,{httpMetadata:{contentType:type}});const photo={url:'/media/'+key,alt:alt||slots[slot].alt,updatedAt:new Date().toISOString(),publicationPermissionConfirmed:true};await env.BUCKET.put('settings/photos/'+slot,JSON.stringify(photo),{httpMetadata:{contentType:'application/json'}});if(previous?.url?.startsWith('/media/photos/'+slot+'/'))await env.BUCKET.delete(previous.url.slice(7));return json({ok:true,photo});
 }
 return null;
}
