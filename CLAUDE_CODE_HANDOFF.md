# Claude Code handoff — PNW Clinical Bodywork site

**Goal:** Get a live GitHub Pages URL Craig can send to his client as a rough-draft preview.

## Step 1 — Install Claude Code on your Mac

Open Terminal (⌘+Space, type "Terminal", hit Enter), then run:

```bash
brew install --cask claude-code
```

(If you don't have Homebrew: run `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"` first.)

Alternative: download from https://claude.com/product/claude-code

## Step 2 — Find the project folder on your Mac

The project has already been saved directly into your **Glen Arn** folder. You should see a subfolder called `pnw-clinical-bodywork-site` inside it — no copying needed.

## Step 3 — Start Claude Code in the project folder

In Terminal (adjust the path if your Glen Arn folder is somewhere other than Desktop):

```bash
cd "~/Desktop/Glen Arn/pnw-clinical-bodywork-site"
claude
```

If that path doesn't work, in Finder locate the `pnw-clinical-bodywork-site` folder inside your Glen Arn folder, then drag it onto the Terminal window *after* typing `cd ` (with a space) — Terminal will auto-fill the correct path. Press Enter, then run `claude`.

## Step 4 — Paste this prompt

Copy everything in the box below (from the line after `--- START PROMPT ---` to the line before `--- END PROMPT ---`) and paste it as your first message to Claude Code.

--- START PROMPT ---

I'm Craig, the owner of Crave Optimal Health. I'm publishing the public marketing website for **PNW Clinical Bodywork** (client: Glen Arn) to GitHub Pages so I can send my client a preview URL.

This folder is already fully scaffolded: Vite + React + Tailwind, complete App.jsx, GitHub Actions deploy workflow, and a publish.sh script. You do NOT need to scaffold anything — everything's set up.

Please do the following, and pause for my confirmation before any step that writes outside this folder or touches my GitHub account:

1. **Verify the project builds cleanly.** Run:
   - `npm install`
   - `npm run build`
   Confirm `dist/` is created with no errors. If there are warnings, tell me what they are but proceed.

2. **Run the dev server briefly** with `npm run dev` so I can open the URL and sanity-check the page renders. Wait for my "looks good" before continuing. Stop the dev server.

3. **Initialize git locally:**
   - `git init`
   - `git add -A`
   - `git commit -m "initial commit"`
   - `git branch -M main`

4. **Check if the GitHub CLI is installed and authenticated:**
   - `gh --version` — if missing, ask me and I'll install with `brew install gh`.
   - `gh auth status` — if not logged in, tell me to run `gh auth login` myself (it opens a browser — I'll complete OAuth there, not in Terminal). Wait until I confirm I'm authenticated before continuing.

5. **Create a PRIVATE GitHub repo and push:**
   ```
   gh repo create pnw-clinical-bodywork-site --private --source=. --remote=origin --push
   ```
   Confirm the repo URL it prints.

6. **Enable GitHub Pages** via the `actions` source so our deploy.yml workflow runs:
   ```
   gh api --method POST /repos/{owner}/{repo}/pages -f "build_type=workflow"
   ```
   If that errors because Pages is already on, ignore and continue.

7. **Watch the deploy** run and wait for it to finish:
   ```
   gh run watch
   ```

8. **Report the live URL.** Fetch the deployed Pages URL and print it clearly so I can copy-paste it to my client:
   ```
   gh api /repos/{owner}/{repo}/pages --jq .html_url
   ```

## Important constraints
- This repo is for the **public marketing site only**. Nothing HIPAA-related. If I ever ask you to add patient data handling, tell me it belongs in a separate project with HIPAA-compliant hosting.
- **This site is still in beta.** I am NOT ready for a custom domain yet. Do NOT:
  - Add a CNAME file
  - Touch `healingworkscenter.com` DNS
  - Configure custom domain in the GitHub Pages settings
  - Suggest Cloudflare setup
  The default `https://USERNAME.github.io/pnw-clinical-bodywork-site/` URL is exactly what I want for now — I'll tell you when I'm ready for the custom domain later.
- Keep the repo **private** for now (client preview only).
- Don't install global npm packages without asking.
- If any step fails, tell me what the error was before retrying.

Start with step 1.

--- END PROMPT ---

## What you'll do outside Claude Code

The only thing you'll do yourself is:
- **Run `gh auth login`** when Claude Code asks you to. This opens github.com in your browser. Log in as usual, approve the auth, come back to Terminal and tell Claude Code you're done.

That's it. Don't paste any GitHub password, token, or SSH key into the Terminal or into Claude Code — `gh auth login` handles all of that securely through a browser OAuth flow.

## After you have the live URL

Text/email the URL to your client for a preview. The site will look like a subpath URL (e.g., `https://YOUR-USERNAME.github.io/pnw-clinical-bodywork-site/`). That's fine for a draft preview.

For future edits:
- Open the folder in Claude Code again (`cd ~/Documents/pnw-clinical-bodywork-site && claude`)
- Tell it what to change
- When done, tell it "publish" — it'll run `./publish.sh` and the site updates in ~60 seconds.

## If something goes wrong

Common stumbles:
- **"gh: command not found"** → `brew install gh` then rerun the step
- **"Permission denied" on publish.sh** → `chmod +x publish.sh` then rerun
- **Blank page at the live URL** → the `base` in `vite.config.js` should be `./`. If the build was done before that fix was in place, redo step 1 and push again.
- **Pages is "building" forever** → open the repo on github.com → Actions tab → click the latest run to see the real error message
