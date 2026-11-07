'use strict';
(() => {
  const $ = s => document.querySelector(s);
  const storage = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k,v) { try { localStorage.setItem(k,v); } catch {} } };
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let theme = storage.get('cat-theme') || (prefersDark ? 'dark' : 'light');
  function applyTheme() { document.documentElement.dataset.theme = theme; $('#theme').setAttribute('aria-label', `Cambiar a tema ${theme === 'dark' ? 'claro' : 'oscuro'}`); }
  applyTheme();
  $('#theme').addEventListener('click', () => { theme = theme === 'dark' ? 'light' : 'dark'; storage.set('cat-theme', theme); applyTheme(); });
  function menu(open) { document.body.classList.toggle('menu-open', open); $('#menu').setAttribute('aria-expanded', String(open)); $('#menu').setAttribute('aria-label', open ? 'Cerrar índice' : 'Abrir índice'); }
  $('#menu').addEventListener('click', () => menu(!document.body.classList.contains('menu-open')));
  $('#sidebar').addEventListener('click', event => { if (event.target.closest('a')) menu(false); });
  $('#menu-backdrop').addEventListener('click', () => menu(false));
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && document.body.classList.contains('menu-open')) { menu(false); $('#menu').focus(); } });
  const articles = [...document.querySelectorAll('article')];
  let ticking = false, current = '';
  function update() {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    $('#progress').value = max > 0 ? Math.min(100, scrollY / max * 100) : 0;
    const active = [...articles].reverse().find(a => a.getBoundingClientRect().top < 160);
    if ((active?.id || '') !== current) {
      current = active?.id || '';
      $('#current-chapter').textContent = active?.dataset.chapter || 'Comunismo a la tica';
      document.querySelectorAll('#sidebar a[aria-current]').forEach(a => a.removeAttribute('aria-current'));
      if (current) document.querySelector(`#sidebar a[href="#${current}"]`)?.setAttribute('aria-current', 'location');
    }
  }
  addEventListener('scroll', () => { if(!ticking) { requestAnimationFrame(update); ticking = true; } }, {passive:true});
  addEventListener('resize', update); update();
  const dialog = $('#search-dialog'), query = $('#query'), results = $('#results'), status = $('#search-status');
  let index = null, failed = false;
  const fold = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es');
  async function openSearch() {
    menu(false); if(!dialog.open) dialog.showModal(); query.focus();
    if (!index) {
      status.textContent = 'Cargando el índice…';
      try {
        const response = await fetch('assets/search.json');
        if(!response.ok) throw new Error('index');
        index = (await response.json()).map(s => ({...s, folded:fold(s.title+' '+s.text)})); failed = false;
      } catch { failed = true; }
    }
    search();
  }
  $('#search-open').addEventListener('click', openSearch);
  document.addEventListener('keydown', e => {
    const shortcut = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
    const slash = e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable;
    if(shortcut || slash) { e.preventDefault(); if(!dialog.open) openSearch(); }
  });
  dialog.addEventListener('click', e => { if(e.target === dialog && (e.clientX < dialog.getBoundingClientRect().left || e.clientX > dialog.getBoundingClientRect().right || e.clientY < dialog.getBoundingClientRect().top || e.clientY > dialog.getBoundingClientRect().bottom)) dialog.close(); });
  function search() {
    results.replaceChildren();
    if (failed) { status.textContent = 'No se pudo cargar el índice. Recargue la página o use la búsqueda de su navegador.'; return; }
    const q = fold(query.value.trim());
    if(q.length<2) { status.textContent = 'Escriba al menos dos caracteres.'; return; }
    if(!index) return;
    const matches = index.filter(s => s.folded.includes(q));
    status.textContent = `${matches.length} secciones encontradas${matches.length>60 ? ' · Se muestran las primeras 60' : ''}.`;
    matches.slice(0,60).forEach(s => {
      const link=document.createElement('a'); link.href='#'+s.id;
      const chapter=document.createElement('small'); chapter.textContent=s.chapter;
      const title=document.createElement('strong'); title.textContent=s.title;
      const snippet=document.createElement('p'); const pos=fold(s.text).indexOf(q), start=Math.max(0,pos-80);
      snippet.textContent=(start?'…':'')+s.text.slice(start,start+250)+(s.text.length>start+250?'…':'');
      link.append(chapter,title,snippet); link.addEventListener('click',()=>dialog.close()); results.append(link);
    });
  }
  query.addEventListener('input', search);
})();
