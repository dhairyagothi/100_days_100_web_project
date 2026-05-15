# Deployment Guide

The **100 Days 100 Web Projects** repository has been migrated to Next.js 15, which makes deploying it incredibly simple using Vercel or any other hosting provider that supports Node.js or static exports.

## Deploying to Vercel (Recommended)

Vercel is the creator of Next.js and provides the most seamless deployment experience.

1. **Push your code to GitHub:**
   Ensure your latest changes are pushed to your `main` branch.

2. **Import Project into Vercel:**
   - Log in to [Vercel](https://vercel.com/).
   - Click **Add New** > **Project**.
   - Connect your GitHub account and select the `100_days_100_web_project` repository.

3. **Configure Project:**
   - Framework Preset: `Next.js` (Vercel should auto-detect this).
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Install Command: `npm install`

4. **Deploy:**
   Click **Deploy**. Vercel will automatically build the Next.js application and provide you with a live URL.

## Deploying as a Static Site (GitHub Pages / Netlify)

If you wish to deploy the project as a static site without server-side rendering features:

1. Update your `next.config.ts` to enable static exports:
   ```typescript
   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     output: "export",
     images: {
       unoptimized: true,
     }
   };

   export default nextConfig;
   ```

2. Run the build command:
   ```bash
   npm run build
   ```

3. Next.js will generate an `out` folder containing the static HTML/CSS/JS assets. You can upload this `out` folder directly to GitHub Pages, Netlify, or any static hosting service.
