/* Store navigation for products other than HiddenForm, which retains its consented tracking. */
(() => {
  'use strict';
  const app = document.body.dataset.downloadApp;
  if (!app || app === 'hiddenform') return;
  const ua = navigator.userAgent || '';
  const platform = navigator.userAgentData?.platform || navigator.platform || '';
  const ios = /iPhone|iPad|iPod/i.test(ua) || (/Mac/i.test(platform) && navigator.maxTouchPoints > 1);
  const android = /Android/i.test(ua);
  const store = ios ? 'app_store' : android ? 'google_play' : null;
  if (!store) return;
  const link = document.querySelector(`[data-store="${store}"]`);
  const status = document.getElementById('redirect-status');
  if (!link) {
    const name = document.body.dataset.appName;
    status.textContent = `${name} isn’t available for ${ios ? 'iOS' : 'Android'} yet. Check the available options below.`;
    return;
  }
  status.textContent = `Opening ${ios ? 'App Store' : 'Google Play'}…`;
  const go = () => location.replace(link.href);
  if (window.fiveorbitTrackRedirect) window.fiveorbitTrackRedirect(app, store, link.href, go);
  else go();
})();
