# Skillarz Learning Hub — Website Files

This folder contains the complete website ready to deploy.

## Files

```
skillarz/
├── index.html              ← Homepage
├── student-portal.html     ← Student login & dashboard
├── README.md               ← This file
└── assets/
    ├── logo.png            ← Skillarz logo
    ├── favicon.png         ← Browser tab icon
    └── hatim.jpg           ← Mr Hatim's photo
```

## Quick test (locally)

Open `index.html` in any modern browser. Both pages are linked.

## Go live on Cloudflare Pages (free)

### Step 1 — Register the domain (15 min)
- Buy `skillarz.co.uk` at **Cloudflare Registrar** (~£5.30/year, no markup) or Namecheap
- Cloudflare Registrar: https://cloudflare.com/products/registrar/

### Step 2 — Push to GitHub (10 min)
1. Create a free GitHub account at github.com
2. Create a new repository called `skillarz-website`
3. Upload the entire `skillarz/` folder (or use git)

### Step 3 — Connect Cloudflare Pages (5 min)
1. Go to https://pages.cloudflare.com → Sign up / log in
2. Click "Create application" → "Pages" → "Connect to Git"
3. Select your `skillarz-website` repo
4. Build settings: **leave everything empty** (it's static HTML)
5. Click "Save and Deploy"
6. Your site is live at `skillarz-website.pages.dev` within 60 seconds

### Step 4 — Add your custom domain (10 min)
1. In Cloudflare Pages → Custom domains → Add `skillarz.co.uk`
2. If you bought from Cloudflare: DNS is automatic
3. If from Namecheap: update nameservers to Cloudflare's
4. SSL certificate auto-provisions within a few minutes

### Step 5 — Done!
`https://skillarz.co.uk` is now live with:
- Global CDN
- Free HTTPS / SSL
- Unlimited bandwidth
- Automatic deployments on every git push

## Items to update before launch

### 🔴 Critical
- [ ] Personal bios for both tutors (currently placeholders)
- [ ] Mrs Insiya's photo (currently "IB" initials)
- [ ] Mr Hatim's photo retouching if desired

### 🟡 Important
- [ ] Real testimonials once collected (with permission)
- [ ] ICO registration (£40/yr, legally required) — add ICO number to footer
- [ ] Full Privacy Policy page (use termly.io free generator)
- [ ] Terms & Conditions page
- [ ] Cookie Policy page

### 🟢 Nice to have
- [ ] Google Analytics 4 tracking code
- [ ] Google Business Profile listing
- [ ] Calendly embed for free taster booking
- [ ] Free downloadable resources (revision guides etc)

## Contact details embedded

- Email: skillarzlearninghub@gmail.com
- Phone: +44 7341 714455
- WhatsApp: https://wa.me/447341714455
- Working hours: Mon–Fri 4–10pm, Sat 9am–9pm, Sun by arrangement
- Same-day response

## Tech stack

- Pure HTML5 / CSS3 / Vanilla JavaScript (no frameworks)
- Google Fonts (Playfair Display + DM Sans + DM Mono)
- No build step, no dependencies
- Mobile responsive
- WCAG 2.1 AA accessibility

## Costs

- Hosting (Cloudflare Pages): **£0/year**
- Domain (.co.uk): **~£5–8/year**
- SSL certificate: **£0** (auto)
- ICO registration: **£40/year** (legally required)
- **Total: ~£48/year**

Optional: Zoom Pro at ~£12/month if sessions exceed 40 minutes.
