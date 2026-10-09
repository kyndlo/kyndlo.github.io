(() => {
  'use strict';
  const ID = 'G-1WQP76REKQ';
  const consentKey = 'fiveorbit_analytics_consent';
  const campaignKey = 'hiddenform_campaign';
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const clean = value => (value || '').replace(/[^a-zA-Z0-9_.-]/g, '').slice(0, 100);
  const read = (storage, key) => { try { return storage.getItem(key); } catch { return null; } };
  const write = (storage, key, value) => { try { storage.setItem(key, value); } catch {} };
  let campaign = {};
  try { campaign = JSON.parse(read(sessionStorage, campaignKey) || '{}'); } catch {}
  const query = new URLSearchParams(location.search);
  if (keys.some(key => query.has(key))) {
    campaign = Object.fromEntries(keys.map(key => [key, clean(query.get(key))]).filter(([, value]) => value));
    write(sessionStorage, campaignKey, JSON.stringify(campaign));
  }
  const gamePage = location.pathname.startsWith('/hiddenform/') || location.pathname.startsWith('/whim-and-wood-support/download/');
  let enabled = false;
  let consent = read(localStorage, consentKey) || (gamePage ? read(localStorage, 'hiddenform_analytics_consent') : null);
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  function enable() {
    // Local previews must not send development traffic to the production property.
    if (['localhost', '127.0.0.1', '::1', '[::1]'].includes(location.hostname)) return;
    if (enabled) return;
    enabled = true;
    gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    gtag('js', new Date());
    const page = new URL(location.pathname, location.origin);
    for (const [key, value] of Object.entries(campaign)) if (keys.includes(key)) page.searchParams.set(key, clean(value));
    let referrer = '';
    try { referrer = new URL(document.referrer).origin; } catch {}
    gtag('config', ID, { send_page_view: true, page_title: document.title, app_slug: appForPath(location.pathname) || 'studio', page_type: location.pathname.includes('/download/') ? 'download' : appForPath(location.pathname) ? 'app' : 'home', page_location: page.href, page_referrer: referrer, allow_google_signals: false, allow_ad_personalization_signals: false });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ID}`;
    document.head.append(script);
  }
  const catalog = [
    ['hiddenform', '6809650487', 'com.whimandwood.puzzle.android'],
    ['prism-lines', '6802463384', 'com.kyndlo.prismlines'],
    ['kyndlo', '6759362309', 'com.kyndlo.app'],
    ['daily-spirit', '6815262538', null]
  ];
  function appForPath(path) {
    if (path.startsWith('/whim-and-wood-support/')) return 'hiddenform';
    return catalog.find(([slug]) => path.startsWith('/' + slug + '/'))?.[0] || null;
  }
  function appOf(url) {
    if (url.hostname === 'apps.apple.com') return catalog.find(([,id]) => url.pathname.endsWith('/id' + id))?.[0] || null;
    if (url.hostname === 'play.google.com') return catalog.find(([, ,id]) => id && url.searchParams.get('id') === id)?.[0] || null;
    return url.origin === location.origin ? appForPath(url.pathname) : null;
  }
  function storeOf(url) {
    return appOf(url) ? url.hostname === 'apps.apple.com' ? 'app_store' : url.hostname === 'play.google.com' ? 'google_play' : null : null;
  }
  function parameters(app, store, url) {
    return {app_slug: app, game: app, store, page_type: location.pathname.includes('/download/') ? 'download' : appForPath(location.pathname) ? 'app' : 'home', link_url: url, transport_type: 'beacon'};
  }
  window.fiveorbitTrackRedirect = (app, store, url, go) => {
    if (!enabled || consent !== 'granted') { go(); return; }
    let done = false;
    const once = () => { if (!done) { done = true; go(); } };
    gtag('event', 'store_redirect', {...parameters(app, store, url), event_callback: once, event_timeout: 800});
    setTimeout(once, 900);
  };
  function prepareLinks() {
    for (const link of document.querySelectorAll('a[href]')) {
      const url = new URL(link.href);
      const store = storeOf(url);
      if (store === 'google_play') {
        url.searchParams.set('utm_source', clean(campaign.utm_source) || (appOf(url) === 'hiddenform' ? 'kindlo' : 'fiveorbit'));
        url.searchParams.set('utm_campaign', clean(campaign.utm_campaign) || appOf(url) + '_website');
        url.searchParams.set('utm_medium', clean(campaign.utm_medium) || 'website');
        link.href = url.href;
      } else if (store === 'app_store') {
        const label = clean([campaign.utm_source, campaign.utm_campaign, campaign.utm_content].filter(Boolean).join('.')) || appOf(url) + '_website';
        let hash = 2166136261;
        for (const char of label) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
        const token = label.length <= 30 ? label : `${label.slice(0, 21)}.${(hash >>> 0).toString(16).padStart(8, '0')}`;
        if (appOf(url) === 'hiddenform') url.searchParams.set('pt', '128479651');
        url.searchParams.set('ct', token);
        url.searchParams.set('mt', '8');
        link.href = url.href;
      } else if (url.origin === location.origin && appForPath(url.pathname)) {
        for (const [key, value] of Object.entries(campaign)) if (keys.includes(key)) url.searchParams.set(key, clean(value));
        link.href = url.href;
      }
    }
  }
  function showChoices() {
    document.getElementById('hiddenform-analytics-choice')?.remove();
    const box = document.createElement('aside');
    box.id = 'hiddenform-analytics-choice';
    box.setAttribute('aria-label', 'Website analytics choices');
    box.className = 'analytics-panel';
    // This script is also loaded by the separate support Pages project, so keep
    // portable fallback styles for pages that do not yet load studio.css.
    box.style.cssText = 'position:fixed;bottom:20px;left:20px;right:20px;z-index:1000;max-width:640px;margin:auto;padding:22px 24px;background:#151d32;color:#f5f6fc;border:1px solid #526080;border-radius:18px;box-shadow:0 10px 40px #0008;font:15px/1.65 Manrope,system-ui,sans-serif';
    const text = document.createElement('p');
    text.textContent = 'Allow Google Analytics to measure visits and download-button clicks across FiveOrbit Studio and our app pages? Downloading works with either choice.';
    box.append(text);
    for (const [label, choice] of [['Allow analytics', 'granted'], ['No thanks', 'denied']]) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.className = 'analytics-button';
      button.style.cssText = `font:700 14px/1.5 Manrope,system-ui,sans-serif;cursor:pointer;border:1px solid #6b7699;border-radius:30px;padding:10px 17px;margin:14px 10px 0 0;background:${choice === 'granted' ? '#ac8bff' : 'transparent'};color:${choice === 'granted' ? '#080c19' : '#f5f6fc'}`;
      button.addEventListener('click', () => {
        consent = choice;
        write(localStorage, consentKey, choice);
        if (choice === 'granted') { window[`ga-disable-${ID}`] = false; gtag('consent', 'update', { analytics_storage: 'granted' }); enable(); }
        else { window[`ga-disable-${ID}`] = true; gtag('consent', 'update', { analytics_storage: 'denied' }); enabled = false; }
        if (choice === 'granted') window[`ga-disable-${ID}`] = false;
        box.remove();
      });
      box.append(button);
    }
    const privacy = document.createElement('a');
    privacy.href = '/hiddenform/privacy.html';
    privacy.textContent = 'How analytics works';
    privacy.className = 'analytics-privacy';
    privacy.style.cssText = 'display:block;color:#57dbed;font-size:13px;margin-top:14px;text-decoration:underline;text-underline-offset:3px';
    box.append(privacy);
    document.body.append(box);
  }
  prepareLinks();
  if (consent === 'granted') enable();
  const downloadPage = location.pathname.startsWith('/whim-and-wood-support/download/') || location.pathname.startsWith('/hiddenform/download/');
  const ua = navigator.userAgent || '';
  const platform = navigator.userAgentData?.platform || navigator.platform || '';
  const ios = /iPhone|iPad|iPod/i.test(ua) || (/Mac/i.test(platform) && navigator.maxTouchPoints > 1);
  const android = /Android/i.test(ua);
  const automaticStore = downloadPage ? (ios ? 'app_store' : android ? 'google_play' : null) : null;
  const mobileDownload = (document.body.dataset.downloadApp || downloadPage) && (ios || android);
  if (!consent && !mobileDownload) showChoices();
  {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Analytics choices';
    button.className = 'analytics-settings';
    button.style.cssText = 'display:block;margin:0 auto 30px;padding:8px 16px;color:#b4b7cc;background:transparent;border:1px solid #6b7699;border-radius:30px;font:700 12px/1.5 Manrope,system-ui,sans-serif;cursor:pointer';
    button.addEventListener('click', showChoices);
    document.body.append(button);
  }
  if (automaticStore) {
    const link = [...document.querySelectorAll('a[href]')].find(link => storeOf(new URL(link.href)) === automaticStore);
    if (link) {
      (document.getElementById('redirect-status') || document.getElementById('status')).textContent = `Opening ${automaticStore === 'app_store' ? 'App Store' : 'Google Play'}…`;
      let navigated = false;
      const go = () => { if (!navigated) { navigated = true; location.replace(link.href); } };
      if (enabled) {
        gtag('event', 'store_redirect', { ...parameters('hiddenform', automaticStore, link.href), event_callback: go, event_timeout: 800 });
        setTimeout(go, 900);
      } else go();
    }
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const url = new URL(link.href);
    const store = storeOf(url);
    const cta = url.origin === location.origin && appForPath(url.pathname) && url.pathname.includes('/download/');
    if (!enabled || consent !== 'granted') return;
    if (!store && !cta) {
      const app = appOf(url) || (url.origin === location.origin && catalog.find(([slug]) => url.hash === '#' + slug)?.[0]);
      if (app) gtag('event', 'app_explore', parameters(app, 'none', url.origin + url.pathname + url.hash));
      else if (url.protocol === 'mailto:') gtag('event', 'contact_click', {page_type: appForPath(location.pathname) ? 'app' : 'home', transport_type: 'beacon'});
      return;
    }
    const params = parameters(appOf(url), store || 'store_selector', url.href);
    if (store && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && link.target !== '_blank') {
      event.preventDefault();
      let navigated = false;
      const go = () => { if (!navigated) { navigated = true; location.assign(url.href); } };
      params.event_callback = go;
      params.event_timeout = 800;
      gtag('event', 'download_click', params);
      setTimeout(go, 900);
    } else gtag('event', store ? 'download_click' : 'download_cta_click', params);
  });
})();
