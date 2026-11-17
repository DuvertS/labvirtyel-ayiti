/* LabVirtyèl Ayiti — comptes des participants (Supabase).
   Dépend de : js/vendor/supabase.js, js/config.js, js/common.js (LV).
   - AUTH.client     : client Supabase (session gardée sur l'appareil, utilisable hors ligne)
   - AUTH.ready      : promesse → profil du participant connecté (ou null)
   - AUTH.cached()   : dernier profil connu (hors ligne)
   - AUTH.syncSoon() : envoie la progression locale au serveur
   - AUTH.signOut()  : déconnexion */
var AUTH = (function () {
  var cfg = window.LV_SUPABASE;
  var client = window.supabase.createClient(cfg.url, cfg.anonKey, {
    auth: { storageKey: cfg.storageKey, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  var PKEY = 'lv-account', OWNER = 'lv-progress-owner', PROG = 'lv-progress';

  function get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* stockage indisponible */ } }
  function del(k) { try { localStorage.removeItem(k); } catch (e) { /* rien */ } }
  function cached() { return get(PKEY); }
  function base() { var s = document.querySelector('script[src$="js/auth.js"]'); return s ? s.src.replace(/js\/auth\.js.*$/, '') : ''; }
  function isTeacher(p) { return !!p && (p.role === 'enseignant' || p.role === 'admin') && p.status === 'actif'; }
  function isAdmin(p) { return !!p && p.role === 'admin' && p.status === 'actif'; }

  /* Un autre participant sur le même appareil : on repart d'une progression vide */
  function claimLocalProgress(uid) {
    if (get(OWNER) !== uid) { del(PROG); set(OWNER, uid); return true; }
    return false;
  }

  /* Progression : fusion serveur → appareil, puis appareil → serveur */
  async function pullProgress(uid) {
    var r = await client.from('progress').select('resource_id,done_at,score,total').eq('user_id', uid);
    if (r.error || !r.data) return;
    var s = get(PROG) || { done: {}, quiz: {} };
    r.data.forEach(function (row) {
      if (!s.done[row.resource_id]) s.done[row.resource_id] = Date.parse(row.done_at);
      if (row.total && !s.quiz[row.resource_id]) s.quiz[row.resource_id] = { score: row.score, total: row.total };
    });
    set(PROG, s);
  }
  async function pushProgress(uid) {
    var s = get(PROG);
    if (!s || !s.done) return;
    var rows = Object.keys(s.done).map(function (id) {
      var q = s.quiz && s.quiz[id];
      return { user_id: uid, resource_id: id, done_at: new Date(s.done[id]).toISOString(), score: q ? q.score : null, total: q ? q.total : null };
    });
    if (rows.length) await client.from('progress').upsert(rows, { onConflict: 'user_id,resource_id' });
  }
  var timer = null;
  function syncSoon() {
    clearTimeout(timer);
    timer = setTimeout(function () { var p = cached(); if (p && navigator.onLine) pushProgress(p.id).catch(function () {}); }, 1500);
  }

  /* Liens du menu selon le rôle */
  function decorate(p) {
    var nav = document.querySelector('header.site nav');
    if (!nav || !p || nav.querySelector('[data-auth-link]')) return;
    var here = location.pathname.split('/').pop();
    var links = [['communaute.html', 'Communauté', 'Kominote']];
    if (isTeacher(p)) links.push(['contribuer.html', 'Mes ressources', 'Resous mwen']);
    if (isAdmin(p)) links.push(['admin.html', 'Administration', 'Administrasyon']);
    links.forEach(function (l) {
      var a = document.createElement('a');
      a.href = base() + l[0]; a.setAttribute('data-auth-link', '');
      a.setAttribute('data-fr', l[1]); a.setAttribute('data-ht', l[2]);
      a.textContent = LV.t(l[1], l[2]);
      if (here === l[0]) a.className = 'active';
      nav.appendChild(a);
    });
  }

  function toAccount(reason) {
    location.replace(base() + 'compte.html' + (reason ? '?' + reason + '=1' : ''));
  }

  async function load() {
    var sres = await client.auth.getSession();
    var session = sres.data && sres.data.session;
    if (!session) return null;
    var uid = session.user.id;
    var fresh = claimLocalProgress(uid);
    var p = cached();
    if (navigator.onLine) {
      var r = await client.from('profiles').select('*').eq('id', uid).maybeSingle();
      if (r.data) {
        p = r.data; set(PKEY, p);
        /* Le nom du compte sert aussi pour « Ma classe » */
        var lp = get('lv-profile') || {};
        if (!lp.name) { lp.name = p.full_name; lp.school = p.school; set('lv-profile', lp); }
        if (p.status !== 'actif') { await signOut(); toAccount('suspendu'); return null; }
        var today = new Date().toISOString().slice(0, 10);
        if (!p.last_seen || p.last_seen.slice(0, 10) !== today) {
          client.from('profiles').update({ last_seen: new Date().toISOString() }).eq('id', uid).then(function () {});
        }
        if (fresh) await pullProgress(uid).catch(function () {});
        pushProgress(uid).catch(function () {});
      } else if (r.error && /JWT|token|401/i.test(r.error.message || '')) {
        await signOut(); toAccount('expire'); return null;
      }
    }
    if (p && p.id !== uid) p = null;
    return p;
  }

  async function signOut() {
    try { await client.auth.signOut(); } catch (e) { /* hors ligne : on efface localement */ }
    del(cfg.storageKey); del(PKEY);
  }

  var ready = load().catch(function () { return cached(); });
  ready.then(function (p) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { decorate(p); });
    else decorate(p);
  });

  return {
    client: client, ready: ready, cached: cached, syncSoon: syncSoon, signOut: signOut,
    isTeacher: isTeacher, isAdmin: isAdmin, base: base
  };
})();
