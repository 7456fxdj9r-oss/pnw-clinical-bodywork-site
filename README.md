# PNW Clinical Bodywork — Marketing Website

Public-facing marketing site for HealingWorks / PNW Clinical Bodywork.
Target domain: `healingworkscenter.com`

Built with Vite + React + Tailwind CSS. Deploys to GitHub Pages via a GitHub Actions workflow on every push to `main`.

---

## Quick start (run these on your Mac)

**Prerequisites:** Node.js 20+, the GitHub CLI (`gh`), and git.
If you don't have them:
```bash
brew install node gh git
```

**1. Open Terminal, cd into this folder:**
```bash
cd ~/path/to/pnw-clinical-bodywork-site
```

**2. Install dependencies:**
```bash
npm install
```

**3. Run the dev server locally to confirm it works:**
```bash
npm run dev
```
Open the URL it prints (usually http://localhost:5173). You should see the site. Stop the server with Ctrl+C when you're done looking.

**4. Authenticate the GitHub CLI** (opens a browser for OAuth — no password-in-terminal):
```bash
gh auth login
```
Pick "GitHub.com" → "HTTPS" → "Login with a web browser", then follow the prompts.

**5. Create the GitHub repo and push:**
```bash
git init
git add -A
git commit -m "initial commit"
git branch -M main
gh repo create pnw-clinical-bodywork-site --private --source=. --remote=origin --push
```
This creates a **private** repo named `pnw-clinical-bodywork-site`, adds it as your remote, and pushes your code.

**6. Enable GitHub Pages:**
```bash
gh repo edit --enable-pages --pages-branch main
```
Or in the browser: open the repo → Settings → Pages → Source: "GitHub Actions".

**7. Watch the deploy:**
```bash
gh run watch
```
When it finishes, the Actions run prints your live URL (something like `https://YOUR-USERNAME.github.io/pnw-clinical-bodywork-site/`).

**IMPORTANT:** Because you're using a subpath URL (not yet a custom domain), open `vite.config.js` and change `base: '/'` to `base: '/pnw-clinical-bodywork-site/'`. Then run `./publish.sh` to redeploy. (If you go with a custom domain instead — see below — leave `base: '/'` alone.)

---

## Future updates — one command

After the initial push, publishing future changes is a single command:
```bash
./publish.sh
```
Or with a custom commit message:
```bash
./publish.sh "updated services section"
```
The script checks you're on main, commits any changes with a timestamp, pushes, and the GitHub Actions workflow deploys the site automatically. (On first run after extracting, you may need to run `chmod +x publish.sh`.)

---

## Connecting `healingworkscenter.com`

When you're ready for the custom domain:

1. In the GitHub repo, go to **Settings → Pages → Custom domain**. Enter `healingworkscenter.com` and save.
2. GitHub will show you the required DNS records. At your domain registrar (where you bought `healingworkscenter.com`), add these records:
   - **A records** for `@` pointing to:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - **CNAME** for `www` pointing to `YOUR-USERNAME.github.io`
3. Back in `vite.config.js`, confirm `base: '/'` (not a subpath).
4. Run `./publish.sh` to redeploy.
5. DNS can take 5 minutes to a few hours to propagate. GitHub will auto-issue an SSL certificate once DNS resolves.

---

## Future: moving to Cloudflare

You mentioned you'll eventually use Cloudflare. When you're ready, you have two options:

**Option A — Keep GitHub Pages, use Cloudflare for DNS only.**
When you connect `healingworkscenter.com`, add the A records + CNAME at Cloudflare. Two gotchas:
- Start with records set to **"DNS only" (gray cloud ☁️)** — not proxied. The orange cloud causes SSL handshake errors with GitHub Pages until you also configure SSL correctly.
- If you later want the orange cloud (for CDN, firewall, analytics), set Cloudflare **SSL/TLS mode to "Full (strict)"** in the SSL/TLS section. Flexible or Full (non-strict) will cause redirect loops.

**Option B — Migrate hosting to Cloudflare Pages.**
Cloudflare Pages connects to the same GitHub repo you already have, auto-builds on every push, gives you a free `*.pages.dev` URL immediately, and one-click custom domain since Cloudflare already runs your DNS. You'd keep `publish.sh` exactly as-is — it just pushes to GitHub, and Cloudflare Pages sees the push and deploys. You can also delete the `.github/workflows/deploy.yml` file at that point since Cloudflare handles the build.

Setup for Option B (do not run yet — just notes):
1. Cloudflare dashboard → Pages → Create a project → Connect to Git → pick the repo.
2. Build settings: Framework preset "Vite", build command `npm run build`, output directory `dist`.
3. After first deploy, add `healingworkscenter.com` under Custom domains in the Pages project.

Either option is fine. Option A is less change; Option B gets you on a faster edge network and simpler custom-domain handling.

---

## What's in this repo

```
.
├── .github/workflows/deploy.yml   # Auto-deploy on push to main
├── .gitignore
├── README.md                       # This file
├── index.html                      # HTML entry point
├── package.json                    # Dependencies + scripts
├── postcss.config.js               # PostCSS (Tailwind pipeline)
├── publish.sh                      # One-command publish script
├── src/
│   ├── App.jsx                     # The website component
│   ├── index.css                   # Tailwind directives + base styles
│   └── main.jsx                    # React entry point
├── tailwind.config.js              # Tailwind config
└── vite.config.js                  # Vite build config
```

---

## The website content — what's already there

- Fixed nav (Home / Services / About Glen / Insurance / Blog / Book Now)
- Hero: "Stop managing the pain and start fixing the cause."
- Pain-point section (3 cards)
- About Glen section (therapist bio)
- Services grid (4 clinical services)
- PIP/auto-accident claim CTA + $25 referral program
- Footer (Vancouver, WA address, hours, 4-appt/day cap)

**Placeholders that need real content:**
- Phone number (`(360) 555-0123` is a placeholder)
- Headshot image (currently using an Unsplash stock photo)
- Hero photo (currently Unsplash stock)
- Booking system integration (the "Book Now" buttons don't link anywhere yet)

You can update these in `src/App.jsx` directly, or we can wire up a headless CMS later.

---

## Important: scope of this repo

This repo is for the **public marketing website only**.

The *PNW Clinical Bodywork Platform* (internal SOAP notes / intake / billing React app Gemini also generated) is a separate project that:
- Handles Protected Health Information (PHI)
- Requires HIPAA-compliant hosting with a Business Associate Agreement (BAA)
- Must **NOT** be deployed via GitHub Pages

Keep it in a separate private repo for version control, but deploy it only to a HIPAA-eligible host (AWS, Azure, or a specialized medical host). That's a separate setup conversation.
