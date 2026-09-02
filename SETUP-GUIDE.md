# SHIELDTECH — Deployment & CMS Setup Guide

This site is now built to work on **static hosting with a Git backend**
(Netlify is recommended). The admin panel uses **Decap CMS** (formerly
Netlify CMS) so you can manage your **shop inventory** right from a
browser — no code or FTP needed for inventory changes.

**Current live deployment:**
- Site URL: https://shieldtechweb.netlify.app
- Admin URL: https://shieldtechweb.netlify.app/admin
- GitHub repo: https://github.com/shieldtech-stack/shieldtech-web
- Default branch: `main`

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

> **Status:** Step A (push to GitHub) and Step B (connect Netlify) are
> **already done**. The repo is at `shieldtech-stack/shieldtech-web` on
> GitHub, connected to Netlify with the site name `shieldtechweb`.
> Step D (site URL) is **also already set**. See steps C–G below for
> anything still outstanding — especially **C (add Identity user)** and
> **B2 (troubleshoot a 503 deploy)**.

### A. Push the code to GitHub  ✅ done
1. Repository created and pushed: `https://github.com/shieldtech-stack/shieldtech-web`
2. Default branch is `main` (matches the CMS config).
   > If your repo's default branch were `master` instead, change
   > `branch: main` to `branch: master` in `admin/config.yml`.

### B. Connect Netlify  ✅ done
1. Site created in Netlify named `shieldtechweb`.
2. Imported from GitHub, publish directory `.`, no build command
   (already in `netlify.toml`).

#### B2. If deployment returns a raw 503 (no build log)
This means Netlify is failing at the **"preparing repo" stage** (it can't
clone the repo — failing before any build). Your site code is NOT the
problem. Fixes, in order:
1. **Relink the repository** — Site configuration → Build & deploy →
   Continuous deployment → Repository → **Manage repository** →
   **Link to a different repository** → re-select `shieldtech-web`.
2. **Check for duplicate webhooks** — GitHub repo → Settings → Webhooks:
   there must be exactly **one** Netlify webhook. Delete duplicates.
3. **Confirm permissions** — your GitHub account needs **Admin** on the
   repo.
4. **Push a fresh commit** after any GitHub/Netlify setting change, e.g.:
   ```
   git commit --allow-empty -m "trigger redeploy" && git push
   ```
5. To rule out your code entirely, test with **Netlify Drop**
   (drag the folder onto https://app.netlify.com/drop) — if it deploys
   there, the issue is purely the Git connection.

### C. Enable the CMS login (Netlify Identity) — REQUIRED, and add a user
1. In Netlify → your site → **Identity** → **Enable Identity**.
2. In **Identity → Settings → External providers**, add your GitHub as a
   provider (set your GitHub App credentials). This lets the admin log in
   with GitHub.
3. In **Identity → Settings → Services**, enable **Git Gateway**.
4. **Invite / add yourself as an Identity user** — with Git Gateway enabled
   you usually must register or be invited as an approved user before the
   admin will accept a login. In **Identity → Settings → Invite users**,
   invite your own email and complete the signup.

That Git Gateway step is what lets the CMS commit its edits back to your
repo. Without it the admin can't save changes.

### D. Set your site URL  ✅ done
Already set in `admin/config.yml` to
`https://shieldtechweb.netlify.app`. If you ever change your Netlify site
name, update these two values (and the `logo_url` stays as-is):
- `site_url`
- `display_url`

Then commit and push — Netlify redeploys automatically.

---

## 4. Using the admin (once live)

1. Go to **https://shieldtechweb.netlify.app/admin** (or keep using
   `admin.html`, it redirects there).
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
