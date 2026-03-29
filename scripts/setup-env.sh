#!/bin/bash

# scripts/setup-env.sh
# This script syncs environment variables from .env.local to Vercel and GitHub Secrets.
# Requirements: Vercel CLI (vercel) and GitHub CLI (gh) must be installed and authenticated.

# 1. Locate .env.local
if [ -f ".env.local" ]; then
  ENV_FILE=".env.local"
elif [ -f "client/.env.local" ]; then
  ENV_FILE="client/.env.local"
else
  echo "❌ Error: .env.local not found in root or client/ folder."
  echo "Please create a .env.local file with your secrets first."
  exit 1
fi

echo "🚀 Starting environment sync from: $ENV_FILE"

# 2. Check CLI Authentication
if ! command -v gh &> /dev/null; then
  echo "❌ Error: GitHub CLI (gh) is not installed."
  echo "Please install it from: https://cli.github.com/ and run 'gh auth login' first."
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "❌ Error: GitHub CLI (gh) is not authenticated. Run 'gh auth login' first."
  exit 1
fi

# We use npx for vercel to avoid requiring global installation
if ! npx vercel whoami >/dev/null 2>&1; then
  echo "❌ Error: Vercel CLI is not authenticated. Run 'npx vercel login' first."
  exit 1
fi

# 3. Define Sync Functions
sync_github() {
  local key=$1
  local value=$2
  
  if gh secret list | grep -q "^$key[[:space:]]"; then
    echo "⚠️  Warning: GitHub Secret '$key' already exists. Skipping..."
  else
    printf "%s" "$value" | gh secret set "$key"
    if [ $? -eq 0 ]; then
      echo "✅ Success: Added '$key' to GitHub Secrets."
    else
      echo "❌ Failed: Could not add '$key' to GitHub."
    fi
  fi
}

sync_vercel() {
  local key=$1
  local value=$2
  
  # Check if exists in Vercel (using grep for exact name match)
  if npx vercel env ls | grep -w "$key" >/dev/null 2>&1; then
     echo "⚠️  Warning: Vercel Env '$key' already exists. Skipping..."
  else
     # Add to all 3 environments
     # We use printf to avoid adding newlines to the secret value
     printf "%s" "$value" | npx vercel env add "$key" production >/dev/null 2>&1
     printf "%s" "$value" | npx vercel env add "$key" preview >/dev/null 2>&1
     printf "%s" "$value" | npx vercel env add "$key" development >/dev/null 2>&1
     
     if [ $? -eq 0 ]; then
       echo "✅ Success: Added '$key' to Vercel (Production, Preview, Development)."
     else
       echo "❌ Failed: Could not add '$key' to Vercel."
     fi
  fi
}

# 4. Process Environment File
# We use a temp file to handle potential CRLF issues on Windows
grep -v '^#' "$ENV_FILE" | grep -v '^[[:space:]]*$' > .env.tmp

while IFS='=' read -r key value; do
  # Trim whitespace
  key=$(echo "$key" | xargs)
  value=$(echo "$value" | xargs)
  
  # Remove surrounding quotes if they exist
  value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
  
  if [ -n "$key" ]; then
    sync_github "$key" "$value"
    sync_vercel "$key" "$value"
  fi
done < .env.tmp

rm .env.tmp

echo "🏁 Environment sync complete!"
