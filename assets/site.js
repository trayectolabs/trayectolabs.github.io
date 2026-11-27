{
  const root = document.documentElement;
  const buttons = [...document.querySelectorAll('[data-set-lang]')];

  const setLang = (lang) => {
    root.lang = lang;
    for (const el of document.querySelectorAll('[data-lang]')) el.hidden = el.dataset.lang !== lang;
    for (const b of buttons) b.setAttribute('aria-pressed', String(b.dataset.setLang === lang));
    const title = root.dataset[lang === 'es' ? 'titleEs' : 'titleEn'];
    if (title) document.title = title;
  };

  const fromHash = () => ({ '#es': 'es', '#en': 'en' })[location.hash] || null;

  let lang = fromHash();
  if (!lang) { try { lang = localStorage.getItem('adelante-lang'); } catch (e) {} }
  if (lang !== 'es' && lang !== 'en') lang = /^es\b/i.test(navigator.language || '') ? 'es' : 'en';
  setLang(lang);

  for (const b of buttons) {
    b.addEventListener('click', () => {
      setLang(b.dataset.setLang);
      try { localStorage.setItem('adelante-lang', b.dataset.setLang); } catch (e) {}
    });
  }
  addEventListener('hashchange', () => { const l = fromHash(); if (l) setLang(l); });

  for (const b of document.querySelectorAll('[data-copy]')) {
    b.addEventListener('click', async () => {
      const status = document.querySelector(b.dataset.status);
      const es = root.lang === 'es';
      try {
        await navigator.clipboard.writeText(b.dataset.copy);
        if (status) status.textContent = es ? 'Correo copiado' : 'Address copied';
      } catch (e) {
        if (status) status.textContent = es ? 'Selecciona el correo para copiarlo' : 'Select the address to copy it';
      }
    });
  }
}
