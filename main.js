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
        'nav.speakers': 'Speakers', 'nav.schedule': 'Schedule', 'nav.sponsors': 'Sponsors', 'nav.venue': 'Venue', 'nav.coc': 'Code of conduct',
        'cta.buy': 'Buy ticket', 'cta.tickets': 'Get your ticket', 'cta.speakers': 'Meet the speakers',
        'hero.city': 'City', 'hero.dateLabel': 'Date', 'hero.date': 'July 14 – 16, 2028', 'scroll': 'Explore the jungle',
        'about.kicker': 'About the conference', 'about.title': 'A community that grows like the rainforest',
        'about.p1': 'PyCon Colombia is a non-profit conference organized by volunteers from the Python community. Every year we bring together developers, data scientists, students and teachers to learn, share and connect.',
        'about.p2': 'In 2028 we celebrate our eleventh edition inspired by the Amazon: a diverse, interconnected ecosystem full of life, just like our community.',
        'cd.title': 'Starts in', 'cd.days': 'days', 'cd.hours': 'hours', 'cd.mins': 'min', 'cd.secs': 'sec',
        'stats.people': '+ attendees', 'stats.talks': 'talks', 'stats.workshops': '+ workshops', 'stats.keynotes': 'keynotes',
        'kn.title': 'Keynotes, <span>the voices that open and close each day</span>',
        'sp.kicker': 'Speakers', 'sp.title': 'Introducing our speakers, <span>the voices behind the talks</span>',
        'sch.kicker': 'Program', 'sch.mine': 'My schedule',
        'teaser.title': 'Build your 3-day schedule', 'teaser.btn': 'See the schedule',
        'teaser.p': 'Browse talks, workshops and keynotes, filter by track, level or language, save your favorites and find your way to every room on campus.',
        'tk.kicker': 'Join the pack', 'tk.title': 'Tickets', 'tk.lead': 'Prices in Colombian pesos. All tickets include the 3 days, meals and welcome kit.',
        'tk.student': 'Student', 'tk.general': 'General', 'tk.corp': 'Corporate', 'tk.grant': 'Financial aid',
        'tk.all': 'Access to all 3 days', 'tk.food': 'Meals included', 'tk.studentReq': 'Valid student ID required',
        'tk.kit': 'Kit & official t-shirt', 'tk.invoice': 'Electronic invoice', 'tk.support': 'You support the community',
        'tk.popular': 'Most popular', 'tk.buy': 'Buy', 'tk.free': 'Free', 'tk.apply': 'Apply',
        'tk.grant1': 'For those who cannot afford it', 'tk.grant2': 'Travel & lodging support', 'tk.grant3': 'Priority for underrepresented groups',
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
        es: { nlOk: '¡Listo! Pronto te escribiremos 🌿', nlErr: 'Escribe un email válido.', close: 'Cerrar', view: 'Ver perfil de', sponsorOf: 'Ver patrocinador' },
        en: { nlOk: 'Done! We will write to you soon 🌿', nlErr: 'Please enter a valid email.', close: 'Close', view: 'View profile of', sponsorOf: 'View sponsor' }
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
    const closeNav = () => { header.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); };

    toggle.addEventListener('click', () => toggle.setAttribute('aria-expanded', String(header.classList.toggle('is-open'))));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) closeNav(); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });
    document.addEventListener('click', (e) => { if (!header.contains(e.target)) closeNav(); });

    const onScroll = () => {
        const inView = document.body.classList.contains('in-view');
        const scrolled = inView || scrollY > 60;
        header.classList.toggle('is-scrolled', scrolled);
        if (!scrolled) closeNav();
        toTop.classList.toggle('is-visible', scrollY > innerHeight * 1.2);
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const links = new Map($$('a[href^="#"]:not(.btn):not([data-route])', nav).map((a) => [a.getAttribute('href').slice(1), a]));
    const clearActive = () => $$('a', nav).forEach((a) => { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
    const spy = new IntersectionObserver((entries) => {
        if (document.body.classList.contains('in-view')) return;
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            clearActive();
            const a = links.get(entry.target.id);
            if (a) { a.classList.add('is-active'); a.setAttribute('aria-current', 'true'); }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('#landing section[id]').forEach((s) => spy.observe(s));

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
    const socialHTML = () => SOCIAL.map(([k, label]) =>
        `<li><a href="#" aria-label="${label}"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#ico-${k}"/></svg></a></li>`).join('');
    const avatarHTML = (p, cls = '') => `<div class="avatar ${cls}" style="--hue:${p.hue}" aria-hidden="true"><span>${initials(p)}</span></div>`;

    function cardHTML(p) {
        const name = pick(p.name);
        return `<li class="card speaker${p.tba ? ' speaker--tba' : ''}">
            <div class="inset speaker__panel">
                <div class="speaker__photo">${avatarHTML(p)}</div>
                <h3>${esc(name)}</h3>
                <p class="speaker__role">${esc(pick(p.role))}</p>
            </div>
            <p class="speaker__bio">${esc(pick(p.bio).split('. ')[0].replace(/\.$/, ''))}.</p>
            <ul class="social">${socialHTML()}</ul>
            <button class="speaker__open" type="button" data-open-speaker="${p.id}"><span class="sr-only">${UI[lang].view} ${esc(name)}</span></button>
        </li>`;
    }
    function renderPeople() {
        $('#keynotes-list').innerHTML = D.KEYNOTES.map(cardHTML).join('');
        $('#speakers-list').innerHTML = D.SPEAKERS.map(cardHTML).join('');
    }

    const modal = $('#speaker-modal');
    let openId = null, lastFocus = null;
    const tagLabel = (map, k) => pick(map[k]);
    function fillModal(id) {
        const p = PEOPLE[id], ev = D.EVENTS[p.talk];
        $('#sm-avatar').style.setProperty('--hue', p.hue);
        $('#sm-avatar span').textContent = initials(p);
        $('#sm-name').textContent = pick(p.name);
        $('#sm-role').textContent = pick(p.role);
        $('#sm-bio').textContent = pick(p.bio);
        $('#sm-talk').textContent = pick(ev.title);
        $('#sm-tags').innerHTML = [tagLabel(D.TRACKS, ev.track), tagLabel(D.FORMATS, ev.format), tagLabel(D.LEVELS, ev.level), tagLabel(D.LANGS, ev.lang)]
            .map((t) => `<li class="tag tag--fill">${esc(t)}</li>`).join('');
        $('#sm-social').innerHTML = socialHTML();
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
        if (e.target.closest('#sm-talk-link')) { lastFocus = null; modal.close(); }
    });
    modal.addEventListener('close', () => { openId = null; lastFocus?.focus?.(); });

    /* =====================================================================
       Patrocinadores: cada tarjeta es un botón a su página
       ===================================================================== */
    const logoHTML = (s, big = false) => `<span class="sponsor-logo${big ? ' sponsor-logo--big' : ''}" style="--brand:${s.color}" aria-hidden="true"><b>${esc(s.mono)}</b></span>`;
    function renderSponsors() {
        $('#sponsor-tiers').innerHTML = D.TIERS.map(([tier, label]) => {
            const list = D.SPONSORS.filter((s) => s.tier === tier);
            return `<h3 class="tier"><span>${esc(pick(label))}</span></h3>
                <ul class="logos logos--${tier}">${list.map((s) => `
                    <li><a class="inset sponsor-card" href="#/patrocinador/${s.id}">
                        ${logoHTML(s)}<span class="sponsor-card__name">${esc(s.name)}</span>
                        <span class="sponsor-card__more">${UI[lang].sponsorOf} <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#ico-next"/></svg></span>
                    </a></li>`).join('')}</ul>`;
        }).join('');
    }

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
    renderSponsors();
    langHandlers.push(renderPeople, renderSponsors, () => { if (openId) fillModal(openId); });

    window.PYAPP = {
        $, $$, esc, pick, store, mine, saveMine, PEOPLE, initials, avatarHTML, socialHTML, logoHTML, openSpeaker, observeReveals, onScroll, clearActive,
        get lang() { return lang; },
        onLang: (fn) => langHandlers.push(fn),
        setLang
    };

    if (store.get('pycon-lang') === 'en') setLang('en');
})();
