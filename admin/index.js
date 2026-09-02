/* SHIELDTECH — Decap CMS bootstrap.
 *
 * The CDN script (decap-cms.js) auto-initializes from admin/config.yml.
 * To log in with Netlify Identity + Git Gateway, Decap must receive the
 * Identity widget's init/auth events. This wiring is required.
 */
(function () {
  if (!window.netlifyIdentity) {
    console.warn('Netlify Identity widget not loaded. Admin login will not work.');
  }

  if (window.netlifyIdentity && window.CMS) {
    window.netlifyIdentity.on('init', function (user) {
      if (!user) {
        window.netlifyIdentity.on('login', function () {
          document.location.reload();
        });
      }
    });

    window.netlifyIdentity.on('login', function () {
      document.location.reload();
    });

    window.netlifyIdentity.on('logout', function () {
      document.location.reload();
    });

    // Use netlifyIdentity as the identity callback in the CMS.
    window.CMS.registerEventListener && window.CMS.registerEventListener({
      'authRequired': function () { window.netlifyIdentity.open(); }
    }, function () {});
  }
})();
