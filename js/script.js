// SHIELDTECH - Shared site JavaScript

document.addEventListener('DOMContentLoaded', function () {

  // Admin-uploaded images (logo, hero, services, products, courses)
  if (window.SHIELDTECHImages) {
    SHIELDTECHImages.applyAll();
    SHIELDTECHImages.initHeroSlider();
    var imageManager = document.getElementById('image-manager');
    if (imageManager) SHIELDTECHImages.renderImageManager(imageManager);
  }

  // Header scroll effect
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Mobile menu
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeBtn = document.querySelector('.mobile-close');

  function openMenu() { if (mobileMenu) mobileMenu.classList.add('open'); }
  function closeMenu() { if (mobileMenu) mobileMenu.classList.remove('open'); }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  // WhatsApp float - prefill message
  const waBtn = document.getElementById('whatsapp-btn');
  if (waBtn) {
    waBtn.addEventListener('click', function () {
      const msg = encodeURIComponent('Hello SHIELDTECH! I would like to make an inquiry.');
      waBtn.href = 'https://wa.me/254740906669?text=' + msg;
    });
  }

  // Shop — load products from content/shop.json and render dynamically.
  const productGrid = document.getElementById('product-grid');
  if (productGrid) {
    const PRODUCT = 'https://wa.me/254740906669?text=';

    function buildCard(p) {
      const card = document.createElement('div');
      card.className = 'card product-card';
      card.setAttribute('data-category', p.category || '');
      card.setAttribute('data-name', (p.name || '').toLowerCase());

      const stock = p.stock === 'out-of-stock' ? 'out-of-stock' : 'in-stock';
      const stockLabel = p.stock === 'out-of-stock' ? 'Out of Stock' : 'In Stock';
      const imgStyle = p.image ? ' style="background-image:url(\'' + p.image + '\');background-size:cover;background-position:center;"' : '';
      const listedPrice = p.price || '';

      card.innerHTML =
        '<div class="card-img"' + imgStyle + '><i class="fas fa-box-open"></i></div>' +
        '<div class="card-body">' +
          '<h3>' + escapeHtml(p.name || '') + '</h3>' +
          '<p style="margin-bottom:8px;">' + escapeHtml(p.description || '') + '</p>' +
          '<div class="price">' + escapeHtml(listedPrice) + '</div>' +
          '<span class="stock-badge ' + stock + '">' + stockLabel + '</span><br><br>' +
          '<a href="#" class="btn btn-navy btn-sm order-wa" style="width:100%;" ' +
             'data-product="' + escapeAttr(p.name || '') + '" data-price="' + escapeAttr(listedPrice) + '">' +
             (p.stock === 'out-of-stock' ? 'Inquire' : 'Order via WhatsApp') + '</a>' +
        '</div>';

      const btn = card.querySelector('.order-wa');
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const msg = encodeURIComponent(
          'SHIELDTECH Order Request\n' +
          '=====================\n' +
          'Product: ' + (p.name || '') + '\n' +
          'Price: ' + (p.price || '') + '\n\n' +
          'Name:\nPhone:'
        );
        window.open(PRODUCT + msg, '_blank');
      });

      return card;
    }

    function escapeHtml(s) {
      return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function escapeAttr(s) {
      return escapeHtml(s);
    }

    let allProducts = [];
    const status = document.getElementById('product-status');

    // Prefer the live public JSONBin bin (no key, no Netlify rebuild on
    // edits). Fall back to the local shop.json if unavailable.
    function loadFrom(url) {
      return fetch(url)
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        })
        .then(function (data) {
          // JSONBin wraps: { record: { products: [...] } }
          // Local JSON:   { products: [...] }
          var record = data.record || data;
          return (record && record.products) || [];
        });
    }

    var cfg = (window.SHIELDTECH_DATA || {}).binId;
    var binUrl = cfg ? ('https://api.jsonbin.io/v3/b/' + cfg + '/latest') : null;

    function renderAll(list) {
      allProducts = list;
      renderProducts('all');
      if (status) status.textContent = '';
    }

    function showError() {
      if (status) status.textContent = 'Unable to load products. Please check back shortly.';
    }
    function tryLocal() {
      return loadFrom((window.SHIELDTECH_DATA || {}).fallbackUrl || 'content/shop.json')
        .then(function (list) {
          if (list && list.length) { renderAll(list); } else { showError(); }
        })
        .catch(showError);
    }

    if (binUrl) {
      loadFrom(binUrl)
        .then(function (list) {
          // If the live store returns nothing (e.g. opened from file://),
          // fall back to the bundled local JSON so the shop is never blank.
          if (list && list.length) { renderAll(list); } else { return tryLocal(); }
        })
        .catch(tryLocal);
    } else {
      tryLocal();
    }

    function renderProducts(filter) {
      if (!productGrid) return;
      productGrid.innerHTML = '';
      const list = filter === 'all'
        ? allProducts
        : allProducts.filter(function (p) { return p.category === filter; });
      list.forEach(function (p) { productGrid.appendChild(buildCard(p)); });
    }

    // Filter buttons (static markup in shop.html)
    document.querySelectorAll('.filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        renderProducts(btn.getAttribute('data-filter'));
      });
    });
  }

  // Quote form submission
  const quoteForm = document.getElementById('quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = quoteForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Submitting...';
      btn.disabled = true;

      // Build a WhatsApp message with all lead details
      const formData = new FormData(quoteForm);
      const name = formData.get('fullname') || '';
      const phone = formData.get('phone') || '';
      const email = formData.get('email') || '';
      const service = formData.get('service') || '';
      const message = formData.get('message') || '';
      const whatsappMsg = encodeURIComponent(
        'SHIELDTECH Quote Request\n' +
        '========================\n' +
        'Name: ' + name + '\n' +
        'Phone: ' + phone + '\n' +
        (email ? 'Email: ' + email + '\n' : '') +
        'Service: ' + service + '\n' +
        '\nDetails:\n' + message
      );

      // Open WhatsApp so the lead is actually delivered to the business.
      window.open('https://wa.me/254740906669?text=' + whatsappMsg, '_blank');

      btn.innerHTML = '✓ Opening WhatsApp...';
      setTimeout(function () {
        btn.innerHTML = originalText;
        btn.disabled = false;
        quoteForm.reset();
      }, 2500);
    });
  }
});

// Admin data & rendering helpers
function loadSampleData() {
  return {
    products: [
      { id: 1, name: 'USB Keyboard', category: 'keyboards', price: 'KES 800', stock: 'in-stock' },
      { id: 2, name: 'Wireless Mouse', category: 'keyboards', price: 'KES 600', stock: 'in-stock' },
      { id: 3, name: '64GB Flash Disk', category: 'storage', price: 'KES 1,200', stock: 'in-stock' },
      { id: 4, name: '128GB Flash Disk', category: 'storage', price: 'KES 2,000', stock: 'out-of-stock' },
      { id: 5, name: 'Fast Charger', category: 'power', price: 'KES 900', stock: 'in-stock' },
      { id: 6, name: 'Type-C Cable', category: 'power', price: 'KES 400', stock: 'in-stock' },
      { id: 7, name: 'Headphones', category: 'audio', price: 'KES 1,500', stock: 'in-stock' },
      { id: 8, name: 'Bluetooth Earbuds', category: 'audio', price: 'KES 2,500', stock: 'in-stock' }
    ]
  };
}
