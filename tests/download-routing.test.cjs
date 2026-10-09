const {readFileSync} = require('node:fs');
const {resolve} = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = resolve(__dirname, '..');
const apps = JSON.parse(readFileSync(resolve(root, 'data/apps.json'), 'utf8'));
const analytics = readFileSync(resolve(root, 'scripts/hiddenform-analytics.js'), 'utf8');
const routing = readFileSync(resolve(root, 'scripts/download.js'), 'utf8');

const devices = [
  ['iPhone', 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X)', 'iPhone', 5, 'apple'],
  ['iPad', 'Mozilla/5.0 (iPad; CPU OS 26_0 like Mac OS X)', 'iPad', 5, 'apple'],
  ['desktop-mode iPad', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', 'MacIntel', 5, 'apple'],
  ['Android', 'Mozilla/5.0 (Linux; Android 16; Pixel 9)', 'Linux armv8l', 5, 'google'],
  ['Mac desktop', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', 'MacIntel', 0, null],
  ['Windows desktop', 'Mozilla/5.0 (Windows NT 10.0)', 'Win32', 0, null],
  ['unknown', 'Unknown device', '', 0, null],
];

function simulate(app, device, {consent=null, studioConsent=null, legacy=false, hostname='kindlo.app', query='', storageBlocked=false, page=null}={}) {
  const [name,userAgent,platform,maxTouchPoints] = device;
  const path = page || (legacy ? '/whim-and-wood-support/download/' : `/${app.slug}/download/`);
  const source = readFileSync(resolve(root, `${path.slice(1)}index.html`), 'utf8');
  const links = [...source.matchAll(/<a\b([^>]+)>/g)].map(([,attrs])=>({
    href: new URL((attrs.match(/href="([^"]+)"/)||[])[1]?.replaceAll('&amp;','&') || '/',`https://${hostname}`).href,
    store: (attrs.match(/data-store="([^"]+)"/)||[])[1]
  }));
  const status={textContent:'Store choices'};
  const callbacks={}, scheduled=[], navigations=[], inserted=[];
  const storage = initial => ({getItem(k){if(storageBlocked)throw Error('blocked');return initial[k]||null;},setItem(k,v){if(storageBlocked)throw Error('blocked');initial[k]=v;}});
  const element = tag => ({tag,style:{},children:[],setAttribute(){},append(...children){this.children.push(...children);},remove(){},addEventListener(type,fn){this[type]=fn;}});
  const document = {
    body:{dataset:{downloadApp:path.endsWith('/download/')?app.slug:undefined,appName:app.name},append(el){inserted.push(el);}},
    head:{append(el){inserted.push(el);}},referrer:'',
    querySelectorAll(){return links;},
    querySelector(selector){return links.find(l=>l.store===selector.match(/data-store="([^"]+)"/)[1]);},
    getElementById(id){return ['redirect-status','status'].includes(id)?status:null;},
    createElement:element,
    addEventListener(type,fn){callbacks[type]=fn;},
  };
  const location={pathname:path,origin:`https://${hostname}`,hostname,search:query,
    replace(url){navigations.push(['replace',url]);},assign(url){navigations.push(['assign',url]);}};
  const context={document,location,navigator:{userAgent,platform,maxTouchPoints},
    localStorage:storage({hiddenform_analytics_consent:consent,fiveorbit_analytics_consent:studioConsent}),sessionStorage:storage({}),
    URL,URLSearchParams,setTimeout(fn,ms){scheduled.push({fn,ms});},window:{}};
  vm.runInNewContext(analytics,context);
  if(path.endsWith('/download/')) vm.runInNewContext(routing,context);
  return {context,links,status,callbacks,scheduled,navigations,inserted};
}

let cases=0;
for(const app of apps) for(const device of devices) {
  const expected = device[4] && app[device[4]];
  const run = simulate(app,device);
  assert.equal(run.navigations.length,expected?1:0,`${app.name}: ${device[0]}`);
  if(expected) {
    const actual=new URL(run.navigations[0][1]), target=new URL(expected);
    assert.equal(actual.hostname,target.hostname);
    assert.equal(actual.pathname,target.pathname);
    if(device[4]==='google') assert.equal(actual.searchParams.get('id'),target.searchParams.get('id'));
  }
  if(device[4]&&!expected&&app.slug!=='hiddenform') assert.match(run.status.textContent,/isn’t available/);
  assert.equal(run.inserted.filter(x=>x.tag==='script').length,0,'No unconsented analytics');
  cases++;
}

for(const consent of [null,'denied','granted']) for(const legacy of [false,true]) {
  const run = simulate(apps[0],devices[0],{consent,legacy,query:'?utm_source=instagram&utm_campaign=launch&utm_content=creative'});
  if(consent==='granted') {
    assert.equal(run.navigations.length,0,'Consent-enabled navigation waits for callback or bounded fallback');
    assert.ok(run.scheduled.some(t=>t.ms===900));
    for(const timer of run.scheduled) timer.fn();
    assert.equal(run.navigations.length,1);
    // Blocked GA callback later must not produce a second navigation.
    const event=run.context.window.dataLayer.find(a=>a[0]==='event'&&a[1]==='store_redirect');
    event[2].event_callback();
    assert.equal(run.navigations.length,1);
  }
  const url=new URL(run.navigations[0][1]);
  assert.equal(url.searchParams.get('pt'),'128479651');
  assert.equal(url.searchParams.get('ct'),'instagram.launch.creative');
  cases++;
}
const android=simulate(apps[0],devices[3],{query:'?utm_source=ad&utm_medium=paid&utm_campaign=launch'});
const play=new URL(android.navigations[0][1]);
assert.equal(play.searchParams.get('utm_source'),'ad');
assert.equal(play.searchParams.get('utm_campaign'),'launch');
assert.equal(play.searchParams.get('utm_medium'),'paid');
cases++;

const desktop=simulate(apps[0],devices[4],{consent:'granted'});
const link=desktop.links.find(l=>l.store==='google_play');
let prevented=false;
desktop.callbacks.click({target:{closest(){return link;}},preventDefault(){prevented=true;}});
assert.equal(prevented,true);
assert.equal(desktop.navigations.length,0);
desktop.scheduled.forEach(t=>t.fn());
assert.equal(desktop.navigations.length,1);
cases++;

const local=simulate(apps[0],devices[0],{consent:'granted',hostname:'127.0.0.1'});
assert.equal(local.inserted.filter(x=>x.tag==='script').length,0,'No production analytics in local preview');
assert.equal(local.navigations.length,1);
cases++;
const blocked=simulate(apps[0],devices[3],{storageBlocked:true});
assert.equal(blocked.navigations.length,1,'Downloads work with blocked storage');
cases++;
const campaign=simulate(apps[0],devices[4],{page:'/hiddenform/',query:'?utm_source=ad&utm_campaign=launch'});
assert.equal(campaign.navigations.length,0,'Browsing product pages never auto-redirects');
const cta=campaign.links.find(l=>new URL(l.href).pathname==='/hiddenform/download/');
assert.equal(new URL(cta.href).searchParams.get('utm_source'),'ad','Campaign follows new download CTA');
cases++;
// Studio-wide tracking must respect the new consent scope and preserve navigation.
for (const app of apps) {
  const run=simulate(app,devices[4],{studioConsent:'granted',page:`/${app.slug}/`,query:'?utm_source=launch&utm_campaign=studio'});
  const config=run.context.window.dataLayer.find(a=>a[0]==='config');
  assert.equal(config[1],'G-1WQP76REKQ');
  assert.equal(config[2].app_slug,app.slug);
  assert.equal(config[2].page_type,'app');
  assert.equal(config[2].send_page_view,true);
  const cta=run.links.find(l=>new URL(l.href).pathname===`/${app.slug}/download/`);
  assert.equal(new URL(cta.href).searchParams.get('utm_campaign'),'studio');
  run.callbacks.click({target:{closest(){return cta;}}});
  const event=run.context.window.dataLayer.find(a=>a[0]==='event'&&a[1]==='download_cta_click');
  assert.equal(event[2].app_slug,app.slug);
  cases++;
}
for(const app of apps.slice(1,3)) {
  const run=simulate(app,devices[3],{studioConsent:'granted',query:'?utm_source=launch&utm_campaign=studio'});
  assert.equal(run.navigations.length,0);
  const event=run.context.window.dataLayer.find(a=>a[0]==='event'&&a[1]==='store_redirect');
  assert.equal(event[2].app_slug,app.slug);
  assert.equal(event[2].store,'google_play');
  assert.equal(new URL(event[2].link_url).searchParams.get('utm_campaign'),'studio');
  run.scheduled.forEach(t=>t.fn());event[2].event_callback();
  assert.equal(run.navigations.length,1);
  cases++;
}
const oldConsent=simulate(apps[1],devices[4],{consent:'granted',page:'/prism-lines/'});
assert.equal(oldConsent.inserted.filter(x=>x.tag==='script').length,0,'Old HiddenForm consent does not silently expand to other apps');
cases++;
for(const consent of [null,'denied']) {
  const run=simulate(apps[2],devices[3],{studioConsent:consent});
  assert.equal(run.inserted.filter(x=>x.tag==='script').length,0);
  assert.equal(run.navigations.length,1);
  cases++;
}
const home=simulate(apps[0],devices[4],{studioConsent:'granted',page:'/'});
assert.equal(home.context.window.dataLayer.find(a=>a[0]==='config')[2].app_slug,'studio');
cases++;
const studioLocal=simulate(apps[1],devices[3],{studioConsent:'granted',hostname:'127.0.0.1'});
assert.equal(studioLocal.inserted.filter(x=>x.tag==='script').length,0);
assert.equal(studioLocal.navigations.length,1);
cases++;
console.log(`${cases} routing / campaign / consent cases passed; no live network requests.`);
