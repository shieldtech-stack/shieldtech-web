// SHIELDTECH — site-wide contact details (phone, WhatsApp, email, location).
//
// Contacts are stored in a public JSONBin bin so you can edit them from the
// admin page (admin-inventory.html) with NO site rebuild and NO git push.
//
// Fallback: if the live bin is unreachable/empty, this reads content/settings.json
// so the site is never blank. To change who every visitor sees, edit the JSONBin
// from the admin page (or change content/settings.json and push to git).
window.SHIELDTECH_CONTACTS = {
  // Bin ID created by the admin page's Contacts editor on first save.
  binId: "6a998cdcda38895dfe345c6d",
  fallbackUrl: "content/settings.json"
};

(function () {
  var CONTACTS_KEY = 'shieldtech_contacts_bin';
  var storedBin = null;
  try { storedBin = localStorage.getItem(CONTACTS_KEY); } catch (e) {}

  var BIN_ID = window.SHIELDTECH_CONTACTS.binId || storedBin;
  var BIN_URL = BIN_ID ? ('https://api.jsonbin.io/v3/b/' + BIN_ID + '/latest') : null;

  var phone = null, whatsapp = null, email = null, location = null;

  /* Update every [data-contact] element on the page. */
  function apply() {
    var els = document.querySelectorAll('[data-contact]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var kind = el.getAttribute('data-contact');
      switch (kind) {
        case 'phone':
          el.textContent = phone || el.textContent;
          break;
        case 'phone-link':
          if (phone) el.setAttribute('href', 'tel:' + phone.replace(/[^0-9+]/g, ''));
          break;
        case 'email':
          el.textContent = email || el.textContent;
          break;
        case 'email-link':
          if (email) el.setAttribute('href', 'mailto:' + email);
          break;
        case 'location':
          el.textContent = location || el.textContent;
          break;
        case 'whatsapp':
          if (whatsapp) el.setAttribute('href', 'https://wa.me/' + whatsapp.replace(/[^0-9]/g, ''));
          break;
        case 'whatsapp-display':
          if (whatsapp) {
            el.textContent = formatWhatsApp(whatsapp);
          }
          break;
      }
    }
  }

  /* Format a whatsapp number for display, e.g. 254707618972 -> +254 707 618 972 */
  function formatWhatsApp(raw) {
    var digits = String(raw || '').replace(/[^0-9]/g, '');
    if (!digits) return raw || '';
    var plus = String(raw).indexOf('+') >= 0 ? '+' : '';
    if (digits.length === 12 && digits.indexOf('254') === 0) {
      return plus + digits.slice(0, 3) + ' ' + digits.slice(3, 6) + ' ' + digits.slice(6, 9) + ' ' + digits.slice(9);
    }
    return plus + digits;
  }

  function loadFrom(url) {
    return fetch(url)
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (data) {
        var record = data.record || data;
        phone = record.phone || null;
        whatsapp = record.whatsapp || null;
        email = record.email || null;
        location = record.location || null;
        // Expose the digits-only number for other scripts (order links, forms).
        if (whatsapp) {
          try { window.SHIELDTECH_CONTACTS.whatsappNumber = String(whatsapp).replace(/[^0-9]/g, ''); } catch (e) {}
        }
        apply();
      })
      .catch(function () { /* keep hardcoded defaults */ });
  }

  function start() {
    if (BIN_URL) {
      loadFrom(BIN_URL).then(function () {
        // If the live bin returned nothing usable, fall back to the bundled file.
        if (!phone && !email && !location) {
          loadFrom(window.SHIELDTECH_CONTACTS.fallbackUrl);
        }
      });
    } else {
      loadFrom(window.SHIELDTECH_CONTACTS.fallbackUrl);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
