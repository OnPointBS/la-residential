# LA Residential Website

A modern, SEO-optimized website for LA Residential, a home construction company. Built with Next.js 14, Convex backend, and Tailwind CSS.

## Features

### Public Website
- **Homepage**: Hero section, featured homes, company overview, and contact CTA
- **Available Homes**: Grid listing with search and filter functionality
- **Home Detail Pages**: Comprehensive home information with image galleries, floor plans, and contact forms
- **Floor Plans**: Browse and download floor plan PDFs
- **About Us**: Company story, team information, and values
- **Contact**: Contact form, company information, and FAQ

### Admin Panel (Protected)
- **Dashboard**: Overview of homes, inquiries, and quick actions
- **Homes Management**: CRUD operations for home listings
- **Floor Plans Management**: Manage floor plan library
- **Image Management**: Upload and organize property images
- **Inquiries**: View and manage contact form submissions
- **Settings**: Company information and SEO settings

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Backend**: Convex (real-time database and file storage)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Authentication**: Clerk (admin panel)
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Convex Configuration
NEXT_PUBLIC_CONVEX_URL=your_convex_url_here

# Clerk Authentication (for admin panel)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/admin/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/admin/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/admin
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/admin
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Convex

```bash
npx convex dev
```

This will:
- Create a Convex project
- Generate the database schema
- Provide you with the Convex URL for your environment variables

### 4. Setup Clerk Authentication

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy the publishable key and secret key to your environment variables
4. Configure the sign-in and sign-up URLs as shown above

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the website.

## Database Schema

The application uses the following Convex tables:

- **homes**: Home listings with specifications, images, and status
- **floorPlans**: Floor plan library with PDFs and images
- **homeImages**: Image associations for homes
- **inquiries**: Contact form submissions
- **settings**: Company information and configuration

## Admin Panel Access

The admin panel is protected by Clerk authentication. To access:

1. Go to `/admin/sign-in`
2. Sign up with your email
3. Access the dashboard at `/admin`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Convex Deployment

```bash
npx convex deploy
```

## File Structure

```
src/
├── app/
│   ├── (public)/          # Public website pages
│   │   ├── page.tsx       # Homepage
│   │   ├── homes/         # Home listings and details
│   │   ├── floor-plans/   # Floor plan listings and details
│   │   ├── about/         # About page
│   │   └── contact/       # Contact page
│   ├── admin/             # Admin panel (protected)
│   └── layout.tsx         # Root layout
├── components/
│   ├── public/            # Public website components
│   └── admin/             # Admin panel components
└── lib/                   # Utilities and constants

convex/
├── schema.ts              # Database schema
├── homes.ts               # Home queries and mutations
├── floorPlans.ts          # Floor plan queries and mutations
├── inquiries.ts           # Inquiry queries and mutations
├── settings.ts            # Settings queries and mutations
└── files.ts               # File storage utilities
```

## SEO Features

- Dynamic meta tags for each page
- Open Graph and Twitter Card support
- Structured data (Schema.org)
- Sitemap generation
- Image optimization
- Fast loading times

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software for LA Residential.