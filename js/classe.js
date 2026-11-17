/* LabVirtyèl Ayiti — classes et échange de résultats SANS serveur.
   Principe :
   1. L'enseignant crée une classe et partage un CODE D'INVITATION (texte à copier, ex. par WhatsApp).
   2. L'étudiant colle ce code dans « Ma classe » : il voit les parcours assignés.
   3. L'étudiant envoie son CODE DE RÉSULTATS (ou un fichier .json) à l'enseignant.
   4. L'enseignant importe les codes reçus : le tableau de bord se met à jour.
   Les données restent dans le navigateur de chacun (localStorage). */

var CLASSE = (function () {
  var T_KEY = 'lv-teacher', S_KEY = 'lv-student';
  var INVITE = 'LVC1.', RESULT = 'LVR1.';

  /* ---------- encodage texte <-> code ---------- */
  function encode(prefix, obj) {
    var json = JSON.stringify(obj);
    var b64 = btoa(unescape(encodeURIComponent(json)));
    return prefix + b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function decode(prefix, code) {
    code = String(code || '').trim().replace(/\s+/g, '');
    if (code.indexOf(prefix) !== 0) return null;
    try {
      var b64 = code.slice(prefix.length).replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      return JSON.parse(decodeURIComponent(escape(atob(b64))));
    } catch (e) { return null; }
  }
  function uid(n) {
    var a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s = '';
    for (var i = 0; i < (n || 6); i++) s += a.charAt(Math.floor(Math.random() * a.length));
    return s;
  }

  /* ---------- stockage ---------- */
  function read(key, def) { try { return JSON.parse(localStorage.getItem(key)) || def; } catch (e) { return def; } }
  function write(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); return true; } catch (e) { return false; } }

  /* ---------- côté enseignant ---------- */
  function teacher() { return read(T_KEY, { classes: [] }); }
  function saveTeacher(t) { write(T_KEY, t); }
  function getClass(id) { return teacher().classes.filter(function (c) { return c.id === id; })[0]; }
  function updateClass(id, fn) {
    var t = teacher();
    t.classes.forEach(function (c) { if (c.id === id) fn(c); });
    saveTeacher(t);
  }
  function createClass(name, school, pathways) {
    var t = teacher();
    var c = { id: uid(6), name: name, school: school || '', created: Date.now(), pathways: pathways || [], students: {} };
    t.classes.unshift(c);
    saveTeacher(t);
    return c;
  }
  function deleteClass(id) {
    var t = teacher();
    t.classes = t.classes.filter(function (c) { return c.id !== id; });
    saveTeacher(t);
  }
  function inviteCode(c) { return encode(INVITE, { v: 1, id: c.id, name: c.name, school: c.school, p: c.pathways }); }

  /* Importe un code de résultats. Retourne {ok, msg, name}. */
  function importResult(classId, code) {
    var r = decode(RESULT, code);
    if (!r || !r.sid || !r.name) return { ok: false, msg: 'invalid' };
    if (r.cid !== classId) return { ok: false, msg: 'otherclass', name: r.name };
    updateClass(classId, function (c) {
      var prev = c.students[r.sid];
      if (prev && prev.updated > r.t) return;           /* on garde la version la plus récente */
      c.students[r.sid] = { name: r.name, done: r.d || {}, quiz: r.q || {}, updated: r.t };
    });
    return { ok: true, name: r.name };
  }

  /* ---------- côté étudiant ---------- */
  function student() { return read(S_KEY, null); }
  function joinClass(name, invite) {
    var c = decode(INVITE, invite);
    if (!c || !c.id) return null;
    var prev = student();
    var s = { name: name, sid: (prev && prev.sid) || uid(10), cls: { id: c.id, name: c.name, school: c.school, pathways: c.p || [] } };
    write(S_KEY, s);
    return s;
  }
  function leaveClass() { try { localStorage.removeItem(S_KEY); } catch (e) { /* rien */ } }

  /* Code de résultats : seulement les ressources des parcours assignés (code plus court). */
  function resultCode() {
    var s = student();
    if (!s) return '';
    var prog = APP.load(), ids = {};
    s.cls.pathways.forEach(function (pid) { var p = APP.pathway(pid); if (p) p.steps.forEach(function (id) { ids[id] = 1; }); });
    var d = {}, q = {};
    Object.keys(ids).forEach(function (id) {
      if (prog.done[id]) d[id] = 1;
      if (prog.quiz[id]) q[id] = [prog.quiz[id].score, prog.quiz[id].total];
    });
    return encode(RESULT, { v: 1, cid: s.cls.id, sid: s.sid, name: s.name, t: Date.now(), d: d, q: q });
  }

  /* ---------- statistiques d'un étudiant sur un parcours ---------- */
  function pathStats(st, p) {
    var n = p.steps.filter(function (id) { return st.done[id]; }).length;
    var quizzes = p.steps.filter(function (id) { return st.quiz[id]; });
    var qs = quizzes.reduce(function (s, id) { return s + st.quiz[id][0] / st.quiz[id][1]; }, 0);
    return { n: n, total: p.steps.length, pct: Math.round(n / p.steps.length * 100), quiz: quizzes.length ? qs / quizzes.length : null };
  }

  /* ---------- outils ---------- */
  function copy(text, btn, okLabel) {
    function done() { if (btn) { var old = btn.textContent; btn.textContent = okLabel; setTimeout(function () { btn.textContent = old; }, 1600); } }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback); else fallback();
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) { /* rien */ }
      document.body.removeChild(ta); done();
    }
  }
  function download(filename, text, type) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: type || 'text/plain' }));
    a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  /* ---------- classe de démonstration ---------- */
  function demoClass() {
    var c = createClass('L1 Sciences · Groupe A', 'Université (démo)', ['p-physique', 'p-chimie', 'p-sante']);
    var names = ['Jean-Marc Pierre', 'Nadège Joseph', 'Wilson Charles', 'Rose-Mirlande Louis', 'Kervens Paul', 'Fabienne Étienne', 'Ricardo Saint-Fleur', 'Djenane Dorval'];
    /* progression fixe (pas de hasard) pour une démo reproductible : nombre d'étapes faites par parcours, score de quiz */
    var plan = [[3, 3, 3, 3, 3, 2], [3, 2, 2, 1, 3, 3], [2, 0, 1, 0, 0, 0], [3, 3, 3, 3, 2, 3], [1, 0, 0, 0, 0, 0], [3, 3, 2, 3, 3, 1], [3, 1, 3, 2, 1, 0], [0, 0, 0, 0, 0, 0]];
    updateClass(c.id, function (k) {
      names.forEach(function (name, i) {
        var st = { name: name, done: {}, quiz: {}, updated: Date.now() - i * 36e5 * 7 };
        k.pathways.forEach(function (pid, j) {
          var p = APP.pathway(pid), steps = plan[i][j * 2], score = plan[i][j * 2 + 1];
          p.steps.slice(0, steps).forEach(function (id) {
            st.done[id] = 1;
            if (APP.resource(id).type === 'quiz') st.quiz[id] = [score, 3];
          });
        });
        if (i !== 7) k.students['DEMO' + i] = st;
      });
    });
    return c;
  }

  return {
    teacher: teacher, getClass: getClass, updateClass: updateClass, createClass: createClass, deleteClass: deleteClass,
    inviteCode: inviteCode, importResult: importResult, student: student, joinClass: joinClass, leaveClass: leaveClass,
    resultCode: resultCode, pathStats: pathStats, copy: copy, download: download, demoClass: demoClass, uid: uid
  };
})();
