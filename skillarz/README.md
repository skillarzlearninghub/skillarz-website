# Skillarz Learning Hub — Website

> **From Support to Success…Together**
> Online 1-to-1 tuition for Scottish students P6–S5
> Maths · Physics · Chemistry · Computing Science · English · Applications of Mathematics
> National 5 & Higher · CfE Aligned · PVG Checked · GTCS Registered

---

## 📦 What's in this folder

```
skillarz/
├── index.html                     ← Homepage
├── student-portal.html            ← Student login & dashboard
├── README.md                      ← This file
├── assets/
│   ├── logo.png                   ← Skillarz logo
│   ├── favicon.png                ← Browser tab icon
│   └── hatim.jpg                  ← Mr Hatim's photo
└── functions/
    └── api/
        └── contact.js             ← Serverless form handler (sends emails)
```

**Important:** The `functions/` folder MUST be at the root of your repository (same level as `index.html`), NOT inside `assets/` or any other folder. This is how Cloudflare Pages recognises serverless functions.

---

## 🚀 Complete deployment guide

Follow these phases in order. Total time: ~60 minutes for a first-time setup.

### Phase 1 — Register your domain (15 min)

**Recommended:** Cloudflare Registrar (~£5.30/year, no markup, zero renewal hikes)

1. Go to **dash.cloudflare.com** → sign up free with skillarzlearninghub@gmail.com
2. Top sidebar → **Domain Registration** → **Register Domains**
3. Search for `skillarz.co.uk`
4. Add to cart → checkout

Alternative: Namecheap, 123-Reg, or any other registrar (~£8–14/year).

---

### Phase 2 — Push files to GitHub (10 min)

#### Option A — Via GitHub website (no command line)

1. Sign up at **github.com** (free)
2. Click **+ New repository** (top right)
3. Repository name: `skillarz-website`
4. Set to **Private** (recommended) or Public
5. Tick **Add a README file**
6. Click **Create repository**

7. On the repo page, click **Add file** → **Upload files**
8. **Drag in ALL files from the `skillarz/` folder** — including the `functions/` subfolder
9. Commit message: "Initial website upload"
10. Click **Commit changes**

**Critical check:** After upload, your repo should show:
```
skillarz-website/
├── index.html
├── student-portal.html
├── README.md
├── assets/    (folder with 3 files)
└── functions/ (folder with api/contact.js inside)
```

If you don't see `functions/` at the top level, your form will not work. Re-upload.

#### Option B — If folders won't upload via drag-and-drop

GitHub's web uploader doesn't track empty folders. Upload files individually:

1. Click **Add file** → **Create new file**
2. In the filename field, type exactly: `functions/api/contact.js`
   (As you type slashes, GitHub creates folders automatically)
3. Open the `contact.js` file on your computer, copy the contents
4. Paste into GitHub's editor
5. Commit changes

---

### Phase 3 — Connect Cloudflare Pages (5 min)

1. Go to **dash.cloudflare.com**
2. Left sidebar → **Compute (Workers & Pages)**
3. Click **Create application** → **Pages** tab → **Connect to Git**
4. Authorise GitHub access → select your **skillarz-website** repo
5. Build settings:
   - **Framework preset:** None
   - **Build command:** *leave empty*
   - **Build output directory:** `/`
6. Click **Save and Deploy**
7. Within 60 seconds, your site is live at `skillarz-website.pages.dev`

**Verify Functions are detected:**

- Click your project name → **Deployments** tab
- Click the latest deployment
- Look for a **Functions** tab in the deployment details
- It should list: `api/contact`

If you don't see this, the `functions/` folder isn't in the right place. Go back to Phase 2.

---

### Phase 4 — Attach your custom domain (10 min)

#### If domain is from Cloudflare Registrar (easiest)

1. In Cloudflare Pages → your project → **Custom domains** tab
2. Click **Set up a custom domain**
3. Enter `skillarz.co.uk` → **Continue** → **Activate domain**
4. Repeat for `www.skillarz.co.uk`
5. Wait 5 minutes for SSL to provision
6. Visit `https://skillarz.co.uk` — site should be live with HTTPS

#### If domain is from another registrar

**Step 4a — Add domain to Cloudflare DNS first:**

1. dash.cloudflare.com → **Add a domain**
2. Enter `skillarz.co.uk` → **Continue** → **Free plan**
3. Cloudflare gives you 2 nameservers like `ada.ns.cloudflare.com` and `carl.ns.cloudflare.com`
4. **Copy these**

**Step 4b — Update nameservers at your registrar:**

1. Log in to your registrar (Namecheap / 123-Reg / etc.)
2. Find domain management → **Nameservers** → switch to **Custom DNS**
3. Paste the two Cloudflare nameservers → save
4. Wait 5 mins – 24 hours for propagation
5. Cloudflare emails you when confirmed

**Step 4c — Attach to Pages:**

Same as the Cloudflare Registrar path above.

---

### Phase 5 — Set up Resend for contact form emails (15 min)

The contact form uses a Cloudflare Pages Function to send emails. Resend is the free email-sending service it uses.

#### Step 1: Create Resend account

1. Go to **resend.com** → **Sign up**
2. Use **skillarzlearninghub@gmail.com**
3. Verify your email

#### Step 2: Add skillarz.co.uk as a sending domain

1. In Resend → **Domains** → **Add Domain**
2. Enter `skillarz.co.uk`
3. Resend shows you 3 DNS records to add (SPF, DKIM, MX)

#### Step 3: Add DNS records in Cloudflare

1. Open **dash.cloudflare.com** in another tab
2. Click your **skillarz.co.uk** domain
3. Left sidebar → **DNS**
4. For each DNS record from Resend:
   - Click **Add record**
   - Type: TXT / MX / CNAME (as shown by Resend)
   - Paste the **Name** and **Content** exactly
   - **Important:** Set proxy status to **DNS only** (grey cloud, not orange) — these are mail records
   - Save

5. Back in Resend → click **Verify DNS records**
6. Wait 2–5 mins — all should turn green ✓

#### Step 4: Generate API key

1. In Resend → left sidebar → **API Keys**
2. Click **Create API Key**
3. Name: `Skillarz Website Form`
4. Permission: **Sending access**
5. Domain: skillarz.co.uk
6. Click **Add**
7. **Copy the key immediately** — it starts with `re_` and is shown only once
8. Save it somewhere safe (password manager)

#### Step 5: Add the API key to Cloudflare Pages

⚠️ **This is the step where most people get stuck.** If you see "Variables cannot be added to a Worker that only has static assets," it means the `functions/` folder isn't in your repo. Go back to Phase 2.

1. Cloudflare → **Compute (Workers & Pages)** → your project → **Settings** tab
2. Scroll to **Environment variables**
3. Click **Add variable**
4. Fill in:
   - **Variable name:** `RESEND_API_KEY` (exactly this, all caps)
   - **Value:** Paste your Resend API key (`re_xxxxx...`)
   - **Environment:** Production
   - **Type:** Click **Encrypt** (very important — protects the key)
5. Click **Save**

#### Step 6: Trigger a redeploy

Environment variables only take effect on next deployment:

1. Click **Deployments** tab
2. Click **⋯** next to the latest deployment
3. Click **Retry deployment**

Wait 60 seconds for the new build.

---

### Phase 6 — Test the contact form (5 min)

1. Visit **https://skillarz.co.uk** → scroll to the booking section
2. Fill out the form with **your own email** as the parent email (so you can verify)
3. Tick the GDPR consent box
4. Click **Send Enquiry**

**What should happen:**

- Button changes to "Sending…"
- Green success message appears
- Within 10 seconds, an email arrives at **skillarzlearninghub@gmail.com**
- Email is from `Skillarz Website <enquiries@skillarz.co.uk>`
- Subject: `📩 New enquiry from [name] — [subject] ([year group])`
- Reply directly → your reply goes to the parent's email

**If something fails:**

- Check **Cloudflare → your project → Logs** tab — shows the exact error
- Most common: API key not set, set in wrong environment, or domain not verified in Resend
- Email goes to spam? Mark first one as "Not spam" — Gmail learns after 2–3 emails

---

## ✅ Pre-launch checklist

### 🔴 Critical — must complete before launching publicly

- [ ] Domain registered and pointing to Cloudflare Pages
- [ ] SSL certificate provisioned (green padlock in browser)
- [ ] Contact form sends test email successfully to skillarzlearninghub@gmail.com
- [ ] WhatsApp button opens chat (test on mobile)
- [ ] All navigation links work (Subjects, Pricing, Booking, etc.)
- [ ] Student Portal login screen loads at `/student-portal.html`
- [ ] Mobile responsive — test on phone

### 🟡 Important — legal & compliance

- [ ] **ICO registration** at ico.org.uk — £40/year, legally required
- [ ] Privacy Policy page written (use **termly.io** free generator)
- [ ] Terms & Conditions page written
- [ ] Cookie Policy page written
- [ ] Professional indemnity insurance (recommended for tutoring)

### 🟢 Content updates

- [ ] Personal bios for both tutors (currently placeholders)
- [ ] Mrs Insiya's photo (currently "IB" initials placeholder)
- [ ] Real testimonials once collected (with explicit written permission)
- [ ] Real Google Classroom invite links per subject

### 🔵 Optional enhancements

- [ ] Google Analytics 4 tracking code
- [ ] Google Business Profile listing
- [ ] Calendly embed for booking automation
- [ ] Free downloadable PDF resources (revision guides)
- [ ] Google Reviews widget (Elfsight / Trustindex)

---

## 💰 Cost summary

| Item | Cost | Required? |
|---|---|---|
| Cloudflare Pages (hosting) | **£0/year** | Yes |
| Cloudflare CDN & SSL | **£0/year** | Yes |
| Cloudflare Pages Functions | **£0/year** (100k req/day) | Yes |
| Resend (email sending) | **£0/year** (3k emails/month) | Yes (for form) |
| Domain (.co.uk) | **~£5.30–£14/year** | Yes |
| ICO registration | **£40/year** | Yes (UK GDPR) |
| Zoom (basic, 40-min sessions) | **£0/month** | Yes |
| Zoom Pro (longer sessions) | **~£12/month** | If needed |
| Google Workspace | **£0** (free Gmail) | Optional |
| Calendly Pro | **£0** (free tier) | Optional |
| **Minimum total** | **~£48/year** | |

---

## 🛠 Tech stack

- **Frontend:** Pure HTML5 / CSS3 / Vanilla JavaScript (no frameworks, no build step)
- **Fonts:** Google Fonts (Playfair Display + DM Sans + DM Mono)
- **Hosting:** Cloudflare Pages (free, unlimited bandwidth, global CDN)
- **Serverless functions:** Cloudflare Pages Functions (free)
- **Email delivery:** Resend (free tier)
- **Version control:** GitHub (free)
- **Domain:** Cloudflare Registrar (recommended) or any registrar
- **Mobile responsive:** Yes
- **Accessibility:** WCAG 2.1 AA compliant

---

## 📞 Business details on the site

- **Business name:** Skillarz Learning Hub
- **Tagline:** From Support to Success…Together
- **Company number:** SC874116
- **Registered address:** 1/L, 8 Park Avenue, Dundee, DD4 6PW
- **Email:** skillarzlearninghub@gmail.com
- **Phone & WhatsApp:** +44 7341 714455
- **Working hours:** Mon–Fri 4pm–10pm · Sat 9am–9pm · Sun by arrangement
- **Response time:** Same day (during working hours)

### Pricing (configured on the site)

- Pay-as-you-go: **£25** per 60-min session
- Monthly package: **£100** for 4 sessions/month
- N5 & Higher Intensive: **£600** for 30 sessions
- Sibling discount: **10%**

### GDPR (configured on the site)

- Data Protection Officer: Mr Hatim Bhavnagarwala
- Enquiry data retention: 1 year
- Lesson recording retention: 12 months
- Lawful basis: Consent (marketing) + Contract (lesson delivery)

---

## 🔄 Updating the site after launch

The site auto-deploys whenever you push to GitHub:

1. Edit a file (e.g., `index.html`) on your computer
2. Upload it to GitHub (replaces the old file)
3. Cloudflare detects the change → rebuilds → live in 30 seconds

To update tutor bios, swap photos, or add testimonials, just edit the relevant section in `index.html` and re-upload.

---

## 🆘 Troubleshooting

**"Variables cannot be added to a Worker that only has static assets"**
→ The `functions/` folder isn't in your repo, or isn't at the root level. Re-upload with the folder structure shown at the top of this README.

**Contact form shows "Network error"**
→ Function isn't deployed yet. Wait 1 min, refresh. Check Deployments tab → Functions list shows `api/contact`.

**Form submits but email doesn't arrive**
→ Check Cloudflare Logs tab for the exact error. Usually means `RESEND_API_KEY` is missing or Resend domain isn't verified.

**Email goes to spam**
→ Mark first one as "Not spam." Gmail learns after 2–3 messages. For chronic issues, add a DMARC record (Resend provides instructions).

**Site shows "Not Secure" warning**
→ SSL provisioning takes 2–15 minutes after attaching custom domain. Wait, then refresh.

**`skillarz.co.uk` works but `www.skillarz.co.uk` doesn't (or vice versa)**
→ Add BOTH versions as custom domains in Cloudflare Pages.

**Redirect loop / "ERR_TOO_MANY_REDIRECTS"**
→ Cloudflare → SSL/TLS → set encryption mode to **Full** (not Flexible).

---

## 📋 Files quick reference

| File | Purpose | Edit when |
|---|---|---|
| `index.html` | Homepage | Updating tutor info, pricing, testimonials |
| `student-portal.html` | Login & dashboard | Updating dashboard demo data |
| `functions/api/contact.js` | Form email handler | Changing email recipient, subject formatting |
| `assets/logo.png` | Header logo | Logo changes |
| `assets/hatim.jpg` | Mr Hatim's photo | Photo update |
| `assets/favicon.png` | Browser tab icon | Icon changes |

---

© 2025 Skillarz Learning Hub · Registered in Scotland (SC874116)
