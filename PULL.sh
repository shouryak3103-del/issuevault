#!/bin/bash
# Run this in Replit terminal to cleanly pull issuevault repo
echo "🔄 Syncing issuevault..."

# Stash any local changes
git stash

# Fetch latest
git fetch origin main

# Hard reset to remote — our repo always wins
git reset --hard origin/main

# Clean up untracked files
git clean -fd

echo "✅ Done! Run: npm install && npm run dev"
