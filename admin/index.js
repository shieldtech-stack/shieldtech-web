/* SHIELDTECH — Decap CMS bootstrap.
 *
 * The CDN script (decap-cms.js) auto-initializes from admin/config.yml.
 * To log in with Netlify Identity + Git Gateway, Decap must receive the
 * Identity widget's init/auth events. Standard Netlify wiring.
 */
(function () {
  if (!window.netlifyIdentity) {
    console.warn('Netlify Identity widget not loaded. Admin login will not work.');
    return;
  }
  if (!window.CMS) {
    console.warn('Decap CMS not loaded.');
    return;
  }

  function reload() {
    window.location.reload();
  }

  /* If already logged in, refresh so the CMS picks up the active session. */
  if (window.netlifyIdentity.currentUser()) {
    reload();
    return;
  }

  window.netlifyIdentity.on('init', function (user) {
    if (!user) {
      window.netlifyIdentity.on('login', reload);
    }
  });

  window.netlifyIdentity.on('login', reload);
  window.netlifyIdentity.on('logout', reload);

  /* Use netlifyIdentity as the identity callback in the CMS. */
  window.CMS.registerEventListener &&
    window.CMS.registerEventListener(
      { authRequired: function () { window.netlifyIdentity.open(); } },
      function () {}
    );
})();
