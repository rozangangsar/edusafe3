#!/bin/bash

# EduSafe - Push to Deployment Repository Script
# Usage: ./push-to-deploy.sh [username]
# Example: ./push-to-deploy.sh rozan

set -e

echo "================================================"
echo "EduSafe - Deploy Repository Push Script"
echo "================================================"
echo ""

# Get GitHub username from argument or prompt
if [ -z "$1" ]; then
    read -p "Enter your GitHub username: " GITHUB_USERNAME
else
    GITHUB_USERNAME=$1
fi

REPO_URL="https://github.com/${GITHUB_USERNAME}/edusafe-deploy.git"

echo "Using repository: $REPO_URL"
echo ""

# Check if remote exists
if git remote | grep -q "^deploy$"; then
    echo "✓ Deploy remote already exists"
    EXISTING_URL=$(git remote get-url deploy)
    if [ "$EXISTING_URL" != "$REPO_URL" ]; then
        echo "⚠ Updating deploy remote URL..."
        git remote set-url deploy "$REPO_URL"
    fi
else
    echo "→ Adding deploy remote..."
    git remote add deploy "$REPO_URL"
fi

echo ""
echo "Current git remotes:"
git remote -v
echo ""

# Verify working directory is clean
if ! git diff-index --quiet HEAD --; then
    echo "⚠ Warning: You have uncommitted changes"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled."
        exit 1
    fi
fi

echo ""
echo "Which branch do you want to push?"
echo "1. main (direct push)"
echo "2. Create new branch 'deploy-ready' (safer)"
echo ""
read -p "Choose (1 or 2): " CHOICE

case $CHOICE in
    1)
        echo ""
        echo "→ Pushing main branch to deploy remote..."
        git push deploy main
        echo "✓ Successfully pushed to $REPO_URL"
        ;;
    2)
        echo ""
        BRANCH_NAME="deploy-ready"
        echo "→ Creating branch '$BRANCH_NAME'..."
        git checkout -b "$BRANCH_NAME" 2>/dev/null || git checkout "$BRANCH_NAME"

        echo "→ Pushing to deploy remote..."
        git push deploy "$BRANCH_NAME:main"
        echo "✓ Successfully pushed '$BRANCH_NAME' as 'main' to $REPO_URL"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "================================================"
echo "✓ Deployment repository updated!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Go to: $REPO_URL"
echo "2. Verify files are there (apps/, package.json, etc)"
echo "3. Configure Vercel deployment"
echo ""
