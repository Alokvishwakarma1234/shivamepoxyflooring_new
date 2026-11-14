from pathlib import Path
import shutil,json
root=Path(__file__).resolve().parents[1];dist=root/'dist';client=dist/'client';server=dist/'server';client.mkdir(exist_ok=True);server.mkdir(exist_ok=True)
# Move the existing static site into the Worker asset directory without changing its URLs.
for p in list(dist.iterdir()):
 if p.name in ['client','server','.openai']:continue
 target=client/p.name
 if target.exists():
  if target.is_dir():shutil.rmtree(target)
  else:target.unlink()
 shutil.move(str(p),target)
(client/'photo-content.js').write_text((root/'worker/photo-content.js').read_text())
for name in ['compliance.js','compliance.css']:(client/name).write_text((root/'worker'/name).read_text())
# Build a single ESM Worker, avoiding runtime module-resolution dependencies.
photos=(root/'worker/photos.js').read_text().replace('export const slots','const slots').replace('export function authorized','function authorized').replace('export async function photoManifest','async function photoManifest').replace('export async function photoRoute','async function photoRoute')
admin=(root/'worker/admin.js').read_text().replace('export const adminHTML','const adminHTML')
entry=(root/'worker/index.js').read_text();entry='\n'.join(line for line in entry.splitlines() if not line.startswith('import '))
source_download=(root/'worker/source-download.js').read_text().replace('export const sourceArchiveBase64','const sourceArchiveBase64')
(server/'index.js').write_text(photos+'\n'+admin+'\n'+source_download+'\n'+entry)
manifest=json.loads((root/'.openai/hosting.json').read_text());manifest.pop('static',None);manifest['r2']='BUCKET';(root/'.openai/hosting.json').write_text(json.dumps(manifest,indent=2)+'\n');(dist/'.openai').mkdir(exist_ok=True);(dist/'.openai/hosting.json').write_text(json.dumps(manifest,indent=2)+'\n')
wrangler={'name':'shivam-flooring','main':'index.js','compatibility_date':'2026-01-01','assets':{'directory':'../client','binding':'ASSETS','run_worker_first':True}}
(server/'wrangler.json').write_text(json.dumps(wrangler,indent=2))
print('Built Worker, static website assets, authenticated photo manager and persistent R2 photo storage.')
