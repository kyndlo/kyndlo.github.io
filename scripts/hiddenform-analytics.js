(() => {
  'use strict';
  const ID = 'G-1WQP76REKQ';
  const consentKey = 'hiddenform_analytics_consent';
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
  let consent = read(localStorage, consentKey);
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  function enable() {
    if (enabled) return;
    enabled = true;
    gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    gtag('js', new Date());
    const page = new URL(location.pathname, location.origin);
    for (const [key, value] of Object.entries(campaign)) if (keys.includes(key)) page.searchParams.set(key, clean(value));
    let referrer = '';
    try { referrer = new URL(document.referrer).origin; } catch {}
    gtag('config', ID, { send_page_view: gamePage, page_location: page.href, page_referrer: referrer, allow_google_signals: false, allow_ad_personalization_signals: false });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ID}`;
    document.head.append(script);
  }
  function storeOf(url) {
    if (url.hostname === 'apps.apple.com' && url.pathname.includes('6809650487')) return 'app_store';
    if (url.hostname === 'play.google.com' && url.searchParams.get('id') === 'com.whimandwood.puzzle.android') return 'google_play';
    return null;
  }
  function prepareLinks() {
    for (const link of document.querySelectorAll('a[href]')) {
      const url = new URL(link.href);
      const store = storeOf(url);
      if (store === 'google_play') {
        url.searchParams.set('utm_source', clean(campaign.utm_source) || 'kindlo');
        url.searchParams.set('utm_campaign', clean(campaign.utm_campaign) || 'hiddenform_website');
        url.searchParams.set('utm_medium', clean(campaign.utm_medium) || 'website');
        link.href = url.href;
      } else if (store === 'app_store') {
        const label = clean([campaign.utm_source, campaign.utm_campaign, campaign.utm_content].filter(Boolean).join('.')) || 'hiddenform_website';
        let hash = 2166136261;
        for (const char of label) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
        const token = label.length <= 30 ? label : `${label.slice(0, 21)}.${(hash >>> 0).toString(16).padStart(8, '0')}`;
        url.searchParams.set('pt', '128479651');
        url.searchParams.set('ct', token);
        url.searchParams.set('mt', '8');
        link.href = url.href;
      } else if (url.origin === location.origin && (url.pathname.startsWith('/hiddenform/') || url.pathname.startsWith('/whim-and-wood-support/download/'))) {
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
    box.style.cssText = 'position:fixed;bottom:16px;left:16px;right:16px;z-index:1000;max-width:640px;margin:auto;padding:20px;background:#fcfaf3;color:#29271f;border:1px solid #b9b1a1;border-radius:12px;box-shadow:0 6px 28px #0002;font:16px/1.5 system-ui';
    const text = document.createElement('p');
    text.textContent = 'Allow Google Analytics to measure visits and download-button clicks for HiddenForm? Downloading works with either choice.';
    box.append(text);
    for (const [label, choice] of [['Allow analytics', 'granted'], ['No thanks', 'denied']]) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.style.cssText = 'padding:10px 16px;margin:4px;border:1px solid #777;border-radius:6px;background:white;color:#29271f;cursor:pointer';
      button.addEventListener('click', () => {
        consent = choice;
        write(localStorage, consentKey, choice);
        if (choice === 'granted') enable();
        else { window[`ga-disable-${ID}`] = true; gtag('consent', 'update', { analytics_storage: 'denied' }); enabled = false; }
        if (choice === 'granted') window[`ga-disable-${ID}`] = false;
        box.remove();
      });
      box.append(button);
    }
    const privacy = document.createElement('a');
    privacy.href = '/hiddenform/privacy.html';
    privacy.textContent = 'How analytics works';
    privacy.style.cssText = 'display:block;margin-top:8px';
    box.append(privacy);
    document.body.append(box);
  }
  prepareLinks();
  if (gamePage && consent === 'granted') enable();
  const downloadPage = location.pathname.startsWith('/whim-and-wood-support/download/');
  const ua = navigator.userAgent || '';
  const platform = navigator.userAgentData?.platform || navigator.platform || '';
  const ios = /iPhone|iPad|iPod/i.test(ua) || (/Mac/i.test(platform) && navigator.maxTouchPoints > 1);
  const android = /Android/i.test(ua);
  const automaticStore = downloadPage ? (ios ? 'app_store' : android ? 'google_play' : null) : null;
  if (gamePage && !consent && !automaticStore) showChoices();
  if (gamePage) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Analytics choices';
    button.style.cssText = 'display:block;margin:20px auto;padding:8px 12px';
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
        gtag('event', 'store_redirect', { game: 'hiddenform', store: automaticStore, link_url: link.href, transport_type: 'beacon', event_callback: go, event_timeout: 800 });
        setTimeout(go, 900);
      } else go();
    }
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const url = new URL(link.href);
    const store = storeOf(url);
    const cta = url.origin === location.origin && url.pathname.startsWith('/whim-and-wood-support/download/');
    if (!enabled || consent !== 'granted' || (!store && !cta)) return;
    const params = { game: 'hiddenform', store: store || 'store_selector', link_url: url.href, transport_type: 'beacon' };
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
