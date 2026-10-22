/* =========================================================================
   PyCon Colombia 2028 — Landing: idioma, cabecera, tarjetas y modal
   Expone window.PYAPP para que views.js (páginas internas) comparta estado.
   ========================================================================= */
(() => {
    const D = window.PYCON;
    const $ = (s, el = document) => el.querySelector(s);
    const $$ = (s, el = document) => [...el.querySelectorAll(s)];
    const store = {
        get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
        set(k, v) { try { localStorage.setItem(k, v); } catch (_) { /* almacenamiento no disponible */ } }
    };
    const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

    /* =====================================================================
       Traducciones de la landing (el español vive en el HTML)
       ===================================================================== */
    const EN = {
        'skip': 'Skip to content', 'menu': 'Menu', 'toTop': 'Back to top',
        'nav.home': 'Home', 'nav.scheduleGo': 'Schedule', 'nav.speakers': 'Speakers', 'nav.schedule': 'Schedule', 'nav.sponsors': 'Sponsors', 'nav.venue': 'Venue', 'nav.coc': 'Code of conduct',
        'cta.buy': 'Buy ticket', 'cta.tickets': 'Get your ticket', 'cta.speakers': 'Meet the speakers',
        'hero.city': 'City', 'hero.dateLabel': 'Date', 'hero.date': 'July 14 – 16, 2028', 'scroll': 'Explore the jungle',
        'about.kicker': 'About the conference', 'about.title': 'A community that grows like the rainforest',
        'about.p1': 'PyCon Colombia is a non-profit conference organized by volunteers from the Python community. Every year we bring together developers, data scientists, students and teachers to learn, share and connect.',
        'about.p2': 'In 2028 we celebrate our eleventh edition inspired by the Amazon: a diverse, interconnected ecosystem full of life, just like our community.',
        'cd.title': 'Starts in', 'cd.days': 'days', 'cd.hours': 'hours', 'cd.mins': 'min', 'cd.secs': 'sec',
        'stats.people': '+ attendees', 'stats.talks': 'talks', 'stats.workshops': 'workshops', 'stats.keynotes': 'keynotes',
        'kn.title': 'Keynotes, <span>the voices that open and close each day</span>',
        'sp.kicker': 'Speakers', 'sp.title': 'Introducing our speakers, <span>the voices behind the talks</span>',
        'sch.kicker': 'Program', 'sch.mine': 'My schedule',
        'teaser.title': 'Build your 3-day schedule', 'teaser.btn': 'See the schedule',
        'teaser.p': 'Browse talks, workshops and keynotes, filter by track, level or language, save your favorites and find your way to every room on campus.',
        'tk.kicker': 'Join the pack', 'tk.title': 'Tickets', 'tk.lead': 'A single ticket for the whole conference. Price in US dollars.',
        // Única boleta: 200 USD (en español se muestra su equivalente en pesos)
        'tk.general': 'General ticket', 'tk.price': '$200 <small>USD</small>', 'tk.note': 'Single price per person · Includes all 3 days',
        'tk.all': 'Access to all 3 days: talks, workshops and keynotes', 'tk.food': 'Meals included',
        'tk.kit': 'Welcome kit & official t-shirt', 'tk.party': 'Saturday community party', 'tk.buy': 'Buy ticket',
        'tk.grantKicker': 'Financial aid', 'tk.grantTitle': 'Can\'t afford the ticket?', 'tk.apply': 'Apply',
        'tk.grantP': 'Apply for a grant: it covers the ticket and may include travel and lodging support.',
        'spo.title': 'Trusted by industry leaders',
        'spo.lead': 'PyCon Colombia is made possible through the generous support of organizations dedicated to advancing the Python ecosystem and fostering technological innovation in Latin America.',
        'spo.btn': 'Become a sponsor',
        'vn.kicker': 'The venue', 'vn.p': 'Carrera 49 #7 Sur-50, Medellín. A green campus with more than 500 plant species: the perfect home for our Amazon edition.',
        'vn.metro': 'Metro: Aguacatala station (line A), 10 min walk', 'vn.air': 'José María Córdova airport (MDE) 50 min away',
        'vn.hotel': 'Special rates at partner hotels', 'vn.map': 'Get directions',
        'cfp.kicker': 'Call for proposals open', 'cfp.title': 'Share what you know',
        'cfp.p': 'We are looking for talks, workshops and lightning talks about web, data, AI, education, science and community. If it is your first talk, our mentors will help you.',
        'cfp.btn': 'Submit proposal', 'cfp.mentor': 'I want a mentor',
        'vol.kicker': 'Volunteering', 'vol.title': 'Live PyCon from the inside', 'vol.btn': 'Sign up as a volunteer',
        'vol.p': 'PyCon Colombia exists thanks to dozens of volunteers. Help us with logistics, registration, social media, design or supporting speakers. You get the official t-shirt, meals and the best community experience.',
        'faq.kicker': 'Questions?', 'faq.title': 'Frequently asked questions',
        'faq.q1': 'Do I need to know Python to attend?', 'faq.a1': 'Not at all! There are beginner workshops and talks for every level. All you need is curiosity.',
        'faq.q2': 'What language are the talks in?', 'faq.a2': 'Mostly Spanish. Some keynotes and talks will be in English, and the schedule says so.',
        'faq.q3': 'Can I transfer or refund my ticket?', 'faq.a3': 'You can transfer it up to 7 days before the event. Refunds apply up to 30 days before.',
        'faq.q4': 'Are the talks recorded?', 'faq.a4': 'Yes. Main room talks are published on our YouTube channel a few weeks later.',
        'faq.q5': 'Is the venue accessible?', 'faq.a5': 'Yes, the campus has ramps and elevators. If you need any support, write to us and we will arrange it.',
        'nl.title': 'Don\'t miss a thing', 'nl.p': 'Get news about speakers, schedule and tickets.', 'nl.btn': 'Subscribe',
        'ft.about': 'Non-profit conference organized by the Python community of Colombia.', 'ft.past': 'Past editions',
        'ft.links': 'Links', 'ft.follow': 'Follow us', 'ft.made': 'Made with 🐍 and 🌿 by volunteers',
        'sm.about': 'About', 'sm.session': 'Session', 'sm.viewTalk': 'View the talk'
    };
    const UI = {
        es: { nlOk: '¡Listo! Pronto te escribiremos 🌿', nlErr: 'Escribe un email válido.', close: 'Cerrar', view: 'Ver perfil de', sponsorOf: 'Ver patrocinador', talk: 'Charla', viewTalk: 'Ver charla' },
        en: { nlOk: 'Done! We will write to you soon 🌿', nlErr: 'Please enter a valid email.', close: 'Close', view: 'View profile of', sponsorOf: 'View sponsor', talk: 'Talk', viewTalk: 'View talk' }
    };

    let lang = 'es';
    const pick = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v[lang] ?? v.es : v);
    const i18nEls = $$('[data-i18n]');
    i18nEls.forEach((el) => { el.dataset.es = el.innerHTML; });
    const labelEls = $$('[data-i18n-label]');
    labelEls.forEach((el) => { el.dataset.esLabel = el.getAttribute('aria-label'); });

    const langHandlers = [];
    function setLang(next) {
        lang = next;
        document.documentElement.lang = next;
        i18nEls.forEach((el) => { const k = el.dataset.i18n; el.innerHTML = next === 'en' && EN[k] ? EN[k] : el.dataset.es; });
        labelEls.forEach((el) => { const k = el.dataset.i18nLabel; el.setAttribute('aria-label', next === 'en' && EN[k] ? EN[k] : el.dataset.esLabel); });
        $$('.lang-toggle [data-lang]').forEach((s) => s.classList.toggle('is-active', s.dataset.lang === next));
        langHandlers.forEach((fn) => fn());
        store.set('pycon-lang', next);
    }
    $('.lang-toggle').addEventListener('click', () => setLang(lang === 'es' ? 'en' : 'es'));

    /* =====================================================================
       Cabecera: aparece al hacer scroll (o siempre en páginas internas)
       ===================================================================== */
    const header = $('.site-header');
    const toggle = $('.nav-toggle');
    const nav = $('#main-nav');
    const toTop = $('.to-top');
    const menuReveal = $('.menu-reveal');
    const closeNav = () => {
        header.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false');
        if (header.classList.contains('is-pinned')) { header.classList.remove('is-pinned'); menuReveal.setAttribute('aria-expanded', 'false'); onScroll(); }
    };

    toggle.addEventListener('click', () => toggle.setAttribute('aria-expanded', String(header.classList.toggle('is-open'))));

    // Botón "Menú" del inicio: muestra la barra superior sin tener que hacer scroll
    // (en móvil además abre la lista de enlaces) y lleva el foco al primer enlace
    menuReveal.addEventListener('click', () => {
        header.classList.add('is-pinned');
        menuReveal.setAttribute('aria-expanded', 'true');
        onScroll();
        if (getComputedStyle(toggle).display !== 'none') { header.classList.add('is-open'); toggle.setAttribute('aria-expanded', 'true'); }
        setTimeout(() => $('a', nav)?.focus({ preventScroll: true }), 120);
    });
    // Desplegable "Agenda": el botón solo abre/cierra Keynotes · Ponentes · Ver la agenda
    const group = $('.nav-group', nav), groupBtn = $('.nav-group__toggle', group);
    const setGroup = (open) => { group.classList.toggle('is-open', open); groupBtn.setAttribute('aria-expanded', String(open)); };
    groupBtn.addEventListener('click', () => setGroup(!group.classList.contains('is-open')));

    nav.addEventListener('click', (e) => { if (e.target.closest('a')) { setGroup(false); closeNav(); } });
    addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (group.classList.contains('is-open')) { setGroup(false); groupBtn.focus(); } else closeNav();
    });
    document.addEventListener('click', (e) => {
        if (!group.contains(e.target)) setGroup(false);
        if (!header.contains(e.target)) closeNav();
    });

    const onScroll = () => {
        const inView = document.body.classList.contains('in-view');
        const scrolled = inView || scrollY > 60 || header.classList.contains('is-pinned');
        header.classList.toggle('is-scrolled', scrolled);
        if (!scrolled) closeNav();
        toTop.classList.toggle('is-visible', scrollY > innerHeight * 1.2);
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // "Inicio" queda marcado mientras se esté en la landing (sin importar la sección);
    // al pasar a otra pantalla (agenda, keynotes…) views.js marca el enlace de esa pantalla
    const homeLink = $('[data-home]', nav);
    const clearActive = () => {
        $$('a', nav).forEach((a) => { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
        $('.nav-group__toggle', nav).classList.remove('is-active');
        if (!document.body.classList.contains('in-view')) { homeLink.classList.add('is-active'); homeLink.setAttribute('aria-current', 'page'); }
    };
    clearActive();

    /* Liquid glass: el reflejo especular sigue al puntero */
    $$('.glass').forEach((el) => {
        el.addEventListener('pointermove', (e) => {
            const r = el.getBoundingClientRect();
            el.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`);
            el.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`);
        });
        el.addEventListener('pointerleave', () => { el.style.removeProperty('--gx'); el.style.removeProperty('--gy'); });
    });
    if (navigator.userAgentData?.brands?.some((b) => /Chromium/.test(b.brand))) document.documentElement.classList.add('has-refraction');

    /* =====================================================================
       Keynotes y ponentes (misma tarjeta del Figma) + modal de perfil
       ===================================================================== */
    const PEOPLE = Object.fromEntries([...D.KEYNOTES, ...D.SPEAKERS].map((p) => [p.id, p]));
    const initials = (p) => (p.tba ? '?' : pick(p.name).split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join(''));
    const SOCIAL = [['gh', 'GitHub'], ['in', 'LinkedIn'], ['x', 'X'], ['ig', 'Instagram'], ['web', 'Web']];
    // Cada botón lleva a la red de la persona (p.social[red]); si aún no hay enlace,
    // a la página "cuenta no habilitada" (#/cuenta/<persona>/<red>)
    const socialHTML = (p) => SOCIAL.map(([k, label]) => {
        const url = p?.social?.[k];
        const href = url ? esc(url) : `#/cuenta/${p?.id || 'pycon'}/${k}`;
        return `<li><a href="${href}"${url ? ' target="_blank" rel="noopener"' : ''} aria-label="${label}${p ? ` · ${esc(pick(p.name))}` : ''}"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#ico-${k}"/></svg></a></li>`;
    }).join('');
    const SOCIAL_NAMES = Object.fromEntries(SOCIAL);
    const avatarInner = (p) => (p.photo ? `<img src="${p.photo}" alt="" loading="lazy" decoding="async">` : `<span>${initials(p)}</span>`);
    const avatarHTML = (p, cls = '') => `<div class="avatar ${p.photo ? 'avatar--photo ' : ''}${cls}" style="--hue:${p.hue}" aria-hidden="true">${avatarInner(p)}</div>`;

    // Tarjeta de persona: foto, nombre, cargo, bio, su charla (título, día, hora y sala),
    // redes y "Ver charla". Tocar la tarjeta abre el perfil completo.
    function cardHTML(p) {
        const name = pick(p.name), ev = D.EVENTS[p.talk], day = D.DAYS[ev.day], room = D.ROOMS[ev.room];
        return `<li class="card speaker${p.tba ? ' speaker--tba' : ''}">
            <div class="inset speaker__panel">
                <div class="speaker__photo">${avatarHTML(p)}</div>
                <h3>${esc(name)}</h3>
                <p class="speaker__role">${esc(pick(p.role))}</p>
            </div>
            <p class="speaker__bio">${esc(pick(p.bio))}</p>
            <div class="speaker__talk">
                <p class="speaker__talk-label">${UI[lang].talk}</p>
                <p class="speaker__talk-title">${esc(pick(ev.title))}</p>
                <p class="speaker__talk-meta">${esc(pick(day.label))} ${day.num} · ${ev.t} · ${esc(pick(room.name))}</p>
            </div>
            <ul class="social">${socialHTML(p)}</ul>
            <a class="btn btn--primary btn--sm speaker__cta" href="#/charla/${p.id}">${UI[lang].viewTalk}</a>
            <button class="speaker__open" type="button" data-open-speaker="${p.id}"><span class="sr-only">${UI[lang].view} ${esc(name)}</span></button>
        </li>`;
    }
    // Keynotes en el orden en que suceden; ponentes en una fila deslizable
    const byTime = (a, b) => { const ea = D.EVENTS[a.talk], eb = D.EVENTS[b.talk]; return ea.day - eb.day || ea.t.localeCompare(eb.t); };
    function renderPeople() {
        $('#keynotes-list').innerHTML = [...D.KEYNOTES].sort(byTime).map(cardHTML).join('');
        $('#speakers-list').innerHTML = D.SPEAKERS.map(cardHTML).join('');
        updateCarousel();
    }

    /* Carrusel de ponentes: flechas que se ocultan en los extremos */
    const row = $('#speakers-list');
    const carouselBtns = $$('[data-carousel]');
    function updateCarousel() {
        const max = row.scrollWidth - row.clientWidth - 2;
        const atStart = row.scrollLeft <= 2, atEnd = row.scrollLeft >= max;
        carouselBtns.forEach((b) => { b.disabled = +b.dataset.carousel < 0 ? atStart : atEnd; });
    }
    // cada flecha avanza una página completa (las tarjetas que caben a la vez)
    carouselBtns.forEach((b) => b.addEventListener('click', () => {
        const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
        const card = row.querySelector('.speaker');
        const step = card ? card.getBoundingClientRect().width + gap : row.clientWidth;
        const perPage = Math.max(1, Math.round((row.clientWidth + gap) / step));
        row.scrollBy({ left: +b.dataset.carousel * step * perPage, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }));
    row.addEventListener('scroll', updateCarousel, { passive: true });
    addEventListener('resize', updateCarousel);

    const modal = $('#speaker-modal');
    let openId = null, lastFocus = null;
    const tagLabel = (map, k) => pick(map[k]);
    function fillModal(id) {
        const p = PEOPLE[id], ev = D.EVENTS[p.talk];
        const av = $('#sm-avatar');
        av.style.setProperty('--hue', p.hue);
        av.classList.toggle('avatar--photo', !!p.photo);
        av.innerHTML = avatarInner(p);
        $('#sm-name').textContent = pick(p.name);
        $('#sm-role').textContent = pick(p.role);
        $('#sm-bio').textContent = pick(p.bio);
        $('#sm-talk').textContent = pick(ev.title);
        $('#sm-tags').innerHTML = [tagLabel(D.TRACKS, ev.track), tagLabel(D.FORMATS, ev.format), tagLabel(D.LEVELS, ev.level), tagLabel(D.LANGS, ev.lang)]
            .map((t) => `<li class="tag tag--fill">${esc(t)}</li>`).join('');
        $('#sm-social').innerHTML = socialHTML(p);
        $('#sm-talk-link').href = `#/charla/${p.id}`;
        $('[data-close]', modal).setAttribute('aria-label', UI[lang].close);
    }
    function openSpeaker(id) {
        if (!PEOPLE[id]) return;
        openId = id; lastFocus = document.activeElement;
        fillModal(id);
        if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open', '');
    }
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-open-speaker]');
        if (btn) openSpeaker(btn.dataset.openSpeaker);
    });
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('[data-close]')) modal.close();
        // cualquier enlace a otra página (la charla, una red social) cierra el perfil
        if (e.target.closest('a[href^="#/"]')) { lastFocus = null; modal.close(); }
    });
    modal.addEventListener('close', () => { openId = null; lastFocus?.focus?.(); });

    /* =====================================================================
       Patrocinadores: la página está en views.js (#/patrocinadores)
       ===================================================================== */
    const logoHTML = (s, big = false) => `<span class="sponsor-logo${big ? ' sponsor-logo--big' : ''}" style="--brand:${s.color}" aria-hidden="true"><b>${esc(s.mono)}</b></span>`;

    /* Cifras de "Acerca": charlas, talleres y keynotes se cuentan en la agenda */
    $$('[data-stat]').forEach((el) => { el.dataset.count = D.COUNTS.total[el.dataset.stat] || 0; });

    /* =====================================================================
       Aparición al hacer scroll + contadores
       ===================================================================== */
    const countUp = (el) => {
        const end = +el.dataset.count, start = performance.now(), dur = 1400;
        const step = (now) => {
            const k = Math.min(1, (now - start) / dur);
            el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
            if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };
    const reveal = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            entry.target.querySelectorAll('[data-count]').forEach(countUp);
            reveal.unobserve(entry.target);
        });
    }, { threshold: 0.1 });
    const observeReveals = (root = document) => $$('.reveal:not(.is-visible)', root).forEach((el) => reveal.observe(el));
    observeReveals();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) $$('[data-count]').forEach((c) => { c.textContent = c.dataset.count; });

    /* =====================================================================
       Cuenta regresiva
       ===================================================================== */
    const EVENT = new Date('2028-07-14T07:30:00-05:00').getTime();
    const pad = (n, l = 2) => String(n).padStart(l, '0');
    const cd = ['days', 'hours', 'mins', 'secs'].map((k) => $('#cd-' + k));
    const tick = () => {
        const s = Math.floor(Math.max(0, EVENT - Date.now()) / 1000);
        const vals = [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
        cd.forEach((el, i) => { el.textContent = i === 0 ? pad(vals[0], 3) : pad(vals[i]); });
    };
    tick();
    setInterval(tick, 1000);

    /* =====================================================================
       FAQ (una abierta a la vez) + newsletter
       ===================================================================== */
    const faqs = $$('.faq details');
    faqs.forEach((d) => d.addEventListener('toggle', () => { if (d.open) faqs.forEach((o) => { if (o !== d) o.open = false; }); }));

    const form = $('.newsletter');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = $('input', form), msg = $('.newsletter__msg', form);
        const ok = input.checkValidity() && input.value.trim() !== '';
        msg.textContent = ok ? UI[lang].nlOk : UI[lang].nlErr;
        msg.classList.toggle('is-error', !ok);
        input.setAttribute('aria-invalid', String(!ok));
        if (ok) form.reset();
    });

    /* =====================================================================
       "Mi agenda": eventos guardados (compartido con views.js)
       ===================================================================== */
    const mine = new Set((() => { try { return JSON.parse(store.get('pycon-mine') || '[]'); } catch (_) { return []; } })());
    const saveMine = () => store.set('pycon-mine', JSON.stringify([...mine]));

    renderPeople();
    langHandlers.push(renderPeople, () => { if (openId) fillModal(openId); });

    window.PYAPP = {
        $, $$, esc, pick, store, mine, saveMine, PEOPLE, initials, avatarHTML, socialHTML, SOCIAL_NAMES, logoHTML, openSpeaker, observeReveals, onScroll, clearActive, UI,
        get lang() { return lang; },
        onLang: (fn) => langHandlers.push(fn),
        setLang
    };

    if (store.get('pycon-lang') === 'en') setLang('en');
})();

/*Boton deshabilitado*/

const boton = document.getElementById('mentoria');

boton.addEventListener('click', function(evento) {
  // Verificamos si el botón tiene la clase de deshabilitado
  if (boton.classList.contains('btn-deshabilitado')) {
    // Evitamos cualquier acción por defecto
    evento.preventDefault(); 
    
    // Mostramos el aviso de advertencia
    alert('Convocatoria cerrada.');
    
    return; // Detiene la función aquí
  }

  // Código que se ejecuta si el botón SÍ está habilitado de verdad
  console.log('¡Formulario enviado con éxito!');
});

