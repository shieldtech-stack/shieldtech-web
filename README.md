# SHIELDTECH Digital Solutions — Website

The official website for **SHIELDTECH Digital Solutions**, an IT and digital
services business in Kilome Market, Kenya. It covers cyber & tech services,
printing & branding, an accessories/devices shop, a digital training academy,
and contact/booking.

Live site: **https://shieldtech-stack.github.io/shieldtech-web/**

---

## Tech stack

- **Static HTML + CSS + vanilla JavaScript** — no build step, no framework.
- **GitHub Pages** for hosting (deploys automatically from the `main` branch).
- **JSONBin.io** hosted JSON stores for live, rebuild-free content edits:
  - Shop inventory (`content/shop.json` fallback)
  - Site contact details (phone / WhatsApp / email / location)
- **Font Awesome** icons via CDN.

---

## Project structure

```
├── index.html            Homepage
├── about.html            About Us
├── services.html         Cyber & Tech / Printing & Branding services
├── shop.html             Accessories & Devices shop (dynamic product grid)
├── training.html         Digital Training Academy
├── contact.html          Contact & directions
├── admin-inventory.html  Admin: manage shop, images, and contact details
├── admin.html            Redirects to admin-inventory.html
├── css/styles.css        Global styles
├── js/
│   ├── images.js         Image system + admin Image Manager (preview overrides)
│   ├── shop-data.js      Shop JSONBin config
│   ├── contacts.js       Loads site-wide contact details into every page
│   └── script.js         Shared behaviour (shop rendering, menus, forms...)
├── content/
│   ├── shop.json         Bundled fallback shop inventory
│   └── settings.json     Bundled fallback contact details
├── img/                  Static images (subfolders per page/section)
├── admin/config.yml      Decap CMS config (for Netlify, optional)
├── tools/seed_bin.py     One-time JSONBin seeder for the shop store
└── netlify.toml          Netlify publish settings (optional host)
```

---

## Running locally

Any static file server works, e.g.:

```
python -m http.server 8000
```

then open http://localhost:8000/

> Serving over `file://` works for most pages, but the live JSONBin store may
> be blocked by the browser's CORS/`file://` policy. Use a local server for the
> full experience.

---

## Deployment (GitHub Pages)

1. Push to the `main` branch of the GitHub repo.
2. **Settings → Pages** → Source: **Deploy from a branch**, branch **`main`**, root `/`.
3. GitHub builds and publishes to the sub-path `/shieldtech-web/`.

That sub-path matters: asset URLs are **relative** (e.g. `img/products/...`), not
absolute, so they resolve correctly under the project sub-path.

---

## Managing content

Everything below lives behind the admin PIN **`shieldtech2026`** (change it in
`admin-inventory.html` if you want) and your **JSONBin master key**, which you
paste into the admin once per session (never stored).

### Shop products (`admin-inventory.html`)

- Add / edit / remove products and change price & stock.
- **Save** writes straight to the JSONBin shop store → live site updates instantly.
- Product photo: put the image file in `img/products/` and set the product's
  **Image URL** to `img/products/<filename>` (exact case and names must match).

### Images on other pages (`admin-inventory.html` → "Images for all pages")

- Preview overrides saved in your browser (localStorage).
- To change what **everyone** sees, replace the matching file under `img/`
  (e.g. `img/home/`, `img/hero/`, `img/courses/`).

### Contact details (`admin-inventory.html` → "Contact details")

- Edit phone / WhatsApp / email / location and **Save**.
- Writes to the contacts JSONBin → site updates instantly for all visitors.
- The contacts bin ID is set in `js/contacts.js`
  (`window.SHIELDTECH_CONTACTS.binId`).

### Direct / permanent edits

For anything not editable in the admin (layout, text in HTML, new pages), edit
the files and push to `main` — GitHub Pages redeploys automatically.

---

## Troubleshooting

- **Shop missing images:** confirm the product's Image URL points to a file that
  actually exists in `img/products/` in the repo (check exact filename/case, and
  that the file was committed/uploaded to the right folder).
- **Shop blank:** ensure the live JSONBin store is reachable; the page falls back
  to the bundled `content/shop.json`.
- **Admin can't save:** enter your current JSONBin **master key** at the top of
  the admin page.

---

## License

&copy; 2026 SHIELDTECH Digital Solutions. All rights reserved.
