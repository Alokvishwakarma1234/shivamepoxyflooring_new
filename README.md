# Shivam Epoxy Flooring

SHIVAM EPOXY FLOORING — SOURCE HANDOVER
Export date: 14 November 2026

This archive contains the current new website source and bundled web assets.
It is not the old Hostinger website.

Folders:
- dist/client: 29 HTML pages, CSS/JS, optimised images, local fonts/license,
  brochure and compliance audit PDF/text.
- worker: Cloudflare Worker source, photo API, owner-only photo manager,
  saved-photo loader and consent controls.
- scripts/build-photo-site.py: build script (Python 3, standard library only).
- dist/server: generated Worker entrypoint and deployment configuration.
- .openai/hosting.json: current Sites project identity and R2 binding declaration.

Rebuild from the extracted project root:
  python3 scripts/build-photo-site.py

Runtime:
The site currently runs on ChatGPT Sites / Cloudflare Workers with an R2
bucket bound as BUCKET and an assets binding ASSETS. It is not WordPress.
Static HTML can be served independently, but /admin, /api/photos and /media
require the Worker and persistent R2 storage.

IMPORTANT AUTHENTICATION:
Owner access currently depends on verified platform-injected
'oai-authenticated-user-id' and 'oai-authenticated-user-email' headers.
The owner email is configured in worker/photos.js. If moving outside Sites,
replace this with secure server-side authentication. Do not trust arbitrary
client-supplied copies of these headers. Do not deploy the photo manager on
another host until authentication has been correctly replaced and tested.
Vercel/Hostinger deployment requires adaptation for server routes, storage,
and identity; uploading only the HTML does not reproduce the full system.

DATA NOT INCLUDED:
Git history/credentials, account passwords, provider secrets, live R2 photo
uploads/settings, hosting logs, and the old website database are not included.
Runtime photos saved via Photo Manager need a separate authenticated export
if any exist. Default photos bundled with this source ARE included.

DOMAIN:
Custom domain setup is pending DNS verification. This source export does
not change DNS or connect shivamepoxyflooring.com. Preserve email DNS records.

BUSINESS REVIEW:
Unconfirmed business constitution, enquiry retention, B2B DLP/liability and
provider cookie/retention particulars remain placeholders. Read the audit.
Verify quotation/warranty terms with a lawyer and tax/records with a CA.
Image permissions and remaining illustrative imagery require owner review.

Generated admin markup is worker/admin.js. Edit its adminHTML string carefully.
Build does not require the separate temporary authoring files used during design.
Keep this source archive private; do not publish it as a public website asset.

This GitHub repository is a source handover/snapshot. The existing Sites hosting repository remains unchanged; automatic synchronization from Sites to GitHub is not configured.

## Vercel static deployment

Import this repository with Root Directory set to the repository root.
`vercel.json` serves `dist/client` as the static output; no build is required.
Clean URLs serve the existing HTML service and policy pages.

This makes the public website available on Vercel. It does not migrate the
Cloudflare Worker/R2 backend or ChatGPT Sites identity. Owner Photo Manager,
persistent photo uploads and owner source download are unavailable on Vercel
until secure authentication, API routes and durable storage are implemented.
The default bundled photos remain available. The current saved-photo loader
fails gracefully and retains defaults if the API is unavailable. Do not expose
owner pages or trust client-supplied identity headers as a workaround.

WhatsApp contact and cookie controls are browser-side and remain available.
Do not put worker/server source or archive assets inside the public output.
