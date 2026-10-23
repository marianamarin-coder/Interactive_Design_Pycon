/* =========================================================================
   PyCon Colombia 2028 — Páginas internas (fuera de la landing)
   Enrutador por hash: las direcciones "#/…" muestran una página interna y
   ocultan la landing; los anclajes normales ("#boletas") vuelven a ella.

   #/agenda?d=0&p=1           Agenda general (día y página)
   #/agenda/mi?p=1            Mi agenda (eventos guardados)
   #/agenda/evento/d1-2       Evento + mapa del campus con la ruta a la sala
   #/charla/s0                Charla de un ponente o keynote (vista "talk" del Figma)
   #/patrocinadores           Patrocinadores por categoría
   #/patrocinador/ceiba       Patrocinador (vista "sponsor" del Figma)
   #/cuenta/s0/ig             Red social que aún no está habilitada
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
            speaker: 'Ponente', viewSpeaker: 'Ver ponente', viewTalk: 'Ver la charla', agenda: 'Agenda de la charla', about: 'Descripción', learn: 'Lo que aprenderás', audience: '¿Para quién es?', duration: 'Duración',
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
            phone: 'Teléfono', city: 'Ciudad', shirt: 'Talla de camiseta', exp: 'Cuéntanos de tu experiencia (opcional)',
            allDays: 'Recuerda: como voluntario debes estar disponible los 3 días del evento, del viernes 14 al domingo 16 de julio de 2028.',
            grantKicker: 'Becas', grantTitle: 'Aplica a una beca', backTickets: 'Volver a boletas',
            grantLead: 'Queremos que nadie se quede por fuera de PyCon Colombia por motivos económicos. Cuéntanos quién eres y por qué quieres asistir.',
            grantCovers: ['Boleta para los 3 días, con alimentación y kit', 'Apoyo de viaje y hospedaje para quien venga de otra ciudad', 'Prioridad para estudiantes y grupos subrepresentados'],
            personal: 'Datos personales', fullName: 'Nombre completo', cityCountry: 'Ciudad y país', occupation: 'Ocupación', choose: 'Elige una opción',
            occOpts: ['Estudiante', 'Docente', 'Profesional', 'Buscando empleo', 'Otra'], org: 'Universidad, colegio u organización',
            motive: 'Motivo', why: '¿Por qué aplicas a la beca y qué esperas aprender en PyCon Colombia?',
            minChars: (min, n) => (n >= min ? `${n} caracteres ✓` : `${n} de ${min} caracteres mínimos`),
            tooShort: (min) => `Cuéntanos un poco más (mínimo ${min} caracteres).`,
            travel: 'Necesito apoyo de viaje y hospedaje', sendGrant: 'Enviar aplicación',
            grantOk: (n, r) => `¡Gracias, ${n}! Recibimos tu aplicación a beca (referencia ${r}). Te daremos respuesta por correo en un máximo de 3 semanas.`,
            propTitle: 'Envía tu propuesta', propKicker: 'Convocatoria abierta', backCfp: 'Volver a la convocatoria',
            propLead: 'Cuéntanos qué te gustaría compartir con la comunidad. El comité revisa todas las propuestas y responde por correo; si es tu primera charla, te acompañamos con mentoría.',
            aboutYou: 'Sobre ti', aboutTalk: 'Sobre tu propuesta', talkTitle: 'Título de la propuesta', formatQ: 'Formato',
            propFormats: { talk: 'Charla (30 min)', workshop: 'Taller (2 h)', lightning: 'Lightning talk (5 min)' },
            abstract: 'Resumen para el público (aparecerá en la agenda)', notes: 'Notas para el comité (opcional): ¿qué hace especial tu propuesta?',
            bioQ: 'Biografía corta (opcional)', firstTalk: 'Es mi primera charla en un evento', wantMentor: 'Me gustaría recibir mentoría para preparar la charla',
            sendProp: 'Enviar propuesta',
            propOk: (n, r) => `¡Gracias, ${n}! Recibimos tu propuesta (referencia ${r}). El comité la revisará y te responderá por correo en un máximo de 4 semanas.`,
            mentTitle: 'Solicita mentoría', mentKicker: 'Mentoría para ponentes',
            mentLead: 'Una persona con experiencia en charlas te acompaña a definir tu idea, escribir la propuesta y ensayar. Es gratis y pensada especialmente para quienes nunca han dado una charla.',
            helpQ: '¿En qué necesitas ayuda?', helpOpts: ['Definir el tema y escribir la propuesta', 'Preparar las diapositivas y ensayar', 'Todo el proceso, de la idea a la charla'],
            topicQ: 'Tema o idea tentativa de tu charla', expQ: 'Experiencia hablando en público',
            expOpts: ['Nunca he dado una charla', 'He hablado en clases o reuniones pequeñas', 'Ya he dado charlas en eventos'],
            availQ: 'Disponibilidad para reuniones (opcional)', availPh: 'Ej.: martes y jueves en la noche', msgQ: 'Algo más que quieras contarnos (opcional)',
            sendMent: 'Solicitar mentoría',
            mentOk: (n, r) => `¡Gracias, ${n}! Recibimos tu solicitud de mentoría (referencia ${r}). En menos de una semana te escribiremos para presentarte a tu mentor o mentora.`,
            pick: 'Elige una opción',
            cocAgree: 'Leí y acepto el código de conducta *', register: 'Enviar registro', volOk: (n) => `¡Gracias, ${n}! Recibimos tu registro como voluntario. Pronto te escribiremos 🌿`,
            emailErr: 'Escribe un correo válido.', backHome: 'Volver al inicio', newReport: 'Enviar otro reporte',
            viewTalkShort: 'Ver charla', viewProfile: 'Ver perfil', talkLabel: 'Charla',
            spoTitle: 'Con el respaldo de líderes de la industria', spoBtn: 'Sé patrocinador',
            spoLead: 'PyCon Colombia es posible gracias al apoyo de organizaciones comprometidas con el ecosistema Python y la innovación tecnológica en Latinoamérica.',
            sponsorOf: 'Ver patrocinador',
            accTitle: 'Esta cuenta no está habilitada',
            accP: (net, name) => `La cuenta de ${net} de ${name} no está habilitada en este momento. Cuando esté disponible, este botón te llevará directamente a su perfil.`,
            accPycon: (net) => `La cuenta de ${net} no está habilitada en este momento.`,
            goBack: 'Volver', seeSpeakers: 'Ver ponentes', seeKeynotes: 'Ver keynotes',
            addCal: 'Añadir a mi calendario', calOk: 'Descargamos el evento (.ics): ábrelo para agregarlo a tu calendario.',
            noDay: (q, d) => `No hay resultados para «${q}» el ${d}.`,
            noDayF: (d) => `No hay resultados con estos filtros el ${d}.`,
            otherDays: (n) => `Encontramos ${n} ${n === 1 ? 'resultado' : 'resultados'} en otros días:`,
            goDay: (d) => `Ver el ${d}`,
            noneAll: (q) => `No encontramos nada para «${q}» en los 3 días. Te sugerimos:`,
            suggestions: 'Sugerencias para ti',
            perDay: { keynote: ['keynote', 'keynotes'], talk: ['charla', 'charlas'], workshop: ['taller', 'talleres'], lightning: ['bloque de lightning talks', 'bloques de lightning talks'] },
            activities: (n) => `${n} ${n === 1 ? 'actividad' : 'actividades'}`
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
            speaker: 'Speaker', viewSpeaker: 'View speaker', viewTalk: 'View the talk', agenda: 'Talk agenda', about: 'Description', learn: 'What you will learn', audience: 'Who is it for?', duration: 'Duration',
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
            phone: 'Phone', city: 'City', shirt: 'T-shirt size', exp: 'Tell us about your experience (optional)',
            allDays: 'Remember: as a volunteer you must be available for all 3 days of the event, Friday 14 to Sunday 16 July 2028.',
            grantKicker: 'Financial aid', grantTitle: 'Apply for a grant', backTickets: 'Back to tickets',
            grantLead: 'We want no one to miss PyCon Colombia for financial reasons. Tell us who you are and why you want to attend.',
            grantCovers: ['Ticket for all 3 days, with meals and kit', 'Travel and lodging support for people coming from other cities', 'Priority for students and underrepresented groups'],
            personal: 'Personal details', fullName: 'Full name', cityCountry: 'City and country', occupation: 'Occupation', choose: 'Choose an option',
            occOpts: ['Student', 'Teacher', 'Professional', 'Looking for a job', 'Other'], org: 'University, school or organization',
            motive: 'Reason', why: 'Why are you applying for a grant and what do you hope to learn at PyCon Colombia?',
            minChars: (min, n) => (n >= min ? `${n} characters ✓` : `${n} of ${min} minimum characters`),
            tooShort: (min) => `Tell us a bit more (at least ${min} characters).`,
            travel: 'I need travel and lodging support', sendGrant: 'Send application',
            grantOk: (n, r) => `Thank you, ${n}! We received your grant application (reference ${r}). We will reply by email within 3 weeks.`,
            propTitle: 'Submit your proposal', propKicker: 'Call for proposals open', backCfp: 'Back to the call for proposals',
            propLead: 'Tell us what you would like to share with the community. The committee reviews every proposal and replies by email; if it is your first talk, we will support you with mentoring.',
            aboutYou: 'About you', aboutTalk: 'About your proposal', talkTitle: 'Proposal title', formatQ: 'Format',
            propFormats: { talk: 'Talk (30 min)', workshop: 'Workshop (2 h)', lightning: 'Lightning talk (5 min)' },
            abstract: 'Abstract for the audience (it will appear in the schedule)', notes: 'Notes for the committee (optional): what makes your proposal special?',
            bioQ: 'Short bio (optional)', firstTalk: 'This is my first talk at an event', wantMentor: 'I would like mentoring to prepare the talk',
            sendProp: 'Submit proposal',
            propOk: (n, r) => `Thank you, ${n}! We received your proposal (reference ${r}). The committee will review it and reply by email within 4 weeks.`,
            mentTitle: 'Request mentoring', mentKicker: 'Speaker mentoring',
            mentLead: 'An experienced speaker helps you shape your idea, write the proposal and rehearse. It is free and designed especially for people who have never given a talk.',
            helpQ: 'What do you need help with?', helpOpts: ['Choosing the topic and writing the proposal', 'Preparing the slides and rehearsing', 'The whole process, from idea to talk'],
            topicQ: 'Tentative topic or idea for your talk', expQ: 'Public speaking experience',
            expOpts: ['I have never given a talk', 'I have spoken in classes or small meetings', 'I have given talks at events'],
            availQ: 'Availability for meetings (optional)', availPh: 'E.g.: Tuesday and Thursday evenings', msgQ: 'Anything else you want to tell us (optional)',
            sendMent: 'Request mentoring',
            mentOk: (n, r) => `Thank you, ${n}! We received your mentoring request (reference ${r}). Within a week we will write to introduce you to your mentor.`,
            pick: 'Choose an option',
            cocAgree: 'I have read and accept the code of conduct *', register: 'Send registration', volOk: (n) => `Thank you, ${n}! We received your volunteer registration. We will write to you soon 🌿`,
            emailErr: 'Please enter a valid email.', backHome: 'Back to home', newReport: 'Send another report',
            viewTalkShort: 'View talk', viewProfile: 'View profile', talkLabel: 'Talk',
            spoTitle: 'Trusted by industry leaders', spoBtn: 'Become a sponsor',
            spoLead: 'PyCon Colombia is made possible through the generous support of organizations dedicated to advancing the Python ecosystem and fostering technological innovation in Latin America.',
            sponsorOf: 'View sponsor',
            accTitle: 'This account is not available',
            accP: (net, name) => `${name}'s ${net} account is not available at the moment. Once it is, this button will take you straight to their profile.`,
            accPycon: (net) => `The ${net} account is not available at the moment.`,
            goBack: 'Go back', seeSpeakers: 'See speakers', seeKeynotes: 'See keynotes',
            addCal: 'Add to my calendar', calOk: 'We downloaded the event (.ics): open it to add it to your calendar.',
            noDay: (q, d) => `No results for “${q}” on ${d}.`,
            noDayF: (d) => `No results with these filters on ${d}.`,
            otherDays: (n) => `We found ${n} ${n === 1 ? 'result' : 'results'} on other days:`,
            goDay: (d) => `See ${d}`,
            noneAll: (q) => `We found nothing for “${q}” in the 3 days. You might like:`,
            suggestions: 'Suggestions for you',
            perDay: { keynote: ['keynote', 'keynotes'], talk: ['talk', 'talks'], workshop: ['workshop', 'workshops'], lightning: ['lightning talks block', 'lightning talks blocks'] },
            activities: (n) => `${n} ${n === 1 ? 'activity' : 'activities'}`
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
        if (parts[0] === 'patrocinadores') return { kind: 'sponsors' };
        if (parts[0] === 'patrocinador' && D.SPONSORS.some((s) => s.id === parts[1])) return { kind: 'sponsor', id: parts[1] };
        if (parts[0] === 'cuenta' && A.SOCIAL_NAMES[parts[2]]) return { kind: 'account', id: parts[1], net: parts[2] };
        if (parts[0] === 'codigo-de-conducta' && parts[1] === 'reporte') return { kind: 'report' };
        if (parts[0] === 'codigo-de-conducta') return { kind: 'coc' };
        if (parts[0] === 'voluntariado') return { kind: 'volunteer' };
        if (parts[0] === 'beca') return { kind: 'grant' };
        if (parts[0] === 'propuesta') return { kind: 'proposal' };
        if (parts[0] === 'mentoria') return { kind: 'mentor' };
        return { kind: 'notfound' };
    }

    const RENDER = { schedule: renderSchedule, mine: renderMine, event: renderEvent, talk: renderTalk, sponsors: renderSponsors, sponsor: renderSponsor, account: renderAccount, coc: renderCoc, report: renderReport, volunteer: renderVolunteer, grant: renderGrant, proposal: renderProposal, mentor: renderMentor, notfound: renderNotFound };
    const NAV_ROUTE = { schedule: 'agenda', mine: 'agenda', event: 'agenda', sponsors: 'patrocinadores', sponsor: 'patrocinadores', coc: 'codigo-de-conducta', report: 'codigo-de-conducta' };

    function route() {
        // los keynotes volvieron a la landing: los enlaces viejos a #/keynotes llevan a su sección
        if (location.hash.startsWith('#/keynotes')) { location.replace('#keynotes'); return; }
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
    // Archivo .ics (Google Calendar, Outlook, Apple Calendar…) con la hora de Bogotá
    const calBtn = (e) => `<button type="button" class="btn btn--outline" data-ics="${e.id}">${icon('cal')}<span>${t().addCal}</span></button>`;
    function downloadIcs(e) {
        const day = D.DAYS[e.day], room = D.ROOMS[e.room];
        const stamp = (hm) => `202807${day.num}T${hm.replace(':', '')}00`;
        const txt = (s) => String(s).replace(/\\/g, '\\\\').replace(/[,;]/g, (m) => '\\' + m).replace(/\n/g, '\\n');
        const who = whoName(e);
        const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//PyCon Colombia//2028//ES', 'CALSCALE:GREGORIAN',
            'BEGIN:VTIMEZONE', 'TZID:America/Bogota', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:-0500', 'TZOFFSETTO:-0500', 'TZNAME:-05', 'END:STANDARD', 'END:VTIMEZONE',
            'BEGIN:VEVENT', `UID:${e.id}@pycon.co`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
            `DTSTART;TZID=America/Bogota:${stamp(e.t)}`, `DTEND;TZID=America/Bogota:${stamp(e.end)}`,
            `SUMMARY:${txt(`PyCon Colombia 2028 · ${pick(e.title)}`)}`,
            `DESCRIPTION:${txt([who, pick(e.desc || '')].filter(Boolean).join(' — '))}`,
            `LOCATION:${txt(room ? `${pick(room.name)}, ${pick(room.building)} · Universidad EAFIT, Medellín` : 'Universidad EAFIT, Medellín')}`,
            'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
        a.download = `pycon-colombia-2028-${e.id}.ics`;
        document.body.append(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }
    view.addEventListener('click', (ev) => {
        const b = ev.target.closest('[data-ics]');
        if (!b) return;
        downloadIcs(D.EVENTS[b.dataset.ics]);
        const note = b.parentElement.querySelector('[data-ics-note]');
        if (note) note.hidden = false;
    });
    const calNote = () => `<p class="muted cal-note" data-ics-note role="status" hidden>${t().calOk}</p>`;

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
    /* --- Búsqueda ---------------------------------------------------------
       Sin distinguir mayúsculas ni tildes ("STUART", "Stuart" y "stuart" dan lo mismo) y en
       ambos idiomas (título, ponente, sala, etiquetas y descripción). Todas las palabras de la
       búsqueda deben aparecer. Si el día elegido no tiene resultados se muestran los de otros
       días; si no hay en ninguno, sugerencias por parecido (tolera errores de tipeo). */
    const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const both = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? Object.values(v).flat().join(' ') : String(v || ''));
    const bothLabel = (map, k) => (k && map[k] ? both(map[k]) : '');
    const DOCS = new Map(D.DAYS.flatMap((d) => d.events).map((e) => {
        const p = person(e.who);
        const text = [both(e.title), p ? both(p.name) + ' ' + both(p.role) : '', both(D.ROOMS[e.room]?.name), bothLabel(D.TRACKS, e.track),
            ...(e.also || []).map((k) => bothLabel(D.TRACKS, k)), bothLabel(D.FORMATS, e.format), bothLabel(D.LEVELS, e.level),
            bothLabel(D.LANGS, e.lang), both(e.desc), both(e.long)].join(' ');
        const doc = norm(text);
        return [e.id, { doc, words: [...new Set(doc.split(/[^a-z0-9+#]+/).filter((w) => w.length > 1))] }];
    }));
    const tokens = (q) => norm(q).split(/\s+/).filter(Boolean);
    const passesFilters = (e) => {
        const f = sched.f;
        if (activeCount() > 0 && e.format === 'break') return false;
        if (f.track.size && !f.track.has(e.track) && !(e.also || []).some((k) => f.track.has(k))) return false;
        if (f.format.size && !f.format.has(e.format)) return false;
        if (f.level.size && !f.level.has(e.level)) return false;
        if (f.lang.size && !f.lang.has(e.lang)) return false;
        if (f.room.size && !f.room.has(e.room)) return false;
        return true;
    };
    const passesQuery = (e) => { const doc = DOCS.get(e.id).doc; return tokens(sched.q).every((w) => doc.includes(w)); };
    const matches = (e) => passesFilters(e) && (!sched.q || passesQuery(e));

    // Parecido entre palabras (distancia de edición) para sugerir aunque haya errores de tipeo
    const editDistance = (a, b) => {
        const row = Array.from({ length: b.length + 1 }, (_, i) => i);
        for (let i = 1; i <= a.length; i++) {
            let prev = row[0]; row[0] = i;
            for (let j = 1; j <= b.length; j++) {
                const tmp = row[j];
                row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
                prev = tmp;
            }
        }
        return row[b.length];
    };
    function suggest(q, limit = 4) {
        const qs = tokens(q).filter((w) => w.length > 1);
        const scored = D.DAYS.flatMap((d) => d.events).filter((e) => e.format !== 'break').map((e) => {
            const { words } = DOCS.get(e.id);
            let score = 0;
            for (const w of qs) {
                let best = 0;
                for (const x of words) {
                    // palabra a medio escribir ("panda" → "pandas")
                    if (w.length >= 3 && x.startsWith(w)) { best = Math.max(best, 0.9); continue; }
                    // errores de tipeo: 1 letra en palabras cortas, 2 en las demás ("pandsa" → "pandas")
                    const tol = w.length <= 4 ? 1 : 2;
                    if (Math.abs(x.length - w.length) <= tol && editDistance(w, x) <= tol) best = Math.max(best, 0.7);
                }
                score += best;
            }
            return { e, score };
        }).filter((s) => s.score > 0).sort((a, b) => b.score - a.score || a.e.day - b.e.day);
        if (scored.length) return scored.slice(0, limit).map((s) => s.e);
        // sin parecido: la charla recomendada y las keynotes de la conferencia
        const keys = D.DAYS.flatMap((d) => d.events).filter((e) => e.format === 'keynote');
        return [D.EVENTS[D.RECOMMENDED], ...keys].slice(0, limit);
    }
    const countsText = (c) => ['keynote', 'talk', 'workshop', 'lightning'].filter((k) => c[k])
        .map((k) => `${c[k]} ${t().perDay[k][c[k] === 1 ? 0 : 1]}`).join(' · ');
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
                        <span>${esc(pick(d.label))}</span><b>${d.num}</b><small>${t().activities(Object.values(D.COUNTS.days[i]).reduce((a, b) => a + b, 0))}</small></a>`).join('')}
                </div>

                <div class="inset schedule" role="tabpanel">
                    <div class="schedule__summary">
                        <div>
                            <h2 data-day-title></h2>
                            <p class="schedule__mix" data-day-mix></p>
                        </div>
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
                    <div class="events__alt" data-alt hidden aria-live="polite"></div>
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
        $('[data-day-mix]', view).textContent = countsText(D.COUNTS.days[d]);
        $('[data-day-count]', view).textContent = shown.length === day.events.length ? t().blocks(day.events.length) : t().results(shown.length, day.events.length);
        $('[data-events]', view).innerHTML = items.map((e) => eventRow(e)).join('');

        // Sin resultados en este día: otros días que sí coinciden, o sugerencias
        const alt = $('[data-alt]', view);
        alt.hidden = shown.length > 0;
        if (!shown.length) {
            const dayName = `${pick(day.label).toLowerCase()} ${day.num}`;
            const others = D.DAYS.flatMap((x) => x.events).filter((e) => e.day !== d && matches(e));
            if (others.length) {
                const days = [...new Set(others.map((e) => e.day))];
                alt.innerHTML = `<p class="events__empty">${esc(sched.q ? t().noDay(sched.q, dayName) : t().noDayF(dayName))} ${t().otherDays(others.length)}</p>
                    <ol class="events">${others.slice(0, 8).map((e) => eventRow(e, { showDay: true })).join('')}</ol>
                    <div class="btn-row">${days.map((i) => `<a class="btn btn--outline btn--sm" href="#/agenda?d=${i}">${esc(t().goDay(`${pick(D.DAYS[i].label).toLowerCase()} ${D.DAYS[i].num}`))}</a>`).join('')}</div>`;
            } else {
                const q = sched.q || '';
                alt.innerHTML = `<p class="events__empty">${q ? esc(t().noneAll(q)) : t().empty}</p>
                    ${q ? `<p class="eyebrow">${t().suggestions}</p><ol class="events">${suggest(q).map((e) => eventRow(e, { showDay: true })).join('')}</ol>` : ''}`;
            }
        }
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
        view.innerHTML = `<div class="view-wrap">
            ${crumbs([['#/agenda', t().backGeneral, 'back', true], ['#/agenda/mi', t().backMine, 'star']])}
            <section class="card card--frame event-page">
                <p class="eyebrow">${esc(pick(day.title))} · ${e.t} – ${e.end}</p>
                <h1 class="title">${esc(pick(e.title))}</h1>
                ${e.format !== 'break' ? `<ul class="tags">${evTags(e).map((x, i) => `<li class="tag ${i === 0 ? 'tag--fill' : ''}">${esc(x)}</li>`).join('')}</ul>` : ''}
                <div class="event-page__grid">
                    <div>
                        ${talkBody(e)}
                        ${p ? `<div class="mini-speaker inset">${A.avatarHTML(p, 'avatar--md')}
                            <div class="mini-speaker__body"><h3>${esc(pick(p.name))}</h3><p class="muted">${esc(pick(p.role))}</p></div>
                            <div class="btn-row"><button class="btn btn--outline btn--sm" type="button" data-open-speaker="${p.id}">${t().viewSpeaker}</button>
                            <a class="btn btn--primary btn--sm" href="#/charla/${p.id}">${t().viewTalk}</a></div></div>` : ''}
                    </div>
                    <aside class="inset event-page__when">
                        ${talkFacts(e)}
                        ${e.format !== 'break' ? starBtn(e, true) + calBtn(e) + calNote() : ''}
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
    // Cuerpo completo de una charla: descripción, lo que aprenderás, estructura y público
    const minutes = (e) => { const [h1, m1] = e.t.split(':').map(Number), [h2, m2] = e.end.split(':').map(Number); return h2 * 60 + m2 - h1 * 60 - m1; };
    function talkBody(e) {
        const desc = e.long ? pick(e.long) : [pick(e.desc || '')];
        return `${desc.filter(Boolean).map((x) => `<p>${esc(x)}</p>`).join('')}
            ${e.learn ? `<h2 class="sub-h">${t().learn}</h2><ul class="checks talk__learn">${pick(e.learn).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
            ${e.agenda ? `<h2 class="sub-h">${t().agenda}</h2><ol class="agenda-list">${pick(e.agenda).map((x) => `<li>${esc(x)}</li>`).join('')}</ol>` : ''}
            ${e.audience ? `<h2 class="sub-h">${t().audience}</h2><p>${esc(pick(e.audience))}</p>` : ''}`;
    }
    // Ficha lateral: cuándo, dónde, duración, formato, nivel e idioma
    function talkFacts(e) {
        const day = D.DAYS[e.day], room = D.ROOMS[e.room] || D.ROOMS.plaza;
        return `<h2 class="sub-h">${t().when}</h2>
            <p>${icon('cal')}<span>${esc(pick(day.label))} ${day.num} · ${e.t} – ${e.end}</span></p>
            <p>${icon('clock')}<span>${t().duration}: ${minutes(e)} min</span></p>
            <p>${icon('pin')}<span>${esc(pick(room.name))} · ${esc(pick(room.building))}</span></p>
            ${e.format !== 'break' ? `<dl class="facts">
                <div><dt>${t().format}</dt><dd>${esc(label(D.FORMATS, e.format))}</dd></div>
                <div><dt>${t().level}</dt><dd>${esc(label(D.LEVELS, e.level))}</dd></div>
                <div><dt>${t().language}</dt><dd>${esc(label(D.LANGS, e.lang))}</dd></div>
                <div><dt>Track</dt><dd>${esc(label(D.TRACKS, e.track))}</dd></div>
            </dl>` : ''}`;
    }

    function renderTalk(r) {
        const p = A.PEOPLE[r.id], e = D.EVENTS[p.talk], isKey = r.id.startsWith('k');
        const back = isKey ? ['#keynotes', t().backKeynotes] : ['#ponentes', t().backSpeakers];
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
                    <div class="talk__desc">${talkBody(e)}</div>
                    <aside class="inset event-page__when">
                        ${talkFacts(e)}
                        ${roomBtn(e)}
                        ${starBtn(e, true)}
                        ${calBtn(e)}
                        ${calNote()}
                    </aside>
                </div>

                <p class="eyebrow talk__speaker-h">${t().speaker}</p>
                <div class="speaker-strip inset">
                    <div class="speaker-strip__photo">${A.avatarHTML(p)}</div>
                    <div class="speaker-strip__body">
                        <h2>${esc(pick(p.name))}</h2>
                        <p class="muted">${esc(pick(p.role))}</p>
                        <p>${esc(pick(p.bio))}</p>
                        <ul class="social">${A.socialHTML(p)}</ul>
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
    /* ---------------------------------------------------------------- */
    /*  Patrocinadores (página propia, mismo contenido que tenía la landing) */
    /* ---------------------------------------------------------------- */
    function renderSponsors() {
        view.innerHTML = `<div class="view-wrap">
            ${crumbs([['#inicio', t().home]])}
            <section class="card card--frame sponsors">
                <h1 class="title title--xl">${t().spoTitle}</h1>
                <p class="sponsors__lead">${t().spoLead}</p>
                <a class="btn btn--primary" href="mailto:sponsors@pycon.co">${t().spoBtn}</a>
                ${D.TIERS.map(([tier, lab]) => {
                    const list = D.SPONSORS.filter((s) => s.tier === tier);
                    return `<h2 class="tier"><span>${esc(pick(lab))}</span></h2>
                        <ul class="logos logos--${tier}">${list.map((s) => `
                            <li><a class="inset sponsor-card" href="#/patrocinador/${s.id}">
                                ${A.logoHTML(s)}<span class="sponsor-card__name">${esc(s.name)}</span>
                                <span class="sponsor-card__more">${t().sponsorOf} ${icon('next')}</span>
                            </a></li>`).join('')}</ul>`;
                }).join('')}
            </section>
        </div>`;
    }

    /* ---------------------------------------------------------------- */
    /*  Red social sin enlace todavía                                     */
    /* ---------------------------------------------------------------- */
    function renderAccount(r) {
        const p = A.PEOPLE[r.id], net = A.SOCIAL_NAMES[r.net];
        const isKey = p && r.id.startsWith('k');
        view.innerHTML = `<div class="view-wrap view-wrap--narrow">
            ${crumbs([[isKey ? '#keynotes' : '#ponentes', t().goBack, 'back', true]])}
            <section class="card card--frame account">
                <div class="account__head">
                    ${p ? `<div class="account__photo">${A.avatarHTML(p)}</div>` : ''}
                    <span class="account__net">${icon(r.net)}</span>
                </div>
                <p class="eyebrow eyebrow--center">${esc(net)}</p>
                <h1 class="title">${t().accTitle}</h1>
                <p class="account__lead">${esc(p ? t().accP(net, pick(p.name)) : t().accPycon(net))}</p>
                <div class="btn-row btn-row--center">
                    <a class="btn btn--primary" href="${isKey ? '#keynotes' : '#ponentes'}" data-back>${icon('back')}<span>${t().goBack}</span></a>
                    <a class="btn btn--outline" href="${isKey ? '#keynotes' : '#ponentes'}">${isKey ? t().seeKeynotes : t().seeSpeakers}</a>
                </div>
            </section>
        </div>`;
        view.querySelector('.crumbs a')?.setAttribute('data-back', '');
    }
    // "Volver": regresa a donde estaba la persona (perfil, keynotes…); si entró directo, al enlace del botón
    view.addEventListener('click', (ev) => {
        const b = ev.target.closest('[data-back]');
        if (b && history.length > 1) { ev.preventDefault(); history.back(); }
    });

    function renderSponsor(r) {
        const s = D.SPONSORS.find((x) => x.id === r.id);
        const tier = pick(D.TIERS.find(([k]) => k === s.tier)[1]);
        const url = s.url || 'https://www.example.com';
        view.innerHTML = `<div class="view-wrap">
            ${crumbs([['#/patrocinadores', t().backSponsors, 'back', true]])}
            <article class="card card--frame sponsor-page">
                <p class="sponsor-page__tier">${esc(tier)}</p>
                <div class="inset sponsor-page__logo">${A.logoHTML(s, true)}</div>
                <h1 class="title title--xl">${esc(s.name)}</h1>
                <p class="eyebrow eyebrow--center">${t().aboutUs}</p>
                <h2 class="title">${t().aboutSponsor}</h2>
                <p class="sponsor-page__lead">${esc(pick(s.about))}</p>
                <div class="btn-row btn-row--center">
                    <a class="btn btn--primary" href="${esc(url)}" target="_blank" rel="noopener">${icon('ext')}<span>${t().visit}</span></a>
                    <a class="btn btn--outline" href="#/patrocinadores">${icon('back')}<span>${t().backSponsors}</span></a>
                </div>
                <p class="sponsor-page__more">${esc(pick(s.more))}</p>
                <p class="eyebrow eyebrow--center">${t().videos}</p>
                <ul class="videos">${[1, 2, 3].map((n) => `<li class="video" style="--brand:${s.color}">
                    <button type="button" aria-label="${t().videos} ${n} · ${esc(s.name)}">${icon('play')}</button></li>`).join('')}</ul>
                <div class="btn-row btn-row--center">
                    <a class="btn btn--primary" href="mailto:sponsors@pycon.co">${t().becomeSponsor}</a>
                    <a class="btn btn--outline" href="#/patrocinadores">${t().backSponsors}</a>
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
                <div>
                ${D.COC[A.lang].map(([h, paras, bullets, after], i) => `<section><h2><span>${String(i + 1).padStart(2, '0')}</span>${esc(h)}</h2>
                    ${paras.map((x) => `<p>${esc(x)}</p>`).join('')}
                    ${bullets ? `<ul class="doc__list">${bullets.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
                    ${(after || []).map((x) => `<p>${esc(x)}</p>`).join('')}</section>`).join('')}
                </div>
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
                    <p class="notice notice--days">${icon('cal')}<span>${t().allDays}</span></p>
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
            ok = setErr(form, 'v-coc', $('#v-coc', form).checked ? '' : t().required) && ok;
            if (!ok) { (form.querySelector('[aria-invalid="true"] input, [aria-invalid="true"]'))?.focus(); return; }
            form.hidden = true;
            const box = $('[data-ok]', view);
            box.hidden = false;
            box.innerHTML = `<p>${esc(t().volOk(name.value.trim().split(' ')[0]))}</p><div class="btn-row"><a class="btn btn--primary" href="#inicio">${t().backHome}</a><a class="btn btn--outline" href="#/agenda">${t().goSchedule}</a></div>`;
            box.tabIndex = -1; box.focus();
        });
    }

    /* ---------------------------------------------------------------- */
    /*  Aplicación a beca (desde la tarjeta "Becas" junto a la boleta)    */
    /* ---------------------------------------------------------------- */
    const MOTIVE_MIN = 80;   // caracteres mínimos para el motivo
    function renderGrant() {
        view.innerHTML = `<div class="view-wrap view-wrap--narrow">
            ${crumbs([['#boletas', t().backTickets, 'back', true]])}
            <section class="card card--frame">
                <p class="eyebrow">${t().grantKicker}</p>
                <h1 class="title">${t().grantTitle}</h1>
                <p class="muted">${t().grantLead}</p>
                <ul class="checks grant__covers">${t().grantCovers.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
                <form class="form" novalidate data-grant>
                    <h2 class="sub-h">${t().personal}</h2>
                    <div class="form__row">
                        ${field('g-name', t().fullName + ' *', 'text', 'required autocomplete="name"')}
                        ${field('g-email', t().email + ' *', 'email', 'required autocomplete="email"')}
                    </div>
                    <div class="form__row">
                        ${field('g-phone', t().phone, 'tel', 'autocomplete="tel"')}
                        ${field('g-city', t().cityCountry + ' *', 'text', 'required autocomplete="address-level2"')}
                    </div>
                    <div class="form__row">
                        <div class="field"><label for="g-occ">${t().occupation} *</label>
                            <select id="g-occ" name="g-occ" required><option value="">${t().choose}</option>${t().occOpts.map((o) => `<option>${esc(o)}</option>`).join('')}</select>
                            <p class="field__err" id="g-occ-err" hidden></p></div>
                        ${field('g-org', t().org)}
                    </div>
                    <h2 class="sub-h">${t().motive}</h2>
                    <div class="field">
                        <label for="g-why">${t().why} *</label>
                        <textarea id="g-why" name="g-why" rows="6" required aria-describedby="g-why-count"></textarea>
                        <p class="field__hint" id="g-why-count">${t().minChars(MOTIVE_MIN, 0)}</p>
                        <p class="field__err" id="g-why-err" hidden></p>
                    </div>
                    <label class="check check--box"><input type="checkbox" id="g-travel"><span>${t().travel}</span></label>
                    <label class="check check--box"><input type="checkbox" id="g-coc"><span>${t().cocAgree.replace(/código de conducta|code of conduct/i, (m) => `<a href="#/codigo-de-conducta" target="_blank">${m}</a>`)}</span></label>
                    <p class="field__err" id="g-coc-err" hidden></p>
                    <div class="btn-row">
                        <button class="btn btn--primary" type="submit">${t().sendGrant}</button>
                        <a class="btn btn--outline" href="#boletas">${t().backTickets}</a>
                    </div>
                </form>
                <div class="inset form-ok" data-ok hidden role="status"></div>
            </section>
        </div>`;
        const form = $('[data-grant]', view), why = $('#g-why', form), count = $('#g-why-count', form);
        why.addEventListener('input', () => { count.textContent = t().minChars(MOTIVE_MIN, why.value.trim().length); });
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = $('#g-name', form), email = $('#g-email', form);
            let ok = setErr(form, 'g-name', name.value.trim() ? '' : t().required);
            ok = setErr(form, 'g-email', !email.value.trim() ? t().required : email.checkValidity() ? '' : t().emailErr) && ok;
            ok = setErr(form, 'g-city', $('#g-city', form).value.trim() ? '' : t().required) && ok;
            ok = setErr(form, 'g-occ', $('#g-occ', form).value ? '' : t().required) && ok;
            const len = why.value.trim().length;
            ok = setErr(form, 'g-why', !len ? t().required : len < MOTIVE_MIN ? t().tooShort(MOTIVE_MIN) : '') && ok;
            ok = setErr(form, 'g-coc', $('#g-coc', form).checked ? '' : t().required) && ok;
            if (!ok) { form.querySelector('[aria-invalid="true"]')?.focus(); return; }
            const ref = 'BEC-' + Math.random().toString(36).slice(2, 7).toUpperCase();
            form.hidden = true;
            const box = $('[data-ok]', view);
            box.hidden = false;
            box.innerHTML = `<p>${esc(t().grantOk(name.value.trim().split(' ')[0], ref))}</p><div class="btn-row"><a class="btn btn--primary" href="#inicio">${t().backHome}</a><a class="btn btn--outline" href="#/agenda">${t().goSchedule}</a></div>`;
            box.tabIndex = -1; box.focus();
        });
    }

    /* ---------------------------------------------------------------- */
    /*  Convocatoria: enviar propuesta y solicitar mentoría               */
    /*  (botones de la tarjeta "Comparte lo que sabes")                   */
    /* ---------------------------------------------------------------- */
    const selectField = (id, lab, opts, req = true) => `<div class="field"><label for="${id}">${esc(lab)}${req ? ' *' : ''}</label>
        <select id="${id}" name="${id}"${req ? ' required' : ''}><option value="">${t().pick}</option>${opts.map(([v, l]) => `<option value="${esc(v)}">${esc(l)}</option>`).join('')}</select>
        <p class="field__err" id="${id}-err" hidden></p></div>`;
    const textareaCount = (id, lab, min, rows = 5) => `<div class="field">
        <label for="${id}">${esc(lab)} *</label>
        <textarea id="${id}" name="${id}" rows="${rows}" required aria-describedby="${id}-count"></textarea>
        <p class="field__hint" id="${id}-count">${t().minChars(min, 0)}</p>
        <p class="field__err" id="${id}-err" hidden></p></div>`;
    const cocCheck = (id) => `<label class="check check--box"><input type="checkbox" id="${id}"><span>${t().cocAgree.replace(/código de conducta|code of conduct/i, (m) => `<a href="#/codigo-de-conducta" target="_blank">${m}</a>`)}</span></label>
        <p class="field__err" id="${id}-err" hidden></p>`;
    const ref = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    // Valida los campos comunes y los textos con mínimo de caracteres; devuelve true si todo está bien
    function validate(form, { required = [], selects = [], counted = [], email, coc }) {
        let ok = true;
        required.forEach((id) => { ok = setErr(form, id, $(`#${id}`, form).value.trim() ? '' : t().required) && ok; });
        if (email) {
            const el = $(`#${email}`, form);
            ok = setErr(form, email, !el.value.trim() ? t().required : el.checkValidity() ? '' : t().emailErr) && ok;
        }
        selects.forEach((id) => { ok = setErr(form, id, $(`#${id}`, form).value ? '' : t().required) && ok; });
        counted.forEach(([id, min]) => { const n = $(`#${id}`, form).value.trim().length; ok = setErr(form, id, !n ? t().required : n < min ? t().tooShort(min) : '') && ok; });
        if (coc) ok = setErr(form, coc, $(`#${coc}`, form).checked ? '' : t().required) && ok;
        if (!ok) form.querySelector('[aria-invalid="true"]')?.focus();
        return ok;
    }
    function liveCounters(form, counted) {
        counted.forEach(([id, min]) => { const el = $(`#${id}`, form), out = $(`#${id}-count`, form); el.addEventListener('input', () => { out.textContent = t().minChars(min, el.value.trim().length); }); });
    }
    function showOk(form, msg) {
        form.hidden = true;
        const box = $('[data-ok]', view);
        box.hidden = false;
        box.innerHTML = `<p>${esc(msg)}</p><div class="btn-row"><a class="btn btn--primary" href="#comunidad">${t().backCfp}</a><a class="btn btn--outline" href="#inicio">${t().backHome}</a></div>`;
        box.tabIndex = -1; box.focus();
    }

    const ABSTRACT_MIN = 150, TOPIC_MIN = 30;
    function renderProposal() {
        const opts = (map) => Object.keys(map).map((k) => [k, label(map, k)]);
        view.innerHTML = `<div class="view-wrap view-wrap--narrow">
            ${crumbs([['#comunidad', t().backCfp, 'back', true]])}
            <section class="card card--frame">
                <p class="eyebrow">${t().propKicker}</p>
                <h1 class="title">${t().propTitle}</h1>
                <p class="muted">${t().propLead}</p>
                <form class="form" novalidate data-proposal>
                    <h2 class="sub-h">${t().aboutYou}</h2>
                    <div class="form__row">
                        ${field('p-name', t().fullName + ' *', 'text', 'required autocomplete="name"')}
                        ${field('p-email', t().email + ' *', 'email', 'required autocomplete="email"')}
                    </div>
                    ${field('p-bio', t().bioQ, 'textarea')}
                    <h2 class="sub-h">${t().aboutTalk}</h2>
                    ${field('p-title', t().talkTitle + ' *', 'text', 'required')}
                    <div class="form__row">
                        ${selectField('p-format', t().formatQ, Object.entries(t().propFormats))}
                        ${selectField('p-track', 'Track', opts(D.TRACKS))}
                    </div>
                    <div class="form__row">
                        ${selectField('p-level', t().level, opts(D.LEVELS))}
                        ${selectField('p-lang', t().language, opts(D.LANGS))}
                    </div>
                    ${textareaCount('p-abstract', t().abstract, ABSTRACT_MIN, 6)}
                    ${field('p-notes', t().notes, 'textarea')}
                    <label class="check check--box"><input type="checkbox" id="p-first"><span>${t().firstTalk}</span></label>
                    <label class="check check--box"><input type="checkbox" id="p-mentor"><span>${t().wantMentor}</span></label>
                    ${cocCheck('p-coc')}
                    <div class="btn-row">
                        <button class="btn btn--primary" type="submit">${t().sendProp}</button>
                        <a class="btn btn--outline" href="#/mentoria">${t().mentTitle}</a>
                    </div>
                </form>
                <div class="inset form-ok" data-ok hidden role="status"></div>
            </section>
        </div>`;
        const form = $('[data-proposal]', view), counted = [['p-abstract', ABSTRACT_MIN]];
        liveCounters(form, counted);
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!validate(form, { required: ['p-name', 'p-title'], email: 'p-email', selects: ['p-format', 'p-track', 'p-level', 'p-lang'], counted, coc: 'p-coc' })) return;
            showOk(form, t().propOk($('#p-name', form).value.trim().split(' ')[0], ref('PROP')));
        });
    }

    function renderMentor() {
        const list = (arr) => arr.map((x) => [x, x]);
        view.innerHTML = `<div class="view-wrap view-wrap--narrow">
            ${crumbs([['#comunidad', t().backCfp, 'back', true]])}
            <section class="card card--frame">
                <p class="eyebrow">${t().mentKicker}</p>
                <h1 class="title">${t().mentTitle}</h1>
                <p class="muted">${t().mentLead}</p>
                <form class="form" novalidate data-mentor>
                    <h2 class="sub-h">${t().aboutYou}</h2>
                    <div class="form__row">
                        ${field('m-name', t().fullName + ' *', 'text', 'required autocomplete="name"')}
                        ${field('m-email', t().email + ' *', 'email', 'required autocomplete="email"')}
                    </div>
                    <div class="form__row">
                        ${field('m-city', t().cityCountry, 'text', 'autocomplete="address-level2"')}
                        ${selectField('m-exp', t().expQ, list(t().expOpts))}
                    </div>
                    <h2 class="sub-h">${t().aboutTalk}</h2>
                    ${selectField('m-help', t().helpQ, list(t().helpOpts))}
                    ${textareaCount('m-topic', t().topicQ, TOPIC_MIN, 4)}
                    ${field('m-avail', t().availQ, 'text', `placeholder="${esc(t().availPh)}"`)}
                    ${field('m-msg', t().msgQ, 'textarea')}
                    ${cocCheck('m-coc')}
                    <div class="btn-row">
                        <button class="btn btn--primary" type="submit">${t().sendMent}</button>
                        <a class="btn btn--outline" href="#/propuesta">${t().sendProp}</a>
                    </div>
                </form>
                <div class="inset form-ok" data-ok hidden role="status"></div>
            </section>
        </div>`;
        const form = $('[data-mentor]', view), counted = [['m-topic', TOPIC_MIN]];
        liveCounters(form, counted);
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!validate(form, { required: ['m-name'], email: 'm-email', selects: ['m-exp', 'm-help'], counted, coc: 'm-coc' })) return;
            showOk(form, t().mentOk($('#m-name', form).value.trim().split(' ')[0], ref('MEN')));
        });
    }

    function renderNotFound() {
        view.innerHTML = `<div class="view-wrap view-wrap--narrow"><section class="card card--frame"><h1 class="title">404</h1>
            <a class="btn btn--primary" href="#inicio">${t().backHome}</a></section></div>`;
    }

    // Arranque: si la página se abre directamente en una ruta interna
    if (location.hash.startsWith('#/')) route();
})();
