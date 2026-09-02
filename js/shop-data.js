// SHIELDTECH — inventory data configuration.
// The single source of truth for where the shop reads its products.
//
// This uses a PUBLIC JSONBin bin so visitors can read it live with NO key
// and NO Netlify rebuild on every edit. Writes happen only in the protected
// admin page (admin-inventory.html) using the master key at runtime.
window.SHIELDTECH_DATA = {
  // Set to the bin ID returned by tools/seed_bin.py
  // e.g. "645b8c8dc9b0e0b9e7a1c2d3"
  binId: "6a986ed2f5f4af5e29624c23",
  fallbackUrl: "content/shop.json"
};
