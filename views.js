/* =========================================================================
   PyCon Colombia 2028 — Páginas internas (fuera de la landing)
   Enrutador por hash: las direcciones "#/…" muestran una página interna y
   ocultan la landing; los anclajes normales ("#boletas") vuelven a ella.

   #/agenda?d=0&p=1           Agenda general (día y página)
   #/agenda/mi?p=1            Mi agenda (eventos guardados)
   #/agenda/evento/d1-2       Evento + mapa del campus con la ruta a la sala
   #/charla/s0                Charla de un ponente (vista "talk" del Figma)
   #/patrocinador/ceiba       Patrocinador (vista "sponsor" del Figma)
   #/codigo-de-conducta       Código de conducta
   #/codigo-de-conducta/reporte   Formulario de reporte
   #/voluntariado             Registro de voluntarios
   ========================================================================= */
(() => {
    const D = window.PYCON, A = window.PYAPP;
    const { $, $$, esc, pick } = A;
    const landing = $('#landing'), view = $('#view');

    /* ---------------------------------------------------------------- */
    /*  Textos de las páginas internas                                   */
    /* ---------------------------------------------------------------- */
    const T = {
        es: {
            home: 'Inicio', program: 'Programa', schedule: 'Agenda PyCon Colombia 2028', mine: 'Mi agenda', dates: '14, 15 y 16 de julio 2028',
            backGeneral: 'Volver a la agenda general', backMine: 'Ir a mi agenda', recommended: 'Charla recomendada para ti',
            details: 'Ver detalles', search: 'Busca charlas, ponentes, tracks…', searchLabel: 'Buscar en la agenda',
            filters: 'Filtros', filtersTitle: 'Filtrar la agenda', clear: 'Limpiar filtros', apply: 'Ver resultados', all: 'Todas',
            track: 'Track', format: 'Formato', level: 'Nivel', language: 'Idioma', room: 'Sala',
            blocks: (n) => `${n} bloques en la agenda`, results: (n, t) => `${n} de ${t} bloques`,
            empty: 'No hay resultados. Prueba con otra búsqueda o quita algún filtro.',
            prev: 'Anterior', next: 'Siguiente', page: (p, n) => `Página ${p} de ${n}`, pagesNav: 'Páginas de la agenda',
            save: 'Guardar en mi agenda', saved: 'Guardada en mi agenda', unsave: 'Quitar de mi agenda',
            mineTitle: 'Mi agenda personal', mineLead: (n) => (n ? `Tienes ${n} ${n === 1 ? 'evento guardado' : 'eventos guardados'}. Toca la sala para ver cómo llegar.` : 'Aún no has guardado eventos.'),
            mineEmpty: 'Marca con la estrella ★ las charlas que no te quieres perder y aparecerán aquí.',
            goSchedule: 'Explorar la agenda', removeFrom: 'Quitar',
            howTo: 'Cómo llegar a', whereAreYou: '¿Dónde estás?', walk: (m, min) => `${m} m · ${min} min caminando`, replay: 'Repetir recorrido',
            steps: 'Indicaciones', start: 'Sal desde', cont: 'Continúa por', arrive: 'Llegas a', you: 'Tú', osm: 'Abrir en OpenStreetMap',
            speaker: 'Ponente', viewSpeaker: 'Ver ponente', viewTalk: 'Ver la charla', agenda: 'Agenda de la charla', about: 'Descripción',
            session: 'Sesión', backSpeakers: 'Volver a los ponentes', backKeynotes: 'Volver a los keynotes', when: 'Cuándo y dónde',
            backSponsors: 'Volver a patrocinadores', visit: 'Visitar sitio web', aboutUs: 'Sobre nosotros', aboutSponsor: 'Sobre este patrocinador',
            videos: 'Videos', becomeSponsor: 'Sé patrocinador', tierOf: 'Patrocinador',
            cocTitle: 'Código de conducta', cocIntro: 'Todas las personas que participan en PyCon Colombia —asistentes, ponentes, patrocinadores, voluntarios y organizadores— deben cumplir este código de conducta. Gracias por ayudarnos a que este sea un espacio seguro y acogedor para todas las personas.',
            reportQ: '¿Viviste o presenciaste algo que va en contra de este código?', reportP: 'Cuéntanos. Puedes hacerlo de forma anónima y lo trataremos con total confidencialidad.',
            openReport: 'Abrir formulario de reporte', backCoc: 'Volver al código de conducta',
            reportTitle: 'Formulario de reporte', reportLead: 'Los campos con * son obligatorios. Si prefieres, deja tus datos en blanco y marca el reporte como anónimo.',
            name: 'Nombre', email: 'Correo electrónico', anon: 'Quiero que el reporte sea anónimo', when2: 'Fecha y hora aproximada', where: 'Lugar',
            whatHappened: '¿Qué pasó? *', who: 'Personas involucradas (si las conoces)', urgent: 'Necesito ayuda inmediata', send: 'Enviar reporte',
            reportOk: (r) => `Recibimos tu reporte (referencia ${r}). El equipo de conducta lo revisará en menos de 24 horas.`, required: 'Este campo es obligatorio.',
            urgentNote: 'Si estás en peligro ahora mismo, busca a alguien del equipo organizador (camisetas naranjas) o llama a la línea de emergencias 123.',
            volTitle: 'Registro de voluntarios', volLead: 'Únete al equipo que hace posible PyCon Colombia 2028. Te contactaremos con los detalles de la inducción.',
            phone: 'Teléfono', city: 'Ciudad', areas: '¿En qué te gustaría ayudar? *', days: '¿Qué días puedes? *', shirt: 'Talla de camiseta', exp: 'Cuéntanos de tu experiencia (opcional)',
            cocAgree: 'Leí y acepto el código de conducta *', register: 'Enviar registro', volOk: (n) => `¡Gracias, ${n}! Recibimos tu registro como voluntario. Pronto te escribiremos 🌿`,
            pickOne: 'Elige al menos una opción.', emailErr: 'Escribe un correo válido.', backHome: 'Volver al inicio', newReport: 'Enviar otro reporte',
            areaOpts: ['Logística', 'Registro', 'Redes sociales', 'Diseño', 'Acompañar ponentes', 'Sprints y talleres'],
            dayOpts: ['Viernes 14', 'Sábado 15', 'Domingo 16']
        },
        en: {
            home: 'Home', program: 'Program', schedule: 'PyCon Colombia 2028 Schedule', mine: 'My schedule', dates: 'July 14, 15 & 16, 2028',
            backGeneral: 'Back to the general schedule', backMine: 'Go to my schedule', recommended: 'Recommended talk for you',
            details: 'View details', search: 'Search talks, speakers, tracks…', searchLabel: 'Search the schedule',
            filters: 'Filters', filtersTitle: 'Filter the schedule', clear: 'Clear filters', apply: 'Show results', all: 'All',
            track: 'Track', format: 'Format', level: 'Level', language: 'Language', room: 'Room',
            blocks: (n) => `${n} scheduled time blocks`, results: (n, t) => `${n} of ${t} blocks`,
            empty: 'No results. Try another search or remove a filter.',
            prev: 'Previous', next: 'Next', page: (p, n) => `Page ${p} of ${n}`, pagesNav: 'Schedule pages',
            save: 'Save to my schedule', saved: 'Saved to my schedule', unsave: 'Remove from my schedule',
            mineTitle: 'My personal schedule', mineLead: (n) => (n ? `You have ${n} saved ${n === 1 ? 'event' : 'events'}. Tap the room to get directions.` : 'You have not saved any events yet.'),
            mineEmpty: 'Star ★ the talks you don\'t want to miss and they will show up here.',
            goSchedule: 'Explore the schedule', removeFrom: 'Remove',
            howTo: 'How to get to', whereAreYou: 'Where are you?', walk: (m, min) => `${m} m · ${min} min walk`, replay: 'Replay route',
            steps: 'Directions', start: 'Start at', cont: 'Continue along', arrive: 'You arrive at', you: 'You', osm: 'Open in OpenStreetMap',
            speaker: 'Speaker', viewSpeaker: 'View speaker', viewTalk: 'View the talk', agenda: 'Talk agenda', about: 'Description',
            session: 'Session', backSpeakers: 'Back to speakers', backKeynotes: 'Back to keynotes', when: 'When & where',
            backSponsors: 'Back to sponsors', visit: 'Visit web site', aboutUs: 'About us', aboutSponsor: 'About this sponsor',
            videos: 'Videos', becomeSponsor: 'Become a sponsor', tierOf: 'Sponsor',
            cocTitle: 'Code of conduct', cocIntro: 'Everyone taking part in PyCon Colombia — attendees, speakers, sponsors, volunteers and organizers — must follow this code of conduct. Thank you for helping us make this a safe and welcoming space for everyone.',
            reportQ: 'Did you experience or witness something against this code?', reportP: 'Tell us. You can do it anonymously and we will handle it with full confidentiality.',
            openReport: 'Open report form', backCoc: 'Back to the code of conduct',
            reportTitle: 'Report form', reportLead: 'Fields marked * are required. If you prefer, leave your details blank and mark the report as anonymous.',
            name: 'Name', email: 'Email', anon: 'I want this report to be anonymous', when2: 'Approximate date and time', where: 'Place',
            whatHappened: 'What happened? *', who: 'People involved (if known)', urgent: 'I need immediate help', send: 'Send report',
            reportOk: (r) => `We received your report (reference ${r}). The conduct team will review it within 24 hours.`, required: 'This field is required.',
            urgentNote: 'If you are in danger right now, find someone from the organizing team (orange t-shirts) or call the emergency line 123.',
            volTitle: 'Volunteer registration', volLead: 'Join the team that makes PyCon Colombia 2028 possible. We will contact you with the onboarding details.',
            phone: 'Phone', city: 'City', areas: 'Where would you like to help? *', days: 'Which days can you join? *', shirt: 'T-shirt size', exp: 'Tell us about your experience (optional)',
            cocAgree: 'I have read and accept the code of conduct *', register: 'Send registration', volOk: (n) => `Thank you, ${n}! We received your volunteer registration. We will write to you soon 🌿`,
            pickOne: 'Choose at least one option.', emailErr: 'Please enter a valid email.', backHome: 'Back to home', newReport: 'Send another report',
            areaOpts: ['Logistics', 'Registration', 'Social media', 'Design', 'Supporting speakers', 'Sprints & workshops'],
            dayOpts: ['Friday 14', 'Saturday 15', 'Sunday 16']
        }
    };
    const t = () => T[A.lang];
    const icon = (id, cls = 'ico') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><use href="#ico-${id}"/></svg>`;
    const roomName = (k) => pick(D.ROOMS[k]?.name || '');
    const label = (map, k) => (k && map[k] ? pick(map[k]) : '');

    /* ---------------------------------------------------------------- */
    /*  Enrutador                                                         */
    /* ---------------------------------------------------------------- */
    let current = null; // { kind, params, query }

    function parse() {
        const h = location.hash;
        if (!h.startsWith('#/')) return null;
        const [path, qs = ''] = h.slice(2).split('?');
        const parts = path.split('/').filter(Boolean).map(decodeURIComponent);
        const query = Object.fromEntries(new URLSearchParams(qs));
        if (parts[0] === 'agenda' && parts[1] === 'mi') return { kind: 'mine', query };
        if (parts[0] === 'agenda' && parts[1] === 'evento' && D.EVENTS[parts[2]]) return { kind: 'event', id: parts[2], query };
        if (parts[0] === 'agenda') return { kind: 'schedule', query };
        if (parts[0] === 'charla' && A.PEOPLE[parts[1]]) return { kind: 'talk', id: parts[1] };
        if (parts[0] === 'patrocinador' && D.SPONSORS.some((s) => s.id === parts[1])) return { kind: 'sponsor', id: parts[1] };
        if (parts[0] === 'codigo-de-conducta' && parts[1] === 'reporte') return { kind: 'report' };
        if (parts[0] === 'codigo-de-conducta') return { kind: 'coc' };
        if (parts[0] === 'voluntariado') return { kind: 'volunteer' };
        return { kind: 'notfound' };
    }

    const RENDER = { schedule: renderSchedule, mine: renderMine, event: renderEvent, talk: renderTalk, sponsor: renderSponsor, coc: renderCoc, report: renderReport, volunteer: renderVolunteer, notfound: renderNotFound };
    const NAV_ROUTE = { schedule: 'agenda', mine: 'agenda', event: 'agenda', coc: 'codigo-de-conducta', report: 'codigo-de-conducta' };

    function route() {
        const r = parse();
        if (!r) return showLanding();
        const sameSchedule = current && current.kind === 'schedule' && r.kind === 'schedule' && view.querySelector('[data-schedule]');
        current = r;
        document.body.classList.add('in-view');
        landing.hidden = true;
        view.hidden = false;
        A.onScroll();
        A.clearActive();
        const navLink = $(`#main-nav [data-route="${NAV_ROUTE[r.kind]}"]`);
        if (navLink) { navLink.classList.add('is-active'); navLink.setAttribute('aria-current', 'page'); }

        if (sameSchedule) { updateSchedule(true); return; }
        RENDER[r.kind](r);
        A.observeReveals(view);
        document.documentElement.style.scrollBehavior = 'auto';
        scrollTo(0, 0);
        document.documentElement.style.scrollBehavior = '';
        const h1 = view.querySelector('h1');
        if (h1) { h1.tabIndex = -1; h1.focus({ preventScroll: true }); }
    }

    function showLanding() {
        const wasView = !view.hidden;
        current = null;
        document.body.classList.remove('in-view');
        view.hidden = true;
        view.innerHTML = '';
        landing.hidden = false;
        A.clearActive();
        A.onScroll();
        const id = location.hash.slice(1);
        const target = id && document.getElementById(id);
        if (wasView) {
            document.documentElement.style.scrollBehavior = 'auto';
            if (target && id !== 'top' && id !== 'inicio') target.scrollIntoView();
            else scrollTo(0, 0);
            document.documentElement.style.scrollBehavior = '';
        }
    }

    addEventListener('hashchange', route);
    A.onLang(() => { if (current) { RENDER[current.kind](current); A.observeReveals(view); } });

    /* Barra de "migas" con botones de regreso */
    const crumbs = (items) => `<nav class="crumbs" aria-label="Navegación">${items.map(([href, text, ic = 'back', primary]) =>
        `<a class="btn btn--sm ${primary ? 'btn--primary' : 'btn--glass glass'}" href="${href}">${icon(ic)}<span>${esc(text)}</span></a>`).join('')}</nav>`;

    /* ---------------------------------------------------------------- */
    /*  Piezas compartidas de la agenda                                   */
    /* ---------------------------------------------------------------- */
    const person = (id) => (id ? A.PEOPLE[id] : null);
    const whoName = (e) => (person(e.who) ? pick(person(e.who).name) : '');
    const evTags = (e) => [label(D.TRACKS, e.track), ...(e.also || []).map((k) => label(D.TRACKS, k)), label(D.FORMATS, e.format), label(D.LEVELS, e.level), label(D.LANGS, e.lang)].filter(Boolean);

    const starBtn = (e, big = false) => {
        const on = A.mine.has(e.id);
        if (big) return `<button type="button" class="btn ${on ? 'btn--outline is-saved' : 'btn--primary'}" data-star="${e.id}" aria-pressed="${on}">${icon('star')}<span>${on ? t().saved : t().save}</span></button>`;
        return `<button type="button" class="star" data-star="${e.id}" aria-pressed="${on}" aria-label="${on ? t().unsave : t().save}: ${esc(pick(e.title))}">${icon('star')}</button>`;
    };
    const roomBtn = (e) => (e.room ? `<a class="room-btn" href="#/agenda/evento/${e.id}">${icon('pin')}<span>${esc(roomName(e.room))}</span></a>` : '');

    function eventRow(e, { showDay = false } = {}) {
        const isBreak = e.format === 'break';
        const who = whoName(e);
        const day = D.DAYS[e.day];
        return `<li class="event${isBreak ? ' event--break' : ''}${e.format === 'keynote' ? ' event--keynote' : ''}">
            <time>${showDay ? `<small>${esc(pick(day.label))} ${day.num}</small>` : ''}${e.t}<small>${e.end}</small></time>
            <div class="event__body">
                <h3><a href="#/agenda/evento/${e.id}">${esc(pick(e.title))}</a></h3>
                ${who ? `<p><button type="button" class="link-btn" data-open-speaker="${e.who}">${esc(who)}</button></p>` : ''}
                ${!isBreak ? `<ul class="tags">${evTags(e).map((x) => `<li class="tag tag--fill">${esc(x)}</li>`).join('')}</ul>` : ''}
                ${roomBtn(e)}
            </div>
            ${isBreak ? '<span></span>' : starBtn(e)}
        </li>`;
    }

    // Guardar / quitar de mi agenda desde cualquier página interna
    view.addEventListener('click', (ev) => {
        const b = ev.target.closest('[data-star]');
        if (!b) return;
        const id = b.dataset.star;
        A.mine.has(id) ? A.mine.delete(id) : A.mine.add(id);
        A.saveMine();
        if (current.kind === 'schedule') updateSchedule(false);
        else RENDER[current.kind](current);
        view.querySelector(`[data-star="${id}"]`)?.focus();
    });

    const paginate = (list, page, size) => {
        const pages = Math.max(1, Math.ceil(list.length / size));
        const p = Math.min(Math.max(1, page || 1), pages);
        return { items: list.slice((p - 1) * size, p * size), page: p, pages };
    };
    const pager = (base, page, pages) => {
        if (pages < 2) return '';
        const href = (n) => `${base}${base.includes('?') ? '&' : '?'}p=${n}`;
        let nums = '';
        for (let n = 1; n <= pages; n++) nums += `<a class="pager__num" href="${href(n)}"${n === page ? ' aria-current="page"' : ''}>${n}</a>`;
        return `<nav class="pager" aria-label="${t().pagesNav}">
            ${page > 1 ? `<a class="btn btn--outline btn--sm" href="${href(page - 1)}">${icon('back')}<span>${t().prev}</span></a>` : '<span></span>'}
            <div class="pager__nums">${nums}<span class="sr-only">${t().page(page, pages)}</span></div>
            ${page < pages ? `<a class="btn btn--primary btn--sm" href="${href(page + 1)}"><span>${t().next}</span>${icon('next')}</a>` : '<span></span>'}
        </nav>`;
    };

    /* ---------------------------------------------------------------- */
    /*  Agenda general                                                    */
    /* ---------------------------------------------------------------- */
    const PAGE_SIZE = 5;
    const sched = { q: '', f: { track: new Set(), format: new Set(), level: new Set(), lang: new Set(), room: new Set() }, panel: false };
    const FILTER_GROUPS = () => [
        ['track', t().track, D.TRACKS], ['format', t().format, D.FORMATS], ['level', t().level, D.LEVELS],
        ['lang', t().language, D.LANGS], ['room', t().room, Object.fromEntries(Object.entries(D.ROOMS).filter(([k]) => k !== 'plaza').map(([k, r]) => [k, r.name]))]
    ];
    const activeCount = () => Object.values(sched.f).reduce((n, s) => n + s.size, 0);
    const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const matches = (e) => {
        const f = sched.f;
        const any = activeCount() > 0;
        if (any && e.format === 'break') return false;
        if (f.track.size && !f.track.has(e.track) && !(e.also || []).some((k) => f.track.has(k))) return false;
        if (f.format.size && !f.format.has(e.format)) return false;
        if (f.level.size && !f.level.has(e.level)) return false;
        if (f.lang.size && !f.lang.has(e.lang)) return false;
        if (f.room.size && !f.room.has(e.room)) return false;
        if (!sched.q) return true;
        return norm([pick(e.title), whoName(e), roomName(e.room), ...evTags(e)].join(' ')).includes(norm(sched.q));
    };
    const dayIndex = () => Math.min(2, Math.max(0, +(current.query.d || 0)));

    function renderSchedule() {
        const rec = D.EVENTS[D.RECOMMENDED], recWho = person(rec.who);
        view.innerHTML = `<div class="view-wrap" data-schedule>
            ${crumbs([['#inicio', t().home]])}
            <section class="card card--frame">
                <div class="schedule-head">
                    <div>
                        <p class="eyebrow">${t().program}</p>
                        <h1 class="title">${t().schedule}</h1>
                    </div>
                    <div class="schedule-head__actions">
                        <a class="btn btn--outline" href="#/agenda/mi">${icon('star')}<span>${t().mine}</span> <span class="count" data-mine-count>${A.mine.size}</span></a>
                        <p class="tag tag--fill tag--lg">${icon('cal')}<span>${t().dates}</span></p>
                    </div>
                </div>

                <article class="inset recommend">
                    <p class="eyebrow">${t().recommended}</p>
                    <div class="recommend__grid">
                        ${recWho ? A.avatarHTML(recWho, 'avatar--md') : ''}
                        <div>
                            <h2 class="recommend__title"><a href="#/agenda/evento/${rec.id}">${esc(pick(rec.title))}</a></h2>
                            <p class="muted">${esc(whoName(rec))} · ${esc(pick(D.DAYS[rec.day].label))} ${D.DAYS[rec.day].num} · ${rec.t}</p>
                            <ul class="tags">${evTags(rec).map((x) => `<li class="tag">${esc(x)}</li>`).join('')}</ul>
                        </div>
                        <div class="recommend__actions">
                            ${roomBtn(rec)}
                            <a class="btn btn--primary btn--sm" href="#/agenda/evento/${rec.id}">${t().details}</a>
                            <span data-rec-star>${starBtn(rec)}</span>
                        </div>
                    </div>
                </article>

                <div class="days" role="tablist" aria-label="${t().program}">
                    ${D.DAYS.map((d, i) => `<a class="day" role="tab" href="#/agenda?d=${i}" data-day="${i}">
                        <span>${esc(pick(d.label))}</span><b>${d.num}</b></a>`).join('')}
                </div>

                <div class="inset schedule" role="tabpanel">
                    <div class="schedule__summary">
                        <h2 data-day-title></h2>
                        <p class="muted" data-day-count aria-live="polite"></p>
                    </div>
                    <div class="search-row">
                        <div class="search">
                            <svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
                            <label class="sr-only" for="search-input">${t().searchLabel}</label>
                            <input id="search-input" type="search" placeholder="${t().search}" autocomplete="off" value="${esc(sched.q)}">
                        </div>
                        <button type="button" class="filter-btn" aria-expanded="${sched.panel}" aria-controls="filter-panel" data-filter-toggle>
                            ${icon('filter')}<span>${t().filters}</span><span class="count" data-filter-count ${activeCount() ? '' : 'hidden'}>${activeCount()}</span>
                        </button>
                    </div>
                    <div class="filter-panel" id="filter-panel" ${sched.panel ? '' : 'hidden'}>
                        <p class="filter-panel__title">${t().filtersTitle}</p>
                        ${FILTER_GROUPS().map(([key, name, opts]) => `<fieldset class="filter-group">
                            <legend>${esc(name)}</legend>
                            <div>${Object.entries(opts).map(([k, v]) => `<button type="button" class="tag filter" data-f="${key}" data-v="${k}" aria-pressed="${sched.f[key].has(k)}">${esc(pick(v))}</button>`).join('')}</div>
                        </fieldset>`).join('')}
                        <div class="btn-row">
                            <button type="button" class="btn btn--outline btn--sm" data-clear>${t().clear}</button>
                            <button type="button" class="btn btn--primary btn--sm" data-filter-toggle>${t().apply}</button>
                        </div>
                    </div>
                    <div class="filters" data-chips></div>
                    <ol class="events" data-events></ol>
                    <p class="events__empty" data-empty hidden>${t().empty}</p>
                    <div data-pager></div>
                </div>
            </section>
        </div>`;

        const input = $('#search-input', view);
        input.addEventListener('input', () => { sched.q = input.value.trim(); goPage1(); });
        view.querySelector('[data-schedule]').addEventListener('click', onScheduleClick);
        updateSchedule(false);
    }
    // Al buscar o filtrar se vuelve a la página 1 sin crear una entrada nueva en el historial
    function goPage1() {
        if (+(current.query.p || 1) !== 1) {
            current.query.p = '1';
            history.replaceState(null, '', `#/agenda?d=${dayIndex()}`);
        }
        updateSchedule(false);
    }
    function onScheduleClick(e) {
        const tog = e.target.closest('[data-filter-toggle]');
        if (tog) {
            sched.panel = !sched.panel;
            $('#filter-panel', view).hidden = !sched.panel;
            $('.filter-btn', view).setAttribute('aria-expanded', String(sched.panel));
            if (!sched.panel) $('.filter-btn', view).focus();
            return;
        }
        const f = e.target.closest('[data-f]');
        if (f) {
            const set = sched.f[f.dataset.f];
            set.has(f.dataset.v) ? set.delete(f.dataset.v) : set.add(f.dataset.v);
            f.setAttribute('aria-pressed', String(set.has(f.dataset.v)));
            goPage1();
            return;
        }
        const rm = e.target.closest('[data-rm]');
        if (rm) {
            const [k, v] = rm.dataset.rm.split(':');
            sched.f[k].delete(v);
            $$(`[data-f="${k}"][data-v="${v}"]`, view).forEach((b) => b.setAttribute('aria-pressed', 'false'));
            goPage1();
            return;
        }
        if (e.target.closest('[data-clear]')) {
            Object.values(sched.f).forEach((s) => s.clear());
            sched.q = '';
            $('#search-input', view).value = '';
            $$('[data-f]', view).forEach((b) => b.setAttribute('aria-pressed', 'false'));
            goPage1();
        }
    }
    function updateSchedule(fromNav) {
        const d = dayIndex(), day = D.DAYS[d];
        $$('.day', view).forEach((tab) => {
            const on = +tab.dataset.day === d;
            tab.setAttribute('aria-selected', String(on));
            if (on) tab.setAttribute('aria-current', 'page'); else tab.removeAttribute('aria-current');
        });
        const shown = day.events.filter(matches);
        const { items, page, pages } = paginate(shown, +current.query.p, PAGE_SIZE);
        $('[data-day-title]', view).textContent = pick(day.title);
        $('[data-day-count]', view).textContent = shown.length === day.events.length ? t().blocks(day.events.length) : t().results(shown.length, day.events.length);
        $('[data-events]', view).innerHTML = items.map((e) => eventRow(e)).join('');
        $('[data-empty]', view).hidden = shown.length > 0;
        $('[data-pager]', view).innerHTML = pager(`#/agenda?d=${d}`, page, pages);
        $('[data-mine-count]', view).textContent = A.mine.size;
        $('[data-rec-star]', view).innerHTML = starBtn(D.EVENTS[D.RECOMMENDED]);
        const n = activeCount(), badge = $('[data-filter-count]', view);
        badge.textContent = n; badge.hidden = !n;
        const chips = [`<button type="button" class="tag filter" data-clear aria-pressed="${!n && !sched.q}">${t().all} (${day.events.filter((e) => e.format !== 'break').length})</button>`];
        FILTER_GROUPS().forEach(([key, , opts]) => sched.f[key].forEach((v) => chips.push(
            `<button type="button" class="tag tag--fill tag--removable" data-rm="${key}:${v}" aria-label="${esc(pick(opts[v]))} ✕">${esc(pick(opts[v]))} <span aria-hidden="true">✕</span></button>`)));
        $('[data-chips]', view).innerHTML = chips.join('');
        if (fromNav) {
            const top = $('.days', view).getBoundingClientRect().top + scrollY - 100;
            if (Math.abs(scrollY - top) > 40) scrollTo({ top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        }
    }

    /* ---------------------------------------------------------------- */
    /*  Mi agenda                                                         */
    /* ---------------------------------------------------------------- */
    function renderMine(r) {
        const saved = D.DAYS.flatMap((d) => d.events).filter((e) => A.mine.has(e.id));
        const { items, page, pages } = paginate(saved, +(r.query?.p), 6);
        view.innerHTML = `<div class="view-wrap">
            ${crumbs([['#/agenda', t().backGeneral, 'back', true], ['#inicio', t().home, 'back']])}
            <section class="card card--frame">
                <p class="eyebrow">${t().mine}</p>
                <h1 class="title">${t().mineTitle}</h1>
                <p class="muted">${t().mineLead(saved.length)}</p>
                ${saved.length ? `<ol class="events">${items.map((e) => eventRow(e, { showDay: true })).join('')}</ol>${pager('#/agenda/mi', page, pages)}`
                    : `<div class="inset empty-state">${icon('star', 'ico ico--xl')}<p>${t().mineEmpty}</p><a class="btn btn--primary" href="#/agenda">${t().goSchedule}</a></div>`}
                <div class="btn-row view-foot"><a class="btn btn--outline" href="#/agenda">${icon('back')}<span>${t().backGeneral}</span></a></div>
            </section>
        </div>`;
    }

    /* ---------------------------------------------------------------- */
    /*  Evento + mapa del campus                                          */
    /* ---------------------------------------------------------------- */
    let mapStart = 'gate';
    function shortestPath(from, to) {
        const N = D.MAP.nodes, adj = {};
        D.MAP.edges.forEach(([a, b]) => { (adj[a] ||= []).push(b); (adj[b] ||= []).push(a); });
        const dist = (a, b) => Math.hypot(N[a].x - N[b].x, N[a].y - N[b].y);
        const best = { [from]: 0 }, prev = {}, todo = new Set(Object.keys(N));
        while (todo.size) {
            let u = null;
            todo.forEach((n) => { if (best[n] !== undefined && (u === null || best[n] < best[u])) u = n; });
            if (u === null || u === to) break;
            todo.delete(u);
            (adj[u] || []).forEach((v) => {
                const alt = best[u] + dist(u, v);
                if (best[v] === undefined || alt < best[v]) { best[v] = alt; prev[v] = u; }
            });
        }
        const path = [to];
        while (path[0] !== from && prev[path[0]]) path.unshift(prev[path[0]]);
        return { path, length: best[to] || 0 };
    }

    function campusMap(targetNode, start) {
        const N = D.MAP.nodes;
        const { path } = shortestPath(start, targetNode);
        const d = path.map((n, i) => `${i ? 'L' : 'M'}${N[n].x} ${N[n].y}`).join(' ');
        const B = (x, y, w, h, name, sub, key) => `<g class="bld${key && D.ROOMS[key]?.node === targetNode ? ' bld--target' : ''}">
            <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/><text x="${x + w / 2}" y="${y + h / 2 - 2}">${esc(name)}</text>
            <text class="bld__sub" x="${x + w / 2}" y="${y + h / 2 + 14}">${esc(sub)}</text></g>`;
        const trees = [[60, 120], [95, 90], [140, 60], [330, 70], [355, 230], [520, 230], [610, 240], [720, 180], [760, 120], [200, 470], [420, 470], [520, 470], [70, 360], [360, 420], [730, 380]]
            .map(([x, y]) => `<circle class="tree" cx="${x}" cy="${y}" r="${12 + ((x + y) % 9)}"/>`).join('');
        const R = D.ROOMS;
        return `<svg class="campus" viewBox="0 0 800 520" role="img" aria-label="${t().howTo} ${esc(roomName(Object.keys(R).find((k) => R[k].node === targetNode)))}">
            <rect class="campus__bg" width="800" height="520"/>
            <rect class="campus__road" x="0" y="500" width="800" height="20"/><text class="campus__roadlabel" x="400" y="514">Carrera 49</text>
            <ellipse class="campus__lake" cx="110" cy="250" rx="70" ry="45"/>
            ${trees}
            <rect class="campus__park" x="700" y="432" width="92" height="62" rx="6"/><text class="campus__small" x="746" y="468">P</text>
            ${D.MAP.edges.map(([a, b]) => `<line class="campus__path" x1="${N[a].x}" y1="${N[a].y}" x2="${N[b].x}" y2="${N[b].y}"/>`).join('')}
            <circle class="campus__plaza" cx="300" cy="360" r="30"/><text class="campus__small" x="300" y="364">${esc(pick(R.plaza.name).split(' ')[0])}</text>
            <circle class="campus__plaza" cx="440" cy="290" r="20"/>
            ${B(170, 118, 160, 72, roomName('selva'), pick({ es: 'Bloque 19', en: 'Bldg 19' }), 'selva')}
            ${B(378, 36, 124, 70, roomName('lab'), pick({ es: 'Bloque 38', en: 'Bldg 38' }), 'lab')}
            ${B(515, 92, 160, 86, 'Auditorio Fundadores', pick({ es: 'Bloque 29', en: 'Bldg 29' }), 'fund')}
            ${B(676, 252, 104, 96, roomName('rio'), pick({ es: 'Bloque 27', en: 'Bldg 27' }), 'rio')}
            ${B(480, 330, 110, 56, pick({ es: 'Biblioteca', en: 'Library' }), '', '')}
            <path class="campus__route-bg" d="${d}"/>
            <path class="campus__route" d="${d}" data-route/>
            <g class="campus__start" transform="translate(${N[start].x} ${N[start].y})"><circle r="11"/><text y="4">${esc(t().you)}</text></g>
            <g class="campus__target" transform="translate(${N[targetNode].x} ${N[targetNode].y})"><circle class="pulse" r="10"/><circle r="8"/></g>
            <circle class="campus__walker" r="7" data-walker cx="${N[start].x}" cy="${N[start].y}"/>
        </svg>`;
    }

    function animateRoute() {
        const p = view.querySelector('[data-route]'), w = view.querySelector('[data-walker]');
        if (!p || !w) return;
        const L = p.getTotalLength();
        const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
        p.style.strokeDasharray = `${L}`;
        if (still) { p.style.strokeDashoffset = '0'; const end = p.getPointAtLength(L); w.setAttribute('cx', end.x); w.setAttribute('cy', end.y); return; }
        const dur = 1400 + L * 4, t0 = performance.now();
        const step = (now) => {
            if (!p.isConnected) return;
            const k = Math.min(1, (now - t0) / dur), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
            p.style.strokeDashoffset = String(L * (1 - e));
            const pt = p.getPointAtLength(L * e);
            w.setAttribute('cx', pt.x.toFixed(1)); w.setAttribute('cy', pt.y.toFixed(1));
            if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    function renderEvent(r) {
        const e = D.EVENTS[r.id], day = D.DAYS[e.day], room = D.ROOMS[e.room] || D.ROOMS.plaza;
        const p = person(e.who), target = room.node;
        if (r.query?.desde && D.MAP.starts.includes(r.query.desde)) mapStart = r.query.desde;
        const { path, length } = shortestPath(mapStart, target);
        const meters = Math.round(length * 1.4), mins = Math.max(1, Math.round(meters / 75));
        const N = D.MAP.nodes;
        const steps = path.map((n, i) => {
            if (i === 0) return `${t().start} <b>${esc(pick(N[n].label))}</b>`;
            if (i === path.length - 1) return `${t().arrive} <b>${esc(pick(room.name))}</b> · ${esc(pick(room.building))}`;
            return N[n].label ? `${t().cont} <b>${esc(pick(N[n].label))}</b>` : '';
        }).filter(Boolean);
        const desc = e.long ? pick(e.long) : [pick(e.desc || '')];
        view.innerHTML = `<div class="view-wrap">
            ${crumbs([['#/agenda', t().backGeneral, 'back', true], ['#/agenda/mi', t().backMine, 'star']])}
            <section class="card card--frame event-page">
                <p class="eyebrow">${esc(pick(day.title))} · ${e.t} – ${e.end}</p>
                <h1 class="title">${esc(pick(e.title))}</h1>
                ${e.format !== 'break' ? `<ul class="tags">${evTags(e).map((x, i) => `<li class="tag ${i === 0 ? 'tag--fill' : ''}">${esc(x)}</li>`).join('')}</ul>` : ''}
                <div class="event-page__grid">
                    <div>
                        ${desc.filter(Boolean).map((x) => `<p>${esc(x)}</p>`).join('')}
                        ${e.agenda ? `<h2 class="sub-h">${t().agenda}</h2><ol class="agenda-list">${pick(e.agenda).map((x) => `<li>${esc(x)}</li>`).join('')}</ol>` : ''}
                        ${p ? `<div class="mini-speaker inset">${A.avatarHTML(p, 'avatar--md')}
                            <div class="mini-speaker__body"><h3>${esc(pick(p.name))}</h3><p class="muted">${esc(pick(p.role))}</p></div>
                            <div class="btn-row"><button class="btn btn--outline btn--sm" type="button" data-open-speaker="${p.id}">${t().viewSpeaker}</button>
                            <a class="btn btn--primary btn--sm" href="#/charla/${p.id}">${t().viewTalk}</a></div></div>` : ''}
                    </div>
                    <aside class="inset event-page__when">
                        <h2 class="sub-h">${t().when}</h2>
                        <p>${icon('cal')}<span>${esc(pick(day.label))} ${day.num} · ${e.t} – ${e.end}</span></p>
                        <p>${icon('pin')}<span>${esc(pick(room.name))} · ${esc(pick(room.building))}</span></p>
                        ${e.format !== 'break' ? starBtn(e, true) : ''}
                    </aside>
                </div>
            </section>

            <section class="card card--frame map-card" aria-labelledby="map-title">
                <div class="map-card__head">
                    <div>
                        <p class="eyebrow">${icon('walk')} ${t().walk(meters, mins)}</p>
                        <h2 class="title" id="map-title">${t().howTo} ${esc(pick(room.name))}</h2>
                    </div>
                    <label class="select">
                        <span>${t().whereAreYou}</span>
                        <select data-start>${D.MAP.starts.map((s) => `<option value="${s}"${s === mapStart ? ' selected' : ''}>${esc(pick(N[s].label))}</option>`).join('')}</select>
                    </label>
                </div>
                <div class="map-card__grid">
                    <div class="inset map-card__map">${campusMap(target, mapStart)}</div>
                    <div>
                        <h3 class="sub-h">${t().steps}</h3>
                        <ol class="steps">${steps.map((s) => `<li>${s}</li>`).join('')}</ol>
                        <div class="btn-row">
                            <button class="btn btn--outline btn--sm" type="button" data-replay>${icon('walk')}<span>${t().replay}</span></button>
                            <a class="btn btn--outline btn--sm" href="https://www.openstreetmap.org/?mlat=6.2003&mlon=-75.5781#map=17/6.2003/-75.5781" target="_blank" rel="noopener">${icon('ext')}<span>${t().osm}</span></a>
                        </div>
                    </div>
                </div>
            </section>

            <div class="btn-row view-foot">
                <a class="btn btn--primary" href="#/agenda">${icon('back')}<span>${t().backGeneral}</span></a>
                <a class="btn btn--glass glass" href="#/agenda/mi">${icon('star')}<span>${t().backMine}</span></a>
            </div>
        </div>`;
        $('[data-start]', view).addEventListener('change', (ev) => {
            mapStart = ev.target.value;
            const y = scrollY;
            renderEvent({ ...r, query: {} });
            scrollTo(0, y);
            $('[data-start]', view).focus();
        });
        $('[data-replay]', view).addEventListener('click', animateRoute);
        animateRoute();
    }

    /* ---------------------------------------------------------------- */
    /*  Charla de un ponente (vista "talk" del Figma)                     */
    /* ---------------------------------------------------------------- */
    function renderTalk(r) {
        const p = A.PEOPLE[r.id], e = D.EVENTS[p.talk], day = D.DAYS[e.day], isKey = r.id.startsWith('k');
        const back = isKey ? ['#keynotes', t().backKeynotes] : ['#ponentes', t().backSpeakers];
        const desc = e.long ? pick(e.long) : [pick(e.desc)];
        view.innerHTML = `<div class="view-wrap">
            ${crumbs([[back[0], back[1], 'back', true]])}
            <article class="card card--frame talk">
                <p class="eyebrow">${t().session}</p>
                <ul class="tags">${[e.track, ...(e.also || [])].map((k) => `<li class="tag tag--fill tag--lg">${esc(label(D.TRACKS, k))}</li>`).join('')}</ul>
                <h1 class="title title--xl">${esc(pick(e.title))}</h1>
                <ul class="tags">
                    <li class="tag tag--lg">${t().format}: ${esc(label(D.FORMATS, e.format))}</li>
                    <li class="tag tag--lg">${t().level}: ${esc(label(D.LEVELS, e.level))}</li>
                    <li class="tag tag--lg">${t().language}: ${esc(label(D.LANGS, e.lang))}</li>
                </ul>
                <div class="event-page__grid">
                    <div class="talk__desc">
                        ${desc.map((x) => `<p>${esc(x)}</p>`).join('')}
                        ${e.agenda ? `<h2 class="sub-h">${t().agenda}</h2><ol class="agenda-list">${pick(e.agenda).map((x) => `<li>${esc(x)}</li>`).join('')}</ol>` : ''}
                    </div>
                    <aside class="inset event-page__when">
                        <h2 class="sub-h">${t().when}</h2>
                        <p>${icon('cal')}<span>${esc(pick(day.label))} ${day.num} · ${e.t} – ${e.end}</span></p>
                        ${roomBtn(e)}
                        ${starBtn(e, true)}
                    </aside>
                </div>

                <p class="eyebrow talk__speaker-h">${t().speaker}</p>
                <div class="speaker-strip inset">
                    <div class="speaker-strip__photo">${A.avatarHTML(p)}</div>
                    <div class="speaker-strip__body">
                        <h2>${esc(pick(p.name))}</h2>
                        <p class="muted">${esc(pick(p.role))}</p>
                        <p>${esc(pick(p.bio).slice(0, 180))}${pick(p.bio).length > 180 ? '…' : ''}</p>
                        <ul class="social">${A.socialHTML()}</ul>
                    </div>
                    <button class="btn btn--primary" type="button" data-open-speaker="${p.id}">${t().viewSpeaker}</button>
                </div>
            </article>
            <div class="btn-row view-foot">
                <a class="btn btn--primary" href="${back[0]}">${icon('back')}<span>${back[1]}</span></a>
            </div>
        </div>`;
    }

    /* ---------------------------------------------------------------- */
    /*  Patrocinador (vista "sponsor" del Figma)                          */
    /* ---------------------------------------------------------------- */
    function renderSponsor(r) {
        const s = D.SPONSORS.find((x) => x.id === r.id);
        const tier = pick(D.TIERS.find(([k]) => k === s.tier)[1]);
        const url = s.url || 'https://www.example.com';
        view.innerHTML = `<div class="view-wrap">
            ${crumbs([['#patrocinadores', t().backSponsors, 'back', true]])}
            <article class="card card--frame sponsor-page">
                <p class="sponsor-page__tier">${esc(tier)}</p>
                <div class="inset sponsor-page__logo">${A.logoHTML(s, true)}</div>
                <h1 class="title title--xl">${esc(s.name)}</h1>
                <p class="eyebrow eyebrow--center">${t().aboutUs}</p>
                <h2 class="title">${t().aboutSponsor}</h2>
                <p class="sponsor-page__lead">${esc(pick(s.about))}</p>
                <div class="btn-row btn-row--center">
                    <a class="btn btn--primary" href="${esc(url)}" target="_blank" rel="noopener">${icon('ext')}<span>${t().visit}</span></a>
                    <a class="btn btn--outline" href="#patrocinadores">${icon('back')}<span>${t().backSponsors}</span></a>
                </div>
                <p class="sponsor-page__more">${esc(pick(s.more))}</p>
                <p class="eyebrow eyebrow--center">${t().videos}</p>
                <ul class="videos">${[1, 2, 3].map((n) => `<li class="video" style="--brand:${s.color}">
                    <button type="button" aria-label="${t().videos} ${n} · ${esc(s.name)}">${icon('play')}</button></li>`).join('')}</ul>
                <div class="btn-row btn-row--center">
                    <a class="btn btn--primary" href="mailto:sponsors@pycon.co">${t().becomeSponsor}</a>
                    <a class="btn btn--outline" href="#patrocinadores">${t().backSponsors}</a>
                </div>
            </article>
        </div>`;
    }

    /* ---------------------------------------------------------------- */
    /*  Código de conducta + formulario de reporte                        */
    /* ---------------------------------------------------------------- */
    function renderCoc() {
        view.innerHTML = `<div class="view-wrap view-wrap--narrow">
            ${crumbs([['#inicio', t().home]])}
            <article class="card card--frame doc">
                <p class="eyebrow">PyCon Colombia 2028</p>
                <h1 class="title title--xl">${t().cocTitle}</h1>
                <p class="doc__intro">${t().cocIntro}</p>
                ${D.COC[A.lang].map(([h, p], i) => `<section><h2><span>${String(i + 1).padStart(2, '0')}</span>${esc(h)}</h2><p>${esc(p)}</p></section>`).join('')}
                <div class="inset doc__cta">
                    <h2>${t().reportQ}</h2>
                    <p>${t().reportP}</p>
                    <a class="btn btn--primary" href="#/codigo-de-conducta/reporte">${t().openReport}</a>
                </div>
            </article>
        </div>`;
    }

    const field = (id, lab, type = 'text', extra = '') => `<div class="field"><label for="${id}">${esc(lab)}</label>
        ${type === 'textarea' ? `<textarea id="${id}" name="${id}" rows="5" ${extra}></textarea>` : `<input id="${id}" name="${id}" type="${type}" ${extra}>`}
        <p class="field__err" id="${id}-err" hidden></p></div>`;
    const checks = (name, legend, opts) => `<fieldset class="field field--checks" id="${name}"><legend>${esc(legend)}</legend>
        <div>${opts.map((o, i) => `<label class="check"><input type="checkbox" name="${name}" value="${i}"><span>${esc(o)}</span></label>`).join('')}</div>
        <p class="field__err" id="${name}-err" hidden></p></fieldset>`;
    function setErr(form, id, msg) {
        const err = $(`#${id}-err`, form), el = $(`#${id}`, form);
        err.textContent = msg || ''; err.hidden = !msg;
        if (el) { el.setAttribute('aria-invalid', String(!!msg)); if (msg) el.setAttribute('aria-describedby', `${id}-err`); }
        return !msg;
    }

    function renderReport() {
        view.innerHTML = `<div class="view-wrap view-wrap--narrow">
            ${crumbs([['#/codigo-de-conducta', t().backCoc, 'back', true]])}
            <section class="card card--frame">
                <p class="eyebrow">${t().cocTitle}</p>
                <h1 class="title">${t().reportTitle}</h1>
                <p class="muted">${t().reportLead}</p>
                <form class="form" novalidate data-report>
                    <label class="check check--box"><input type="checkbox" name="anon" data-anon><span>${t().anon}</span></label>
                    <div class="form__row" data-identity>
                        ${field('r-name', t().name, 'text', 'autocomplete="name"')}
                        ${field('r-email', t().email, 'email', 'autocomplete="email"')}
                    </div>
                    <div class="form__row">
                        ${field('r-when', t().when2, 'datetime-local')}
                        ${field('r-where', t().where)}
                    </div>
                    ${field('r-what', t().whatHappened, 'textarea', 'required')}
                    ${field('r-who', t().who)}
                    <label class="check check--box"><input type="checkbox" name="urgent" data-urgent><span>${t().urgent}</span></label>
                    <p class="notice" data-urgent-note hidden>${t().urgentNote}</p>
                    <div class="btn-row">
                        <button class="btn btn--primary" type="submit">${t().send}</button>
                        <a class="btn btn--outline" href="#/codigo-de-conducta">${t().backCoc}</a>
                    </div>
                </form>
                <div class="inset form-ok" data-ok hidden role="status"></div>
            </section>
        </div>`;
        const form = $('[data-report]', view);
        $('[data-anon]', form).addEventListener('change', (e) => { $('[data-identity]', form).hidden = e.target.checked; });
        $('[data-urgent]', form).addEventListener('change', (e) => { $('[data-urgent-note]', form).hidden = !e.target.checked; });
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const anon = $('[data-anon]', form).checked, email = $('#r-email', form);
            let ok = setErr(form, 'r-what', $('#r-what', form).value.trim() ? '' : t().required);
            if (!anon && email.value.trim()) ok = setErr(form, 'r-email', email.checkValidity() ? '' : t().emailErr) && ok;
            if (!ok) { form.querySelector('[aria-invalid="true"]')?.focus(); return; }
            const ref = 'PYC-' + Math.random().toString(36).slice(2, 7).toUpperCase();
            form.hidden = true;
            const box = $('[data-ok]', view);
            box.hidden = false;
            box.innerHTML = `<p>${t().reportOk(ref)}</p><div class="btn-row"><a class="btn btn--primary" href="#/codigo-de-conducta">${t().backCoc}</a><a class="btn btn--outline" href="#inicio">${t().backHome}</a></div>`;
            box.tabIndex = -1; box.focus();
        });
    }

    /* ---------------------------------------------------------------- */
    /*  Registro de voluntarios                                           */
    /* ---------------------------------------------------------------- */
    function renderVolunteer() {
        view.innerHTML = `<div class="view-wrap view-wrap--narrow">
            ${crumbs([['#voluntariado', t().backHome, 'back', true]])}
            <section class="card card--frame">
                <p class="eyebrow">PyCon Colombia 2028</p>
                <h1 class="title">${t().volTitle}</h1>
                <p class="muted">${t().volLead}</p>
                <form class="form" novalidate data-vol>
                    <div class="form__row">
                        ${field('v-name', t().name + ' *', 'text', 'required autocomplete="name"')}
                        ${field('v-email', t().email + ' *', 'email', 'required autocomplete="email"')}
                    </div>
                    <div class="form__row">
                        ${field('v-phone', t().phone, 'tel', 'autocomplete="tel"')}
                        ${field('v-city', t().city, 'text', 'value="Medellín"')}
                    </div>
                    ${checks('v-areas', t().areas, t().areaOpts)}
                    ${checks('v-days', t().days, t().dayOpts)}
                    <div class="field"><label for="v-shirt">${t().shirt}</label>
                        <select id="v-shirt" name="v-shirt">${['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => `<option${s === 'M' ? ' selected' : ''}>${s}</option>`).join('')}</select></div>
                    ${field('v-exp', t().exp, 'textarea')}
                    <label class="check check--box" id="v-coc-wrap"><input type="checkbox" id="v-coc"><span>${t().cocAgree.replace(/código de conducta|code of conduct/i, (m) => `<a href="#/codigo-de-conducta" target="_blank">${m}</a>`)}</span></label>
                    <p class="field__err" id="v-coc-err" hidden></p>
                    <div class="btn-row">
                        <button class="btn btn--primary" type="submit">${t().register}</button>
                        <a class="btn btn--outline" href="#voluntariado">${t().backHome}</a>
                    </div>
                </form>
                <div class="inset form-ok" data-ok hidden role="status"></div>
            </section>
        </div>`;
        const form = $('[data-vol]', view);
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = $('#v-name', form), email = $('#v-email', form);
            let ok = setErr(form, 'v-name', name.value.trim() ? '' : t().required);
            ok = setErr(form, 'v-email', !email.value.trim() ? t().required : email.checkValidity() ? '' : t().emailErr) && ok;
            ok = setErr(form, 'v-areas', $$('[name="v-areas"]:checked', form).length ? '' : t().pickOne) && ok;
            ok = setErr(form, 'v-days', $$('[name="v-days"]:checked', form).length ? '' : t().pickOne) && ok;
            ok = setErr(form, 'v-coc', $('#v-coc', form).checked ? '' : t().required) && ok;
            if (!ok) { (form.querySelector('[aria-invalid="true"] input, [aria-invalid="true"]'))?.focus(); return; }
            form.hidden = true;
            const box = $('[data-ok]', view);
            box.hidden = false;
            box.innerHTML = `<p>${esc(t().volOk(name.value.trim().split(' ')[0]))}</p><div class="btn-row"><a class="btn btn--primary" href="#inicio">${t().backHome}</a><a class="btn btn--outline" href="#/agenda">${t().goSchedule}</a></div>`;
            box.tabIndex = -1; box.focus();
        });
    }

    function renderNotFound() {
        view.innerHTML = `<div class="view-wrap view-wrap--narrow"><section class="card card--frame"><h1 class="title">404</h1>
            <a class="btn btn--primary" href="#inicio">${t().backHome}</a></section></div>`;
    }

    // Arranque: si la página se abre directamente en una ruta interna
    if (location.hash.startsWith('#/')) route();
})();
