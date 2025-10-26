# Deployment Instructions for bildklein.ch

## Prerequisites

- GitHub repository: `danken1000-star/bildklein-ch`
- Vercel account with access to the project
- Domain: `bildklein.ch` configured in Vercel

## Deploy to Vercel

### Option 1: Automatic Deployment (Recommended)

1. Push to GitHub `main` branch
2. Vercel automatically deploys via GitHub integration
3. Deployment URL: `https://bildklein-ch.vercel.app`
4. Production URL: `https://bildklein.ch`

### Option 2: Manual Deployment

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
cd ~/bildklein
vercel --prod
```

## Environment Variables

No environment variables needed! The app is fully client-side.

## Post-Deployment Checklist

- [ ] Test live URL: https://bildklein.ch
- [ ] Test all locales (de, fr, it, en)
- [ ] Test image upload & compression
- [ ] Test download functionality
- [ ] Verify SEO metadata (view page source)
- [ ] Check robots.txt: https://bildklein.ch/robots.txt
- [ ] Check sitemap: https://bildklein.ch/sitemap.xml
- [ ] Test on mobile device
- [ ] Verify analytics counter works
- [ ] Check that no console errors appear

## Rollback

If issues occur, rollback to previous deployment:

```bash
vercel rollback
```

Or via Vercel dashboard: Deployments → Previous deployment → Promote to Production

## Monitoring

- Check Vercel Analytics dashboard
- Monitor error logs in Vercel dashboard
- Use browser DevTools for performance
- Test on real devices

## Contact

For issues, contact: Flow19 Webdesign (Bern, Switzerland)
