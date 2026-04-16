#!/usr/bin/env bash
# publish.sh — one-command publish for PNW Clinical Bodywork site.
#
# What this does:
#   1. Checks you're on main branch
#   2. Shows you any uncommitted changes
#   3. Stages everything, commits with a timestamped message
#      (or a custom message you pass as an argument)
#   4. Pushes to origin/main — which triggers the GitHub Actions
#      workflow that builds and deploys to GitHub Pages.
#
# Usage:
#   ./publish.sh                       # auto-generated commit message
#   ./publish.sh "updated hero copy"   # custom commit message

set -euo pipefail

# Colors for readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No color

# 1. Make sure we're in a git repo
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo -e "${RED}ERROR: Not in a git repository. Run 'git init' and set a remote first.${NC}"
  exit 1
fi

# 2. Make sure we're on main
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo -e "${YELLOW}You're on branch '$CURRENT_BRANCH', not 'main'.${NC}"
  read -p "Switch to main and continue? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
  fi
  git checkout main
fi

# 3. If nothing has changed, just push any unpushed commits
if git diff --quiet && git diff --cached --quiet; then
  echo -e "${YELLOW}No uncommitted changes. Pushing any existing unpushed commits...${NC}"
  git push origin main
  echo -e "${GREEN}Done. Check Actions tab on GitHub for deploy status.${NC}"
  exit 0
fi

# 4. Show what's changed
echo -e "${YELLOW}Changes to be committed:${NC}"
git status --short

# 5. Commit message: argument wins, otherwise timestamped
if [ $# -ge 1 ]; then
  MESSAGE="$1"
else
  MESSAGE="site update — $(date '+%Y-%m-%d %H:%M')"
fi

# 6. Stage and commit
git add -A
git commit -m "$MESSAGE"

# 7. Push
echo -e "${GREEN}Pushing to origin/main...${NC}"
git push origin main

echo
echo -e "${GREEN}Done.${NC} Watch the deploy here:"
REPO_URL=$(git config --get remote.origin.url | sed -e 's/\.git$//' -e 's|git@github.com:|https://github.com/|')
echo "  ${REPO_URL}/actions"
echo
echo "Once the Actions run is green, your site will be live at the Pages URL"
echo "shown in the repo Settings → Pages."
