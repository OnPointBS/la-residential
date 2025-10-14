# Quick Setup Guide

## 🚀 Get the App Running Locally

The app is currently running at **http://localhost:3000** but needs configuration to work fully.

### Step 1: Configure Convex (Required)

1. **Open a new terminal** and run:
   ```bash
   cd "/Users/suetongmacmini/Desktop/Furr Construction/la-residential"
   npx convex dev
   ```

2. **Follow the prompts:**
   - Choose "new" project
   - Select "personal" for team
   - Name your project "la-residential"
   - Choose "cloud" for deployment

3. **Copy the generated URL** (looks like `https://happy-animal-123.convex.cloud`) and add it to `.env.local`:
   ```env
   NEXT_PUBLIC_CONVEX_URL=https://your-convex-url-here.convex.cloud
   ```

4. **Restart the dev server** (Ctrl+C and `npm run dev`)

### Step 2: Configure Clerk (Optional for testing)

For the admin panel to work:

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Copy the keys to `.env.local`:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
   CLERK_SECRET_KEY=your_secret_key
   ```

## 🎯 What You Can Test

### Without Configuration:
- ✅ Static pages (Home, About, Contact)
- ✅ Navigation and layout
- ✅ Responsive design

### With Convex Only:
- ✅ All static features
- ✅ Contact forms (will store inquiries)
- ✅ Dynamic content loading

### With Full Setup:
- ✅ Everything above
- ✅ Admin panel access
- ✅ Content management
- ✅ User authentication

## 🔧 Troubleshooting

**App shows "Configuration Required":**
- Convex URL is missing from `.env.local`
- Run `npx convex dev` and copy the URL

**Admin panel doesn't work:**
- Clerk keys are missing
- Create a Clerk account and add keys to `.env.local`

**Database errors:**
- Make sure Convex is running (`npx convex dev`)
- Check that the URL in `.env.local` is correct

## 📱 Current Status

The app is **running locally** at http://localhost:3000 and will show a setup page until Convex is configured. Once configured, you'll see the full LA Residential website with all features!