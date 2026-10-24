# CODELIX — Building Digital Solutions

High-Impact Web Development & Custom Digital Systems platform by CODELIX.

## 🚀 GitHub Pages Deployment Guide

When deployed to GitHub Pages (e.g. `https://<username>.github.io/<repo-name>/`), this application works out of the box with zero blank-screen issues.

### Why the White Screen Occurred & How It Was Resolved:
1. **Relative Asset Base (`base: './'`)**:
   Standard Vite builds default to `/assets/...`, which resolves to the domain root (`https://<username>.github.io/assets/...`) instead of your repository subdirectory (`https://<username>.github.io/<repo-name>/assets/...`), resulting in 404s and a blank screen. Configured `base: './'` in `vite.config.ts` so all assets are linked relatively.
2. **Jekyll Processing Disabled (`.nojekyll`)**:
   Added `.nojekyll` in the `public/` folder so GitHub Pages doesn't ignore or mangle underscored files or assets.
3. **SPA Path Redirection (`404.html`)**:
   Added `public/404.html` to automatically redirect any direct route visits or browser refreshes into the SPA hash router.
4. **Resilient Client-Side API Fallback Engine**:
   Because GitHub Pages is a static host without a Node/Express backend, an automatic client-side database interceptor (`src/utils/clientApiFallback.ts`) handles `/api/*` requests in static mode with full persistent state (Pakistani Banks, USDT Crypto wallets, 1 USD = 271 PKR conversion, Targeted Coupons, Newsletter subscription, and Admin CMS).

---

### Step-by-Step GitHub Pages Deployment:

#### Method 1: Using GitHub Actions (Recommended)
1. Push your repository to GitHub.
2. In your repository on GitHub, go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Use the standard **Static HTML** or **Node.js** workflow with `npm run build` and publish the `dist` directory.

#### Method 2: Manual Deploy with `gh-pages`
```bash
# 1. Install gh-pages
npm install -D gh-pages

# 2. Build the production bundle
npm run build

# 3. Publish to the gh-pages branch
npx gh-pages -d dist
```

4. Go to repository **Settings** > **Pages** and verify the source is set to the `gh-pages` branch (`/ (root)`).
5. Open your live site URL: `https://<username>.github.io/<repository-name>/`.
