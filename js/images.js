/* SHIELDTECH — Image Manager
 *
 * Static-hosting image system.
 *
 * Every [data-img-slot] on the site has a real image file inside the "img/"
 * folder. Those files are the DEFAULT and are shown to every visitor (loads
 * from disk on shared hosting / any static host).
 *
 * Admins can still override any slot on THEIR OWN browser via the Admin page
 * (admin.html) — the override is stored in localStorage and takes priority
 * over the default file. This is handy for quick live previews.
 *
 * To make a permanent change that ALL visitors see, replace the file in the
 * matching img/<group>/ ... or admin override:
 *   1. Upload/swap the file under the img/ folder (e.g. hero/hero-1.jpg),
 *   2. Or use the Admin > Image Manager override for an instant preview.
 */
window.SHIELDTECHImages = (function () {
  var PREFIX = 'shieldtech_img_';

  /* Default static file for every slot. Replace these files to update the site. */
  var DEFAULT = {
    'logo':        'img/logo/logo.png',
    'hero-1':      'img/hero/hero-1.jpg',
    'hero-2':      'img/hero/hero-2.jpg',
    'hero-3':      'img/hero/hero-3.jpg',
    'home-cyber':  'img/home/home-cyber.jpg',
    'home-printing': 'img/home/home-printing.jpg',
    'home-shop':   'img/home/home-shop.jpg',
    'home-training':'img/home/home-training.jpg',
    'svc-ecitizen':'img/cyber/svc-ecitizen.jpg',
    'svc-kra':     'img/cyber/svc-kra.jpg',
    'svc-hardware':'img/cyber/svc-hardware.jpg',
    'svc-networking':'img/cyber/svc-networking.jpg',
    'svc-software':'img/cyber/svc-software.jpg',
    'print-doc':   'img/printing/print-doc.jpg',
    'print-banner':'img/printing/print-banner.jpg',
    'print-stationery':'img/printing/print-stationery.jpg',
    'print-design':'img/printing/print-design.jpg',
    'prod-keyboard':'img/products/prod-keyboard.jpg',
    'prod-mouse':  'img/products/prod-mouse.jpg',
    'prod-gaming': 'img/products/prod-gaming.jpg',
    'prod-flash32':'img/products/prod-flash32.jpg',
    'prod-flash64':'img/products/prod-flash64.jpg',
    'prod-microsd':'img/products/prod-microsd.jpg',
    'prod-ssd':    'img/products/prod-ssd.jpg',
    'prod-charger':'img/products/prod-charger.jpg',
    'prod-usbc':   'img/products/prod-usbc.jpg',
    'prod-hdmi':   'img/products/prod-hdmi.jpg',
    'prod-headphones':'img/products/prod-headphones.jpg',
    'prod-earbuds':'img/products/prod-earbuds.jpg',
    'prod-speakers':'img/products/prod-speakers.jpg',
    'course-literacy':'img/courses/course-literacy.jpg',
    'course-design':'img/courses/course-design.jpg',
    'course-webdev':'img/courses/course-webdev.jpg',
    'res-cbc':     'img/courses/res-cbc.jpg',
    'res-844':     'img/courses/res-844.jpg',
    'res-records': 'img/courses/res-records.jpg',
    'about-company':'img/about/about-company.jpg'
  };

  var registry = {
    // Brand
    'logo':      { label: 'Brand Logo',      group: 'brand',     hint: 'Appears in the header & footer' },
    // Home hero
    'hero-1':    { label: 'Home Hero Slide 1', group: 'home',     hint: 'Large background banner' },
    'hero-2':    { label: 'Home Hero Slide 2', group: 'home',     hint: 'Large background banner' },
    'hero-3':    { label: 'Home Hero Slide 3', group: 'home',     hint: 'Large background banner' },
    'home-cyber':    { label: 'Home Card — Cyber & Tech',         group: 'home', hint: 'Homepage core services grid' },
    'home-printing': { label: 'Home Card — Printing & Branding',  group: 'home', hint: 'Homepage core services grid' },
    'home-shop':     { label: 'Home Card — Accessories & Hardware', group: 'home', hint: 'Homepage core services grid' },
    'home-training': { label: 'Home Card — Digital Training',      group: 'home', hint: 'Homepage core services grid' },
    // Cyber & tech services
    'svc-ecitizen':  { label: 'eCitizen & Gov Portals',       group: 'cyber',  hint: 'Cyber & Tech Services page' },
    'svc-kra':       { label: 'KRA & HELB Filing',            group: 'cyber',  hint: 'Cyber & Tech Services page' },
    'svc-hardware':  { label: 'Hardware Maintenance & Repair', group: 'cyber',  hint: 'Cyber & Tech Services page' },
    'svc-networking':{ label: 'Networking & System Setup',    group: 'cyber',  hint: 'Cyber & Tech Services page' },
    'svc-software':  { label: 'Software & CV Writing',        group: 'cyber',  hint: 'Cyber & Tech Services page' },
    // Printing & branding
    'print-doc':     { label: 'Document Printing',      group: 'printing', hint: 'Printing & Branding services' },
    'print-banner':  { label: 'Banners & Posters',      group: 'printing', hint: 'Printing & Branding services' },
    'print-stationery': { label: 'Business Stationery',  group: 'printing', hint: 'Printing & Branding services' },
    'print-design':  { label: 'Graphic Design',         group: 'printing', hint: 'Printing & Branding services' },
    // Shop products
    'prod-keyboard':   { label: 'USB Keyboard',        group: 'shop', hint: 'Accessories & Devices shop' },
    'prod-mouse':      { label: 'Wireless Mouse',      group: 'shop', hint: 'Accessories & Devices shop' },
    'prod-gaming':     { label: 'Gaming Keyboard',     group: 'shop', hint: 'Accessories & Devices shop' },
    'prod-flash32':    { label: 'Flash Disk 32GB',     group: 'shop', hint: 'Accessories & Devices shop' },
    'prod-flash64':    { label: 'Flash Disk 64GB',     group: 'shop', hint: 'Accessories & Devices shop' },
    'prod-microsd':    { label: 'MicroSD 64GB',        group: 'shop', hint: 'Accessories & Devices shop' },
    'prod-ssd':        { label: 'External SSD 256GB',  group: 'shop', hint: 'Accessories & Devices shop' },
    'prod-charger':    { label: 'Fast Charger 25W',    group: 'shop', hint: 'Accessories & Devices shop' },
    'prod-usbc':       { label: 'Type-C Cable 2m',     group: 'shop', hint: 'Accessories & Devices shop' },
    'prod-hdmi':       { label: 'HDMI Cable 1.5m',     group: 'shop', hint: 'Accessories & Devices shop' },
    'prod-headphones': { label: 'Over-Ear Headphones', group: 'shop', hint: 'Accessories & Devices shop' },
    'prod-earbuds':    { label: 'Bluetooth Earbuds',   group: 'shop', hint: 'Accessories & Devices shop' },
    'prod-speakers':   { label: 'Desktop Speakers',    group: 'shop', hint: 'Accessories & Devices shop' },
    // Training
    'course-literacy': { label: 'Computer Literacy',   group: 'training', hint: 'Digital Training Academy' },
    'course-design':   { label: 'Graphic Design',      group: 'training', hint: 'Digital Training Academy' },
    'course-webdev':   { label: 'Web Dev & AI',        group: 'training', hint: 'Digital Training Academy' },
    'res-cbc':         { label: 'CBC Revision Pack',   group: 'training', hint: 'Digital Training Academy' },
    'res-844':         { label: '8-4-4 Mock Exams',    group: 'training', hint: 'Digital Training Academy' },
    'res-records':     { label: 'Records of Work',     group: 'training', hint: 'Digital Training Academy' },
    // About
    'about-company':   { label: 'Company Image',       group: 'about',    hint: 'About Us page' }
  };

  var groups = [
    { id: 'brand',    title: 'Branding' },
    { id: 'home',     title: 'Homepage Hero' },
    { id: 'cyber',    title: 'Cyber & Tech Services' },
    { id: 'printing', title: 'Printing & Branding' },
    { id: 'shop',     title: 'Shop Accessories & Devices' },
    { id: 'training', title: 'Digital Training Academy' },
    { id: 'about',    title: 'About Us' }
  ];

  function get(slot) {
    try { return localStorage.getItem(PREFIX + slot) || null; }
    catch (e) { return null; }
  }

  function set(slot, dataUrl) {
    try { localStorage.setItem(PREFIX + slot, dataUrl); return true; }
    catch (e) { return false; }
  }

  function remove(slot) {
    try { localStorage.removeItem(PREFIX + slot); } catch (e) {}
  }

  function defaultFile(slot) { return DEFAULT[slot] || null; }

  /* Optimal output size for each slot — keeps big uploads well-proportioned. */
  function dimsFor(slot) {
    if (slot === 'logo') return { w: 800, h: 400, q: 0.95, png: true };
    var group = (registry[slot] || {}).group;
    if (group === 'home') return { w: 1920, h: 1080, q: 0.8, png: false };
    return { w: 1400, h: 1050, q: 0.82, png: false };
  }

  /* Decode an image file honouring EXIF orientation (fixes sideways phone photos). */
  function loadSource(file) {
    if (window.createImageBitmap) {
      try {
        return Promise.resolve(createImageBitmap(file, { imageOrientation: 'from-image' }))
          .catch(function () { return loadViaImage(file); });
      } catch (e) { /* fall through */ }
    }
    return loadViaImage(file);
  }

  function loadViaImage(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error('Could not read image'));
      };
      img.src = url;
    });
  }

  /* Resize & encode an uploaded file into a compact data URL. */
  function compress(slot, file) {
    var dims = dimsFor(slot);
    return loadSource(file).then(function (src) {
      var w = Math.max(1, src.width || 1);
      var h = Math.max(1, src.height || 1);
      var scale = Math.min(1, Math.round(dims.w) / w, Math.round(dims.h) / h);
      var cw = Math.max(1, Math.round(w * scale));
      var ch = Math.max(1, Math.round(h * scale));
      var canvas = document.createElement('canvas');
      canvas.width = cw;
      canvas.height = ch;
      var ctx = canvas.getContext('2d');
      if (!dims.png) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, cw, ch);
      }
      ctx.drawImage(src, 0, 0, cw, ch);
      return canvas.toDataURL(dims.png ? 'image/png' : 'image/jpeg', dims.q);
    }).catch(function () {
      return null;
    });
  }

  /* Upload a file to a slot (browser override). */
  function upload(slot, file) {
    if (!registry[slot] || !file) {
      return Promise.resolve(false);
    }
    return compress(slot, file).then(function (dataUrl) {
      if (!dataUrl) return false;
      return set(slot, dataUrl);
    });
  }

  /* Apply images to every matching [data-img-slot] element on this page.
   * Priority: admin override (localStorage) > default static file. */
  function applyAll(root) {
    var scope = root || document;
    var els = scope.querySelectorAll('[data-img-slot]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var slot = el.getAttribute('data-img-slot');
      var info = registry[slot];

      // Remove any previously injected image
      var prevImg = el.querySelector('img.slot-img');
      if (prevImg && prevImg.parentNode === el) el.removeChild(prevImg);
      var prevLogo = el.querySelector('img.logo-img');
      if (prevLogo && prevLogo.parentNode === el) el.removeChild(prevLogo);

      el.classList.remove('has-image', 'has-logo-img');
      el.style.backgroundImage = '';

      // Hide the placeholder icon only when we actually have an image
      var icon = el.querySelector('i');
      var text = el.querySelector('.slot-fallback');

      var stored = get(slot);

      if (slot === 'logo') {
        el.classList.add('has-logo-img');
        var img = document.createElement('img');
        img.className = 'logo-img';
        img.alt = 'SHIELDTECH logo';
        img.src = stored || defaultFile(slot);
        el.insertBefore(img, el.firstChild);
        if (icon) icon.style.opacity = '0';
        if (text) text.style.display = 'none';
        continue;
      }

      // Non-logo slots use a CSS background image.
      var src = stored || defaultFile(slot);
      if (src) {
        el.classList.add('has-image');
        el.style.backgroundImage = 'url("' + src + '")';
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';
        el.style.backgroundRepeat = 'no-repeat';
        if (icon) icon.style.opacity = '0';
        if (text) text.style.display = 'none';
      } else if (icon) {
        icon.style.opacity = '';
      }
    }
  }

  /* ── Hero slider on the homepage ── */
  function initHeroSlider() {
    var hero = document.getElementById('hero');
    if (!hero) return;
    var slides = hero.querySelectorAll('.hero-slide');
    if (!slides.length) return;

    var dotsWrap = hero.querySelector('.hero-dots');
    var current = 0;
    var timer = null;
    var AUTOPLAY_MS = 7000;

    // Build dots
    for (var i = 0; i < slides.length; i++) {
      var d = document.createElement('button');
      d.type = 'button';
      d.className = 'hero-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      d.addEventListener('click', (function (idx) {
        return function () { goTo(idx); };
      })(i));
      dotsWrap.appendChild(d);
    }
    var dots = dotsWrap.querySelectorAll('.hero-dot');

    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function start() {
      if (timer) return;
      timer = setInterval(next, AUTOPLAY_MS);
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    var prevBtn = hero.querySelector('.hero-arrow.prev');
    var nextBtn = hero.querySelector('.hero-arrow.next');
    if (prevBtn) prevBtn.addEventListener('click', function () { stop(); prev(); start(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { stop(); next(); start(); });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    hero.addEventListener('touchstart', stop, { passive: true });
    hero.addEventListener('touchend', function () { setTimeout(start, 4000); });

    start();
  }

  /* ── Admin Image Manager UI ── */
  function renderImageManager(container) {
    if (!container) return;

    var note = document.createElement('div');
    note.className = 'img-manager-note';
    note.innerHTML =
      '<strong>How images work:</strong> Every photo has a default file in the <code>img/</code> folder, ' +
      'shown to all visitors. The upload below creates a <em>preview-only override</em> saved in this browser. ' +
      'To make a permanent change everyone sees, replace the file in <code>img/</code> (or use the download/export help below). ' +
      'Use JPG/PNG files; photos are auto-compressed. Click Remove to restore the default file.';
    container.appendChild(note);

    groups.forEach(function (group) {
      var slots = Object.keys(registry).filter(function (k) {
        return registry[k].group === group.id;
      });
      if (!slots.length) return;

      var sec = document.createElement('section');
      sec.className = 'img-manager-group';
      sec.innerHTML = '<h3 class="img-manager-group-title">' + group.title + '</h3>';
      var grid = document.createElement('div');
      grid.className = 'img-manager-grid';

      slots.forEach(function (slot) { grid.appendChild(buildSlot(slot)); });
      sec.appendChild(grid);
      container.appendChild(sec);
    });
  }

  function buildSlot(slot) {
    var info = registry[slot];
    var div = document.createElement('div');
    div.className = 'img-slot';

    var thumb = document.createElement('div');
    thumb.className = 'img-slot-thumb';
    thumb.textContent = 'Default file';

    var infoBox = document.createElement('div');
    infoBox.className = 'img-slot-info';
    var title = document.createElement('h4');
    title.textContent = info.label;
    var hint = document.createElement('p');
    hint.innerHTML = info.hint + ' &mdash; file: <code style="word-break:break-all;">' + (defaultFile(slot) || '—') + '</code>';
    infoBox.appendChild(title);
    infoBox.appendChild(hint);

    var actions = document.createElement('div');
    actions.className = 'img-slot-actions';

    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    var uploadLabel = document.createElement('label');
    uploadLabel.className = 'btn btn-navy btn-sm';
    uploadLabel.htmlFor = slot + '-file';
    fileInput.id = slot + '-file';
    uploadLabel.innerHTML = '<i class="fas fa-upload"></i> Preview Override';
    uploadLabel.appendChild(fileInput);

    var removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn btn-red btn-sm';
    removeBtn.innerHTML = '<i class="fas fa-trash"></i> Reset to Default';

    var status = document.createElement('div');
    status.className = 'img-slot-status';

    function refresh() {
      var data = get(slot);
      var src = data || defaultFile(slot);
      if (src) {
        thumb.style.backgroundImage = 'url("' + src + '")';
        thumb.textContent = '';
      } else {
        thumb.style.backgroundImage = '';
        thumb.textContent = 'No image';
      }
      if (data && slot !== 'logo') {
        thumb.classList.add('override');
      } else {
        thumb.classList.remove('override');
      }
    }

    fileInput.addEventListener('change', function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      showStatus('Uploading…', '');
      upload(slot, file).then(function (ok) {
        if (ok) {
          refresh();
          showStatus('Preview override saved (this browser only).', 'ok');
        } else {
          showStatus('Could not save that image. Try a smaller file.', 'err');
        }
      });
      e.target.value = '';
    });

    removeBtn.addEventListener('click', function () {
      remove(slot);
      refresh();
      showStatus('Override removed — default file restored.', 'ok');
    });

    actions.appendChild(uploadLabel);
    actions.appendChild(removeBtn);

    div.appendChild(thumb);
    div.appendChild(infoBox);
    div.appendChild(actions);
    div.appendChild(status);

    function showStatus(msg, kind) {
      status.textContent = msg;
      status.className = 'img-slot-status show ' + kind;
      setTimeout(function () { status.classList.remove('show'); }, 4500);
    }

    refresh();
    return div;
  }

  return {
    registry: registry,
    groups: groups,
    defaults: DEFAULT,
    defaultFile: defaultFile,
    get: get,
    set: set,
    remove: remove,
    upload: upload,
    applyAll: applyAll,
    initHeroSlider: initHeroSlider,
    renderImageManager: renderImageManager
  };
})();
