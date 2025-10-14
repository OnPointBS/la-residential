#!/bin/bash

echo "🚀 Setting up LA Residential Website..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Setting up Convex..."
echo "Please follow these steps:"
echo "1. Run 'npx convex dev' in a separate terminal"
echo "2. When prompted, choose 'new' project"
echo "3. Select 'personal' for team"
echo "4. Name your project 'la-residential'"
echo "5. Copy the generated URL to .env.local"
echo ""
echo "🔐 Setting up Clerk (optional for now):"
echo "1. Go to https://clerk.com and create an account"
echo "2. Create a new application"
echo "3. Copy the keys to .env.local"
echo ""
echo "🌐 Starting development server..."
echo "The app will show a setup page until Convex is configured."

npm run dev