# SHIELDTECH — Deployment & CMS Setup Guide

This site is now built to work on **static hosting with a Git backend**
(Netlify is recommended). The admin panel uses **Decap CMS** (formerly
Netlify CMS) so you can manage your **shop inventory** right from a
browser — no code or FTP needed for inventory changes.

---

## 1. What changed

| Item | Where | Purpose |
|------|-------|---------|
| Real admin panel | `admin/` (Decap CMS) | Login + edit products online |
| Product data | `content/shop.json` | The shop reads products from here |
| Settings data | `content/settings.json` | Phone / WhatsApp / email / location |
| Dynamic shop | `shop.html` + `js/script.js` | Loads & renders products from `shop.json` |
| Images | `img/` | Static files visible to **all** visitors |
| Deploy config | `netlify.toml` | Netlify publish settings + redirects |
| Git repo | initialized | Required for the CMS |

---

## 2. Why a Git + static host

Decap CMS saves your admin edits as **commits to a Git repository** (the
files in `content/`). It cannot work on plain shared hosting — it needs a
host that can receive those commits and redeploy.

**Recommended:** GitHub (repo) + Netlify (hosting). Free tiers for both.

---

## 3. Step-by-step: get it live (one time only)

### A. Push the code to GitHub
1. Create a new (empty) repository on GitHub (e.g. `shieldtech-web`).
2. In this folder's terminal, point your local repo at it and push:
   ```
   git remote add origin https://github.com/YOUR-USERNAME/shieldtech-web.git
   git branch -M main
   git push -u origin main
   ```
   > If your repo's default branch is `master`, then in
   > `admin/config.yml` change `branch: main` to `branch: master`.

### B. Connect Netlify
1. Sign up at https://app.netlify.com (free).
2. **Add new site → Import an existing project → GitHub** → pick the repo.
3. Build settings are **not needed** (it's a plain static site) — Netlify
   auto-detects; leave build command empty, publish directory `.` (this is
   already in `netlify.toml`).

### C. Enable the CMS login (Netlify Identity) — REQUIRED
1. In Netlify → your site → **Identity** → **Enable Identity**.
2. In **Identity → Settings → External providers**, add your GitHub as a
   provider (set your GitHub App credentials). This lets the admin log in
   with GitHub.
3. In **Identity → Settings → Services**, enable **Git Gateway**.

That Git Gateway step is what lets the CMS commit its edits back to your
repo. Without it the admin can't save changes.

### D. Set your site URL
In `admin/config.yml`, replace the two `YOUR-SITE.netlify.app` values with
your real Netlify URL (e.g. `https://shieldtech.netlify.app`), then commit
and push. The CMS works either way, but these make the "View site" links
in the CMS correct.

---

## 4. Using the admin (once live)

1. Go to **https://YOUR-SITE/admin** (or keep using `admin.html`, it
   redirects there).
2. Log in via the GitHub provider (accept the Email/Provider UI).
3. You'll get a dashboard: **Shop &amp; Inventory**.

**Edit / add / remove products:**
- Products are a **list**. Add a row, fill in the fields,
  pick a **category** and **stock status**.
- For the photo, use **Upload** (goes to `img/uploads/` and is committed).
- **Save** → the CMS commits the change → Netlify redeploys (seconds) →
  the public shop updates for everyone.

**Settings:** the "Site Settings" collection lets you edit phone / WhatsApp
number / email / location — the site reads from `content/settings.json`
(changing the value alone doesn't re-render everywhere yet, but it keeps
the source of truth in one place).

---

## 5. Everyday rule of thumb

- **Products / stock / prices**  → manage in the CMS at `/admin`.
- **Page layout, styling, new pages** → edit the HTML/CSS and push to git.
- **Images that should be permanent** → also replace files under `img/`.

---

## 6. Testing locally without a host

The admin needs a backend, but the **shop itself** can be tested locally:

```
python -m http.server 8000
```
then open http://localhost:8000/shop.html

To test the CMS without deploying, you can run a local API:
```
npx decap-server
```
then uncomment the `local_backend` lines at the top of `admin/config.yml`.
