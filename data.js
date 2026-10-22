/* =========================================================================
   PyCon Colombia 2028 — Contenido de ejemplo
   Ponentes, charla y patrocinadores basados en el Figma "botones y tarjetas
   pycon". Los textos { es, en } se muestran según el idioma activo.
   ========================================================================= */
window.PYCON = (() => {
    /* ---------------------------------------------------------------- */
    /*  Salas (con la puerta en el mapa del campus)                      */
    /* ---------------------------------------------------------------- */
    const ROOMS = {
        fund: { name: 'Auditorio Fundadores', building: { es: 'Bloque 29 · Piso 1', en: 'Building 29 · Floor 1' }, node: 'fundDoor' },
        selva: { name: { es: 'Sala Selva', en: 'Jungle Room' }, building: { es: 'Bloque 19 · Piso 2', en: 'Building 19 · Floor 2' }, node: 'selvaDoor' },
        rio: { name: { es: 'Sala Río', en: 'River Room' }, building: { es: 'Bloque 27 · Piso 1', en: 'Building 27 · Floor 1' }, node: 'rioDoor' },
        lab: { name: { es: 'Laboratorio 38', en: 'Lab 38' }, building: { es: 'Bloque 38 · Piso 3', en: 'Building 38 · Floor 3' }, node: 'labDoor' },
        plaza: { name: { es: 'Plazoleta de registro', en: 'Registration plaza' }, building: { es: 'Plazoleta central', en: 'Central plaza' }, node: 'reg' }
    };

    /* ---------------------------------------------------------------- */
    /*  Opciones de filtro (las del Figma: track, formato, nivel, idioma) */
    /* ---------------------------------------------------------------- */
    const TRACKS = {
        ai: { es: 'Inteligencia Artificial', en: 'Artificial Intelligence' },
        data: { es: 'Datos', en: 'Data' },
        web: 'Web',
        sec: { es: 'Seguridad', en: 'Security' },
        sci: { es: 'Ciencia', en: 'Science' },
        com: { es: 'Comunidad', en: 'Community' }
    };
    const FORMATS = {
        talk: { es: 'Charla', en: 'Talk' }, workshop: { es: 'Taller', en: 'Workshop' },
        keynote: 'Keynote', lightning: 'Lightning talk'
    };
    const LEVELS = {
        beginner: { es: 'Principiante', en: 'Beginner' },
        intermediate: { es: 'Intermedio', en: 'Intermediate' },
        advanced: { es: 'Avanzado', en: 'Advanced' }
    };
    const LANGS = { es: { es: 'Español', en: 'Spanish' }, en: { es: 'Inglés', en: 'English' } };

    /* ---------------------------------------------------------------- */
    /*  Ponentes (Figma) — el id de la charla enlaza con la agenda        */
    /* ---------------------------------------------------------------- */
    const STUART_DESC = {
        es: [
            '¿Qué pasa si le das a un agente de Python una dirección IP y le pides que encuentre por sí solo las vulnerabilidades del servidor? Eso fue exactamente lo que hice. En esta charla presento a STUART, un agente autónomo de pentesting construido con AG2 (AutoGen) y GPT-4. El agente analiza sistemas objetivo sin intervención humana, siguiendo las primeras etapas de la Cyber Kill Chain: reconocimiento e identificación de vulnerabilidades.',
            'La arquitectura es 100 % Python: un AssistantAgent respaldado por GPT-4 que razona y planifica, y un UserProxyAgent con un ejecutor de código que interactúa directamente con el sistema objetivo, todo orquestado por AG2, el framework open source para construir sistemas multiagente.',
            'La charla incluye una demo en vivo en la que STUART analizará un sistema vulnerable desplegado en Docker. Verás paso a paso cómo el agente escanea puertos, identifica servicios, detecta vulnerabilidades y reporta hallazgos, decidiendo por sí mismo qué hacer en cada paso.'
        ],
        en: [
            'What if you give a Python agent an IP address and ask it to find the server\'s vulnerabilities on its own? That\'s exactly what I did. In this talk I present STUART, an autonomous pentesting agent I built with AG2 (AutoGen) and GPT-4. The agent can analyze target systems without human intervention, following the first stages of the Cyber Kill Chain: reconnaissance and vulnerability identification.',
            'The architecture is 100% Python: an AssistantAgent backed by GPT-4 that reasons and plans, and a UserProxyAgent with a Code Executor that interacts directly with the target system. All orchestrated by AG2, the open-source framework for building multi-agent systems.',
            'The talk includes a live demo where STUART will analyze a vulnerable system deployed in Docker. You\'ll see step by step how the agent scans ports, identifies services, detects vulnerabilities, and reports findings — all autonomously, deciding for itself what to do at each step.'
        ]
    };
    const STUART_AGENDA = {
        es: ['Introducción: ¿puede un LLM encontrar vulnerabilidades por sí solo? (3 min)', 'Cyber Kill Chain: el marco que guía al agente (5 min)', 'Arquitectura de STUART: AG2, agentes y código real (7 min)', 'Demo en vivo: STUART analizando un sistema vulnerable (8 min)', 'Resultados, limitaciones y próximos pasos (5 min)', 'Cierre y preguntas (2 min)'],
        en: ['Introduction: can an LLM find vulnerabilities on its own? (3 min)', 'Cyber Kill Chain: the framework that guides the agent (5 min)', 'STUART architecture: AG2, agents, and real code (7 min)', 'Live demo: STUART analyzing a vulnerable system (8 min)', 'Results, limitations, and next steps (5 min)', 'Closing and Q&A (2 min)']
    };

    const SPEAKERS = [
        { id: 's0', name: 'Andres Calamaro Murillo', hue: 176, role: 'Partner Solution Architect Data and AI @ Microsoft',
          bio: { es: 'Apasionado por los datos, la inteligencia artificial, la educación y las comunidades tecnológicas. Actualmente es Senior Partner Solution Architect en Data & AI, donde apoya a socios y organizaciones en la adopción de soluciones de datos, analítica e inteligencia artificial. También es docente universitario y coordinador del programa de Ingeniería de Software y Datos. Fue ponente en PyCon Colombia 2023 y 2024, y en 2025 en KubeCon.',
                 en: 'Passionate about data, artificial intelligence, education, and tech communities. He currently works as Senior Partner Solution Architect in Data & AI, supporting partners and organizations in adopting data, analytics, and AI solutions. He is also a university instructor and coordinator of the Software and Data Engineering program. Speaker at PyCon Colombia 2023 and 2024, and at KubeCon in 2025.' },
          talk: 'd1-2' },
        { id: 's1', name: 'Elizabeth Williams', hue: 28, role: 'Scientific Instrumentation and Microelectronics Group',
          bio: { es: 'Estudiante de último año de Física en la Universidad de Antioquia y participante de un bootcamp de IA. Le apasiona aplicar Python a la instrumentación científica y la microelectrónica.',
                 en: 'Final-year Physics student at Universidad de Antioquia, currently taking an AI bootcamp. Passionate about applying Python to scientific instrumentation and microelectronics.' },
          talk: 'd2-4' },
        { id: 's2', name: 'Coraline Brown', hue: 330, role: { es: 'Estudiante de Maestría en Estudios Humanísticos', en: 'Master\'s student in Humanistic Studies' },
          bio: { es: 'Vinculada al área de lenguaje de la Escuela de Artes y Humanidades. Comparte cómo las humanidades digitales usan Python para leer y analizar grandes colecciones de textos.',
                 en: 'Linked to the language area of the School of Arts and Humanities. Shares how digital humanities use Python to read and analyze large text collections.' },
          talk: 'd1-5' },
        { id: 's3', name: 'Nicola Wilson', hue: 210, role: { es: 'Asistente de investigación y estudiante de maestría en matemáticas aplicadas', en: 'Research assistant and master\'s student in applied mathematics' },
          bio: { es: 'Con experiencia en procesamiento de lenguaje natural (NLP) e integración de modelos de lenguaje en sistemas reales.',
                 en: 'Experienced in natural language processing (NLP) and integrating language models into real systems.' },
          talk: 'd1-7' },
        { id: 's4', name: 'Angelica Miller', hue: 140, role: 'Data Scientist @ Cuesta Partners',
          bio: { es: 'Ingeniera industrial convertida en científica de datos por amor a los números y la tecnología. Pasó de modelar probabilidades a construir productos de datos.',
                 en: 'Industrial engineer turned data scientist out of love for numbers and technology. She went from modeling probabilities to building data products.' },
          talk: 'd1-3' },
        { id: 's5', name: 'Devdan Patel', hue: 250, role: 'Staff MLE @ DeepThought Solutions',
          bio: { es: 'Astrofísico (Universidad de Florida, 2021). Staff Machine Learning Engineer, lidera el trabajo de IA en producción.',
                 en: 'Astrophysicist (University of Florida, 2021). Staff Machine Learning Engineer leading production AI work.' },
          talk: 'd1-4' },
        { id: 's6', name: 'Laura Montes Rodriguez', hue: 48, role: 'AI Builder & Team Lead @ Nequi',
          bio: { es: 'Lleva un buen tiempo en inteligencia artificial: empezó por el lado de ML y ciencia de datos y evolucionó hasta donde más le emociona, construir productos con IA generativa.',
                 en: 'Has been in AI for a good while: started on the ML and data science side and evolved into what excites her most, building generative AI products.' },
          talk: 'd2-2' },
        { id: 's7', name: 'Hana Khan', hue: 12, role: 'Junior Machine Learning Engineer @ Loka',
          bio: { es: 'ML Engineer en una consultora de machine learning, con proyectos que van desde visión por computador hasta modelos de lenguaje.',
                 en: 'ML Engineer at a machine learning consulting firm, with projects spanning computer vision to language models.' },
          talk: 'd2-3' }
    ];

    // Keynotes: personas ficticias de ejemplo para la maqueta
    const KEYNOTES = [
        { id: 'k0', name: 'Valentina Restrepo', hue: 160, role: { es: 'Ciencia abierta y datos ambientales', en: 'Open science & environmental data' },
          bio: { es: 'Investigadora que usa Python para monitorear la deforestación de la Amazonía con imágenes satelitales y datos abiertos.',
                 en: 'Researcher using Python to monitor Amazon deforestation with satellite imagery and open data.' }, talk: 'd0-1' },
        { id: 'k1', name: 'Tomás Guerrero', hue: 200, role: { es: 'Mantenedor open source', en: 'Open source maintainer' },
          bio: { es: 'Mantiene bibliotecas de Python usadas por miles de proyectos y promueve la sostenibilidad del open source en Latinoamérica.',
                 en: 'Maintains Python libraries used by thousands of projects and advocates for open source sustainability in Latin America.' }, talk: 'd1-1' },
        { id: 'k2', name: 'Ingrid Mejía', hue: 300, role: { es: 'Educación y comunidad', en: 'Education & community' },
          bio: { es: 'Fundadora de programas que han enseñado Python a miles de estudiantes de colegios públicos del país.',
                 en: 'Founder of programs that have taught Python to thousands of public school students across the country.' }, talk: 'd2-1' },
        { id: 'k4', name: 'Mateo Arango', hue: 100, role: { es: 'Ingeniero de software en salud pública', en: 'Software engineer in public health' },
          bio: { es: 'Construye con Python los sistemas de alertas tempranas que usan hospitales de la región para anticipar brotes de enfermedades tropicales.',
                 en: 'Builds with Python the early-warning systems that hospitals in the region use to anticipate tropical disease outbreaks.' }, talk: 'd1-9' },
        { id: 'k3', name: { es: 'Por anunciar', en: 'To be announced' }, hue: 40, tba: true, role: { es: 'Core developer de CPython', en: 'CPython core developer' },
          bio: { es: 'Muy pronto revelaremos a nuestra keynote de cierre. ¡Síguenos en redes para enterarte primero!',
                 en: 'We will reveal our closing keynote very soon. Follow us on social media to be the first to know!' }, talk: 'd2-7' }
    ];

    // Fotos (assets/people/<id>.jpg; la keynote por anunciar usa una silueta) y redes sociales.
    // Las redes aún no tienen enlaces: mientras social[red] esté vacío, el botón lleva a la página
    // "cuenta no habilitada". Para activar una, p. ej.: social: { ig: 'https://instagram.com/usuario' }
    [...SPEAKERS, ...KEYNOTES].forEach((p) => {
        p.photo = p.tba ? 'assets/people/tba.svg' : `assets/people/${p.id}.jpg`;
        p.social = p.social || {};
    });

    /* ---------------------------------------------------------------- */
    /*  Agenda                                                           */
    /* ---------------------------------------------------------------- */
    // ev(hora inicio, fin, título, ponente, sala, track, formato, nivel, idioma, descripción)
    const ev = (t, end, title, who, room, track, format, level, lang, desc) => ({ t, end, title, who, room, track, format, level, lang, desc });
    const BR = (t, end, title, room = '') => ({ t, end, title, room, format: 'break' });

    const DAYS = [
        { label: { es: 'Viernes', en: 'Friday' }, num: 14,
          title: { es: 'Día 1 · Viernes 14 de julio', en: 'Day 1 · Friday, July 14th' },
          events: [
            BR('07:30', '08:30', { es: 'Registro y bienvenida', en: 'Registration & welcome' }, 'plaza'),
            ev('08:30', '09:30', { es: 'Keynote: Python para cuidar la Amazonía', en: 'Keynote: Python to protect the Amazon' }, 'k0', 'fund', 'sci', 'keynote', 'beginner', 'es',
               { es: 'Cómo los datos abiertos, las imágenes satelitales y un puñado de scripts de Python ayudan a detectar la deforestación casi en tiempo real.', en: 'How open data, satellite imagery and a handful of Python scripts help detect deforestation in near real time.' }),
            ev('10:00', '12:00', { es: 'Taller: Python desde cero', en: 'Workshop: Python from scratch' }, '', 'lab', 'com', 'workshop', 'beginner', 'es',
               { es: 'Tu primer programa, variables, listas y funciones, con acompañamiento de PyLadies Medellín. Trae tu portátil.', en: 'Your first program, variables, lists and functions, guided by PyLadies Medellín. Bring your laptop.' }),
            ev('10:00', '12:00', { es: 'Taller: Data science con pandas', en: 'Workshop: Data science with pandas' }, 's4', 'selva', 'data', 'workshop', 'beginner', 'es',
               { es: 'Limpieza, agrupación y visualización de datos reales con pandas y matplotlib.', en: 'Cleaning, grouping and visualizing real data with pandas and matplotlib.' }),
            ev('10:00', '12:00', { es: 'Taller: tu primera app con Django', en: 'Workshop: your first Django app' }, '', 'rio', 'web', 'workshop', 'beginner', 'en',
               { es: 'Construye y publica una app web paso a paso con el equipo de Django Girls.', en: 'Build and deploy a web app step by step with the Django Girls team.' }),
            BR('12:30', '14:00', { es: 'Almuerzo', en: 'Lunch' }, 'plaza'),
            ev('14:00', '16:00', { es: 'Taller: FastAPI + MLOps', en: 'Workshop: FastAPI + MLOps' }, 's5', 'selva', 'ai', 'workshop', 'advanced', 'en',
               { es: 'Empaqueta un modelo, sírvelo con FastAPI y monitorea su comportamiento en producción.', en: 'Package a model, serve it with FastAPI and monitor it in production.' }),
            ev('14:00', '16:00', { es: 'Taller: MicroPython y hardware', en: 'Workshop: MicroPython & hardware' }, 's1', 'lab', 'sci', 'workshop', 'intermediate', 'es',
               { es: 'Sensores, microcontroladores y un poco de física, todo programado con MicroPython.', en: 'Sensors, microcontrollers and a bit of physics, all programmed with MicroPython.' }),
            BR('16:00', '16:30', { es: 'Refrigerio', en: 'Snack break' }, 'plaza'),
            ev('16:30', '18:00', { es: 'Taller: testing con pytest', en: 'Workshop: testing with pytest' }, '', 'rio', 'web', 'workshop', 'intermediate', 'es',
               { es: 'Fixtures, parametrización y mocks para que tu código no te despierte a medianoche.', en: 'Fixtures, parametrization and mocks so your code never wakes you up at midnight.' })
          ] },
        { label: { es: 'Sábado', en: 'Saturday' }, num: 15,
          title: { es: 'Día 2 · Sábado 15 de julio', en: 'Day 2 · Saturday, July 15th' },
          events: [
            BR('08:00', '09:00', { es: 'Registro y bienvenida', en: 'Registration & welcome' }, 'plaza'),
            ev('09:00', '10:00', { es: 'Keynote: el open source que sostiene al mundo', en: 'Keynote: the open source that holds the world up' }, 'k1', 'fund', 'com', 'keynote', 'beginner', 'es',
               { es: 'Lo que nadie ve detrás de las bibliotecas que usamos todos los días, y cómo cuidarlas entre todos.', en: 'What nobody sees behind the libraries we use every day, and how to take care of them together.' }),
            ev('10:15', '10:45', 'STUART: An Autonomous Hacker Agent Built in Python', 's0', 'fund', 'sec', 'talk', 'intermediate', 'es', { es: STUART_DESC.es.join(' '), en: STUART_DESC.en.join(' ') }),
            ev('10:15', '10:45', { es: 'De Excel a pandas: una migración sin miedo', en: 'From Excel to pandas: a fearless migration' }, 's4', 'selva', 'data', 'talk', 'beginner', 'es',
               { es: 'Casos reales de equipos que pasaron de hojas de cálculo gigantes a notebooks reproducibles.', en: 'Real cases of teams that moved from giant spreadsheets to reproducible notebooks.' }),
            ev('10:15', '10:45', { es: 'MLOps sin dolor con FastAPI', en: 'Painless MLOps with FastAPI' }, 's5', 'rio', 'ai', 'talk', 'advanced', 'en',
               { es: 'Patrones para llevar modelos a producción sin perder la cabeza (ni el presupuesto).', en: 'Patterns to take models to production without losing your mind (or your budget).' }),
            ev('11:30', '12:00', { es: 'Humanidades digitales: leer literatura con NLP', en: 'Digital humanities: reading literature with NLP' }, 's2', 'selva', 'ai', 'talk', 'beginner', 'es',
               { es: 'Qué pueden aprender las humanidades de spaCy y qué puede aprender el NLP de la literatura.', en: 'What the humanities can learn from spaCy, and what NLP can learn from literature.' }),
            BR('12:30', '14:00', { es: 'Almuerzo', en: 'Lunch' }, 'plaza'),
            ev('14:00', '14:30', { es: 'Matemáticas detrás de los embeddings', en: 'The math behind embeddings' }, 's3', 'fund', 'ai', 'talk', 'advanced', 'en',
               { es: 'Vectores, similitud del coseno y por qué tu buscador semántico a veces se equivoca.', en: 'Vectors, cosine similarity and why your semantic search sometimes gets it wrong.' }),
            ev('15:00', '15:30', { es: 'Secretos fuera del código', en: 'Keeping secrets out of code' }, 's7', 'rio', 'sec', 'talk', 'beginner', 'es',
               { es: 'Variables de entorno, gestores de secretos y cómo evitar subir tu API key a GitHub.', en: 'Environment variables, secret managers and how to avoid pushing your API key to GitHub.' }),
            ev('15:45', '16:30', { es: 'Keynote: Python contra el dengue', en: 'Keynote: Python against dengue' }, 'k4', 'fund', 'sci', 'keynote', 'beginner', 'es',
               { es: 'Cómo datos de clima, movilidad y reportes hospitalarios se combinan en Python para anticipar brotes semanas antes.', en: 'How climate, mobility and hospital data come together in Python to anticipate outbreaks weeks in advance.' }),
            BR('16:30', '17:00', { es: 'Refrigerio', en: 'Snack break' }, 'plaza'),
            ev('17:00', '18:00', 'Lightning talks', '', 'fund', 'com', 'lightning', 'beginner', 'es',
               { es: '5 minutos, cualquier tema, mucha energía. Inscríbete en el registro.', en: '5 minutes, any topic, lots of energy. Sign up at registration.' }),
            BR('19:00', '22:00', { es: 'Fiesta de la comunidad', en: 'Community party' }, 'plaza')
          ] },
        { label: { es: 'Domingo', en: 'Sunday' }, num: 16,
          title: { es: 'Día 3 · Domingo 16 de julio', en: 'Day 3 · Sunday, July 16th' },
          events: [
            BR('08:30', '09:00', { es: 'Registro y bienvenida', en: 'Registration & welcome' }, 'plaza'),
            ev('09:00', '10:00', { es: 'Keynote: enseñar Python en el colegio público', en: 'Keynote: teaching Python in public schools' }, 'k2', 'fund', 'com', 'keynote', 'beginner', 'es',
               { es: 'Lo que aprendimos enseñando a programar a miles de estudiantes, y lo que aún nos falta.', en: 'What we learned teaching thousands of students to code, and what is still missing.' }),
            ev('10:15', '10:45', { es: 'Agentes de IA en una fintech: lo que aprendimos', en: 'AI agents in a fintech: what we learned' }, 's6', 'fund', 'ai', 'talk', 'intermediate', 'es',
               { es: 'Errores, aciertos y métricas al poner agentes de IA frente a millones de usuarios.', en: 'Mistakes, wins and metrics from putting AI agents in front of millions of users.' }),
            ev('10:15', '10:45', { es: 'Mi primer año como ML Engineer', en: 'My first year as an ML Engineer' }, 's7', 'selva', 'com', 'talk', 'beginner', 'en',
               { es: 'Una mirada honesta al salto de la universidad a la industria.', en: 'An honest look at the jump from university to industry.' }),
            ev('11:30', '12:00', { es: 'Python en el laboratorio de física', en: 'Python in the physics lab' }, 's1', 'rio', 'sci', 'talk', 'intermediate', 'es',
               { es: 'Adquisición de datos, análisis y visualización para experimentos de microelectrónica.', en: 'Data acquisition, analysis and visualization for microelectronics experiments.' }),
            BR('12:30', '14:00', { es: 'Almuerzo', en: 'Lunch' }, 'plaza'),
            ev('14:00', '16:00', 'Open spaces & sprints', '', 'lab', 'com', 'workshop', 'intermediate', 'en',
               { es: 'Contribuye a proyectos open source junto a sus mantenedores.', en: 'Contribute to open source projects alongside their maintainers.' }),
            ev('16:30', '17:30', { es: 'Keynote de cierre', en: 'Closing keynote' }, 'k3', 'fund', 'com', 'keynote', 'beginner', 'en',
               { es: 'La keynote de cierre se anunciará muy pronto.', en: 'The closing keynote will be announced very soon.' }),
            BR('17:30', '18:00', { es: 'Foto grupal y despedida', en: 'Group photo & farewell' }, 'plaza')
          ] }
    ];
    // id estable de cada evento: d{día}-{posición}
    DAYS.forEach((d, di) => d.events.forEach((e, i) => { e.id = `d${di}-${i}`; e.day = di; }));
    const EVENTS = Object.fromEntries(DAYS.flatMap((d) => d.events.map((e) => [e.id, e])));
    // La charla STUART lleva la descripción larga y la agenda del Figma
    EVENTS['d1-2'].long = STUART_DESC;
    EVENTS['d1-2'].agenda = STUART_AGENDA;
    EVENTS['d1-2'].also = ['ai']; // etiquetas del Figma: Inteligencia Artificial + Seguridad

    /* ---------------------------------------------------------------- */
    /*  Información completa de cada charla de ponentes y keynotes:      */
    /*  long = descripción (párrafos) · learn = lo que aprenderás ·       */
    /*  agenda = estructura de la sesión · audience = para quién es       */
    /* ---------------------------------------------------------------- */
    const TALK_INFO = {
        'd1-2': {
            learn: { es: ['Cómo se orquesta un sistema multiagente con AG2 (AutoGen)', 'Qué etapas de la Cyber Kill Chain puede automatizar un LLM y cuáles no', 'Cómo poner límites seguros a un agente que ejecuta código real'],
                     en: ['How to orchestrate a multi-agent system with AG2 (AutoGen)', 'Which Cyber Kill Chain stages an LLM can automate and which it cannot', 'How to set safe limits for an agent that runs real code'] },
            audience: { es: 'Personas con bases de Python y curiosidad por la ciberseguridad o los agentes de IA. No necesitas experiencia previa en pentesting.', en: 'People with Python basics and curiosity about cybersecurity or AI agents. No previous pentesting experience needed.' }
        },
        'd0-1': {
            long: { es: ['La Amazonía pierde cada año miles de hectáreas de bosque. Detectar la deforestación a tiempo depende de datos que ya existen —imágenes satelitales abiertas, reportes de campo, registros climáticos— y de herramientas que cualquiera puede usar.', 'En esta keynote de apertura Valentina muestra cómo un equipo pequeño, con Python, rasterio, xarray y un poco de aprendizaje automático, construyó un sistema de alertas que hoy usan comunidades indígenas y autoridades ambientales. Habla de los aciertos, de los errores y de por qué la ciencia abierta es la mejor herramienta para cuidar la selva.'],
                    en: ['The Amazon loses thousands of hectares of forest every year. Detecting deforestation in time depends on data that already exists —open satellite imagery, field reports, climate records— and on tools anyone can use.', 'In this opening keynote Valentina shows how a small team, with Python, rasterio, xarray and a bit of machine learning, built an alert system now used by Indigenous communities and environmental authorities. She talks about what worked, what failed and why open science is the best tool to protect the rainforest.'] },
            learn: { es: ['Qué datos satelitales abiertos existen y cómo leerlos con Python', 'Cómo pasar de un notebook a un sistema de alertas que funciona cada semana', 'Por qué publicar datos y código multiplica el impacto de un proyecto'],
                     en: ['Which open satellite datasets exist and how to read them with Python', 'How to go from a notebook to an alert system that runs every week', 'Why publishing data and code multiplies a project\'s impact'] },
            agenda: { es: ['La selva vista desde el espacio (10 min)', 'Del píxel a la alerta: el flujo de datos en Python (20 min)', 'Lo que aprendimos trabajando con comunidades (15 min)', 'Ciencia abierta: cómo sumarte (10 min)', 'Preguntas (5 min)'],
                      en: ['The rainforest seen from space (10 min)', 'From pixel to alert: the data pipeline in Python (20 min)', 'What we learned working with communities (15 min)', 'Open science: how to join (10 min)', 'Q&A (5 min)'] },
            audience: { es: 'Para todo público. Ideal si te interesan los datos, la ciencia o el medio ambiente.', en: 'For everyone. Ideal if you care about data, science or the environment.' }
        },
        'd1-1': {
            long: { es: ['Casi todo el software que usamos depende de bibliotecas de código abierto mantenidas por muy pocas personas, muchas veces en su tiempo libre. Cuando una de ellas se cansa, todo el ecosistema lo siente.', 'Tomás lleva más de diez años manteniendo paquetes de Python descargados millones de veces al mes. En esta keynote cuenta cómo se ve el open source desde adentro —issues, releases, financiación, agotamiento— y propone formas concretas en las que empresas, comunidades y personas pueden cuidar las herramientas de las que dependen.'],
                    en: ['Almost all the software we use depends on open source libraries maintained by very few people, often in their spare time. When one of them burns out, the whole ecosystem feels it.', 'Tomás has spent over ten years maintaining Python packages downloaded millions of times a month. In this keynote he shows open source from the inside —issues, releases, funding, burnout— and proposes concrete ways companies, communities and individuals can take care of the tools they depend on.'] },
            learn: { es: ['Cómo funciona por dentro un proyecto open source popular', 'Formas de contribuir más allá del código: documentación, triage, financiación', 'Cómo evaluar la salud de las dependencias de tu proyecto'],
                     en: ['How a popular open source project works on the inside', 'Ways to contribute beyond code: docs, triage, funding', 'How to assess the health of your project\'s dependencies'] },
            agenda: { es: ['La pirámide invisible del software (10 min)', 'Un año en la vida de un mantenedor (20 min)', 'Sostenibilidad: lo que funciona en Latinoamérica (15 min)', 'Tu primer aporte esta semana (10 min)', 'Preguntas (5 min)'],
                      en: ['The invisible pyramid of software (10 min)', 'A year in the life of a maintainer (20 min)', 'Sustainability: what works in Latin America (15 min)', 'Your first contribution this week (10 min)', 'Q&A (5 min)'] },
            audience: { es: 'Para todo público: desde quien nunca ha contribuido hasta equipos que dependen de open source.', en: 'For everyone: from people who have never contributed to teams that depend on open source.' }
        },
        'd1-9': {
            long: { es: ['El dengue reaparece cada año en las ciudades tropicales y los hospitales suelen enterarse cuando el brote ya empezó. ¿Y si pudiéramos verlo venir con semanas de anticipación?', 'Mateo presenta el sistema de alertas tempranas que construyó con Python para hospitales de la región: combina datos de clima, movilidad y reportes clínicos, entrena modelos interpretables y entrega pronósticos semanales que los equipos de salud pueden entender y usar para tomar decisiones.'],
                    en: ['Dengue comes back every year in tropical cities, and hospitals usually find out once the outbreak has already started. What if we could see it coming weeks in advance?', 'Mateo presents the early-warning system he built with Python for hospitals in the region: it combines climate, mobility and clinical reports, trains interpretable models and delivers weekly forecasts that health teams can understand and act on.'] },
            learn: { es: ['Cómo unir fuentes de datos públicas y clínicas sin perder la privacidad', 'Por qué un modelo interpretable puede valer más que uno más preciso', 'Cómo comunicar incertidumbre a personas que toman decisiones'],
                     en: ['How to combine public and clinical data without losing privacy', 'Why an interpretable model can be worth more than a more accurate one', 'How to communicate uncertainty to decision makers'] },
            agenda: { es: ['Un brote que pudimos anticipar (5 min)', 'Los datos: clima, movilidad y hospitales (10 min)', 'Modelos que el equipo médico entiende (15 min)', 'Del pronóstico a la acción (10 min)', 'Preguntas (5 min)'],
                      en: ['An outbreak we could anticipate (5 min)', 'The data: climate, mobility and hospitals (10 min)', 'Models the medical team understands (15 min)', 'From forecast to action (10 min)', 'Q&A (5 min)'] },
            audience: { es: 'Para todo público. Especialmente útil si trabajas con datos en salud o en el sector público.', en: 'For everyone. Especially useful if you work with data in health or the public sector.' }
        },
        'd2-1': {
            long: { es: ['Enseñar a programar en un colegio público implica salones con pocos computadores, conexión intermitente y docentes que nunca han programado. Aun así, miles de estudiantes ya escriben su primer programa en Python.', 'Ingrid cuenta cómo nació el programa que fundó, qué materiales funcionaron, cómo se formó a docentes de todo el país y qué pasa con los estudiantes años después. También señala lo que todavía falta y cómo la comunidad Python puede ayudar.'],
                    en: ['Teaching programming in a public school means classrooms with few computers, unreliable internet and teachers who have never coded. Even so, thousands of students are already writing their first Python program.', 'Ingrid tells how the program she founded began, which materials worked, how teachers across the country were trained and what happens to students years later. She also points out what is still missing and how the Python community can help.'] },
            learn: { es: ['Estrategias para enseñar programación con pocos recursos', 'Cómo acompañar a docentes que aprenden a programar', 'Formas concretas de hacer voluntariado educativo'],
                     en: ['Strategies to teach programming with few resources', 'How to support teachers who are learning to code', 'Concrete ways to volunteer in education'] },
            agenda: { es: ['Un salón, veinte estudiantes y tres computadores (10 min)', 'El método: proyectos pequeños y cercanos (15 min)', 'Formar a quienes forman (15 min)', 'Resultados y lo que falta (15 min)', 'Preguntas (5 min)'],
                      en: ['One classroom, twenty students and three computers (10 min)', 'The method: small, relatable projects (15 min)', 'Training the trainers (15 min)', 'Results and what is still missing (15 min)', 'Q&A (5 min)'] },
            audience: { es: 'Para todo público, en especial docentes, estudiantes y quienes quieran enseñar.', en: 'For everyone, especially teachers, students and anyone who wants to teach.' }
        },
        'd2-7': {
            long: { es: ['La keynote de cierre estará a cargo de una persona del equipo de core developers de CPython. Hablará del presente y el futuro del lenguaje: lo que llega en las próximas versiones y cómo se toman las decisiones que nos afectan a todos.', 'Muy pronto revelaremos su nombre. Mientras tanto, guarda la sesión en tu agenda: es el cierre oficial de PyCon Colombia 2028, seguido de la foto grupal.'],
                    en: ['The closing keynote will be given by a member of the CPython core developer team. They will talk about the present and future of the language: what is coming in the next releases and how the decisions that affect us all are made.', 'We will reveal their name very soon. Meanwhile, save the session to your schedule: it is the official closing of PyCon Colombia 2028, followed by the group photo.'] },
            learn: { es: ['Qué novedades trae Python en sus próximas versiones', 'Cómo se proponen y aprueban los cambios del lenguaje (PEPs)', 'Cómo participar en el desarrollo de CPython'],
                     en: ['What is new in the upcoming Python releases', 'How language changes are proposed and approved (PEPs)', 'How to take part in CPython development'] },
            agenda: { es: ['Python hoy (15 min)', 'Lo que viene (20 min)', 'Cómo se decide el futuro del lenguaje (15 min)', 'Cierre de la conferencia y foto grupal (10 min)'],
                      en: ['Python today (15 min)', 'What is coming (20 min)', 'How the future of the language is decided (15 min)', 'Conference closing and group photo (10 min)'] },
            audience: { es: 'Para todo público.', en: 'For everyone.' }
        },
        'd1-3': {
            long: { es: ['Muchos equipos todavía viven en hojas de cálculo gigantes: archivos que nadie se atreve a tocar, fórmulas que se rompen y reportes que se rehacen a mano cada mes.', 'Angelica comparte casos reales de equipos que migraron a pandas y notebooks reproducibles: cómo empezar sin frenar el trabajo diario, qué tareas automatizar primero y cómo convencer a quienes aman Excel.'],
                    en: ['Many teams still live in giant spreadsheets: files nobody dares to touch, formulas that break and reports rebuilt by hand every month.', 'Angelica shares real cases of teams that moved to pandas and reproducible notebooks: how to start without stopping daily work, which tasks to automate first and how to win over Excel lovers.'] },
            learn: { es: ['Equivalencias entre funciones de Excel y operaciones de pandas', 'Cómo convertir un reporte manual en un notebook reproducible', 'Cómo planear una migración por etapas'],
                     en: ['Equivalences between Excel functions and pandas operations', 'How to turn a manual report into a reproducible notebook', 'How to plan a staged migration'] },
            agenda: { es: ['El costo oculto de la hoja de cálculo (5 min)', 'De BUSCARV a merge: equivalencias clave (10 min)', 'Caso real: un reporte mensual automatizado (10 min)', 'Preguntas (5 min)'],
                      en: ['The hidden cost of spreadsheets (5 min)', 'From VLOOKUP to merge: key equivalences (10 min)', 'Real case: an automated monthly report (10 min)', 'Q&A (5 min)'] },
            audience: { es: 'Principiantes en Python que usan Excel en su trabajo o estudio.', en: 'Python beginners who use Excel at work or school.' }
        },
        'd1-4': {
            long: { es: ['Entrenar un modelo es solo el comienzo: llevarlo a producción, versionarlo y vigilar que siga funcionando es donde la mayoría de proyectos se complica.', 'Devdan presenta patrones probados para servir modelos con FastAPI, empaquetarlos con Docker y monitorear su comportamiento en producción, con ejemplos de su trabajo liderando IA en producción.'],
                    en: ['Training a model is only the beginning: taking it to production, versioning it and making sure it keeps working is where most projects get complicated.', 'Devdan presents proven patterns to serve models with FastAPI, package them with Docker and monitor their behavior in production, with examples from leading production AI work.'] },
            learn: { es: ['Una estructura de proyecto para servir modelos con FastAPI', 'Cómo versionar modelos y datos', 'Qué métricas vigilar cuando el modelo ya está en producción'],
                     en: ['A project structure for serving models with FastAPI', 'How to version models and data', 'Which metrics to watch once the model is in production'] },
            agenda: { es: ['Por qué fallan los modelos en producción (5 min)', 'Servir y empaquetar: FastAPI + Docker (10 min)', 'Monitoreo y alertas (10 min)', 'Preguntas (5 min)'],
                      en: ['Why models fail in production (5 min)', 'Serving and packaging: FastAPI + Docker (10 min)', 'Monitoring and alerts (10 min)', 'Q&A (5 min)'] },
            audience: { es: 'Personas que ya entrenan modelos y quieren llevarlos a producción.', en: 'People who already train models and want to take them to production.' }
        },
        'd1-5': {
            long: { es: ['¿Qué tienen en común una novela del siglo XIX y un modelo de lenguaje? Más de lo que parece. Las humanidades digitales usan Python para leer colecciones de textos que ninguna persona alcanzaría a leer sola.', 'Coraline muestra cómo usa spaCy y otras herramientas de NLP para estudiar temas, personajes y estilos en la literatura latinoamericana, y qué preguntas nuevas aparecen cuando se combinan la lectura cercana y la lectura a distancia.'],
                    en: ['What do a 19th-century novel and a language model have in common? More than it seems. Digital humanities use Python to read text collections no person could read alone.', 'Coraline shows how she uses spaCy and other NLP tools to study themes, characters and styles in Latin American literature, and which new questions appear when close reading and distant reading meet.'] },
            learn: { es: ['Cómo preparar un corpus de textos literarios', 'Análisis básico con spaCy: entidades, frecuencias y estilo', 'Límites del NLP cuando se trata de interpretar literatura'],
                     en: ['How to prepare a corpus of literary texts', 'Basic analysis with spaCy: entities, frequencies and style', 'NLP limits when it comes to interpreting literature'] },
            agenda: { es: ['Leer de cerca, leer de lejos (5 min)', 'Del libro al corpus (10 min)', 'Lo que spaCy encontró (10 min)', 'Preguntas (5 min)'],
                      en: ['Close reading, distant reading (5 min)', 'From book to corpus (10 min)', 'What spaCy found (10 min)', 'Q&A (5 min)'] },
            audience: { es: 'Principiantes en Python, estudiantes de humanidades y curiosos del NLP.', en: 'Python beginners, humanities students and NLP-curious people.' }
        },
        'd1-7': {
            long: { es: ['Los buscadores semánticos y los asistentes con IA dependen de los embeddings: vectores que representan el significado de un texto. Pero ¿qué significa realmente que dos frases estén "cerca"?', 'Nicola explica, con ejemplos en NumPy, la matemática detrás de los embeddings —espacios vectoriales, similitud del coseno, normalización— y por qué a veces tu buscador devuelve resultados que no tienen sentido.'],
                    en: ['Semantic search engines and AI assistants depend on embeddings: vectors that represent the meaning of a text. But what does it really mean for two sentences to be "close"?', 'Nicola explains, with NumPy examples, the math behind embeddings —vector spaces, cosine similarity, normalization— and why your search engine sometimes returns results that make no sense.'] },
            learn: { es: ['Qué representa un embedding y cómo se compara con otro', 'Similitud del coseno vs. distancia euclidiana', 'Errores comunes en búsqueda semántica y cómo detectarlos'],
                     en: ['What an embedding represents and how to compare two of them', 'Cosine similarity vs. Euclidean distance', 'Common semantic search mistakes and how to spot them'] },
            agenda: { es: ['Del texto al vector (5 min)', 'Geometría del significado (10 min)', 'Cuando la búsqueda se equivoca (10 min)', 'Preguntas (5 min)'],
                      en: ['From text to vector (5 min)', 'The geometry of meaning (10 min)', 'When search gets it wrong (10 min)', 'Q&A (5 min)'] },
            audience: { es: 'Nivel avanzado: ayuda tener bases de álgebra lineal y haber usado modelos de lenguaje.', en: 'Advanced level: some linear algebra and experience with language models help.' }
        },
        'd1-8': {
            long: { es: ['Una API key subida por accidente a GitHub puede costar miles de dólares en minutos. Es uno de los errores de seguridad más comunes, y también uno de los más fáciles de evitar.', 'Hana muestra buenas prácticas para manejar secretos en proyectos de Python: variables de entorno, archivos .env, gestores de secretos y herramientas que revisan tu repositorio antes de que sea tarde.'],
                    en: ['An API key accidentally pushed to GitHub can cost thousands of dollars in minutes. It is one of the most common security mistakes, and one of the easiest to avoid.', 'Hana shows good practices to handle secrets in Python projects: environment variables, .env files, secret managers and tools that scan your repository before it is too late.'] },
            learn: { es: ['Cómo leer configuración y secretos desde el entorno', 'Qué hacer si ya subiste un secreto', 'Herramientas para revisar el repositorio automáticamente'],
                     en: ['How to read configuration and secrets from the environment', 'What to do if you already pushed a secret', 'Tools to scan your repository automatically'] },
            agenda: { es: ['Historias de terror reales (5 min)', 'Variables de entorno y .env (10 min)', 'Gestores de secretos y escaneo (10 min)', 'Preguntas (5 min)'],
                      en: ['Real horror stories (5 min)', 'Environment variables and .env (10 min)', 'Secret managers and scanning (10 min)', 'Q&A (5 min)'] },
            audience: { es: 'Principiantes que ya suben código a GitHub.', en: 'Beginners who already push code to GitHub.' }
        },
        'd2-2': {
            long: { es: ['Poner un agente de IA frente a millones de usuarios de una fintech no es lo mismo que hacer una demo. Cada respuesta cuenta, y un error puede afectar el dinero de alguien.', 'Laura comparte lo que aprendió su equipo construyendo agentes con IA generativa: cómo diseñar las herramientas que el agente puede usar, cómo evaluarlo antes de salir a producción y qué métricas mirar cuando ya está atendiendo usuarios.'],
                    en: ['Putting an AI agent in front of millions of fintech users is not the same as building a demo. Every answer counts, and a mistake can affect someone\'s money.', 'Laura shares what her team learned building generative AI agents: how to design the tools the agent can use, how to evaluate it before production and which metrics to watch once it is serving users.'] },
            learn: { es: ['Cómo diseñar herramientas seguras para un agente', 'Estrategias de evaluación antes y después de producción', 'Qué errores evitar al lanzar IA generativa a gran escala'],
                     en: ['How to design safe tools for an agent', 'Evaluation strategies before and after production', 'Which mistakes to avoid when launching generative AI at scale'] },
            agenda: { es: ['De la demo a millones de usuarios (5 min)', 'Arquitectura del agente (10 min)', 'Evaluación y métricas (10 min)', 'Preguntas (5 min)'],
                      en: ['From demo to millions of users (5 min)', 'Agent architecture (10 min)', 'Evaluation and metrics (10 min)', 'Q&A (5 min)'] },
            audience: { es: 'Nivel intermedio: personas que ya han usado modelos de lenguaje en algún proyecto.', en: 'Intermediate level: people who have already used language models in a project.' }
        },
        'd2-3': {
            long: { es: ['El salto de la universidad a la industria está lleno de sorpresas: el código ya no vive en un notebook, los datos nunca están limpios y nadie te dice qué modelo usar.', 'Hana cuenta con honestidad su primer año como ML Engineer en una consultora: los proyectos, los errores, lo que la universidad no le enseñó y los hábitos que más le han servido.'],
                    en: ['The jump from university to industry is full of surprises: code no longer lives in a notebook, data is never clean and nobody tells you which model to use.', 'Hana honestly shares her first year as an ML Engineer at a consulting firm: the projects, the mistakes, what university did not teach her and the habits that helped her most.'] },
            learn: { es: ['Qué esperar en tu primer trabajo de ML', 'Habilidades que más pesan en el día a día', 'Cómo seguir aprendiendo sin agotarte'],
                     en: ['What to expect in your first ML job', 'The skills that matter most day to day', 'How to keep learning without burning out'] },
            agenda: { es: ['De la universidad al primer proyecto (5 min)', 'Tres errores que no repetiría (10 min)', 'Lo que sí me sirvió (10 min)', 'Preguntas (5 min)'],
                      en: ['From university to the first project (5 min)', 'Three mistakes I would not repeat (10 min)', 'What did help (10 min)', 'Q&A (5 min)'] },
            audience: { es: 'Estudiantes y personas que buscan su primer trabajo en datos o IA.', en: 'Students and people looking for their first job in data or AI.' }
        },
        'd2-4': {
            long: { es: ['En un laboratorio de física, Python está en todas partes: controla instrumentos, adquiere datos, ajusta modelos y produce las gráficas del artículo final.', 'Elizabeth muestra el flujo que usa en experimentos de microelectrónica: comunicación con instrumentos, adquisición de datos con Python, análisis con NumPy y SciPy, y visualizaciones listas para publicar.'],
                    en: ['In a physics lab, Python is everywhere: it controls instruments, acquires data, fits models and produces the plots for the final paper.', 'Elizabeth shows the workflow she uses in microelectronics experiments: talking to instruments, acquiring data with Python, analysis with NumPy and SciPy, and publication-ready visualizations.'] },
            learn: { es: ['Cómo controlar instrumentos de laboratorio desde Python', 'Ajuste de curvas y análisis de errores con SciPy', 'Buenas prácticas para gráficas científicas'],
                     en: ['How to control lab instruments from Python', 'Curve fitting and error analysis with SciPy', 'Good practices for scientific plots'] },
            agenda: { es: ['Python en el laboratorio (5 min)', 'Adquisición de datos (10 min)', 'Análisis y gráficas (10 min)', 'Preguntas (5 min)'],
                      en: ['Python in the lab (5 min)', 'Data acquisition (10 min)', 'Analysis and plots (10 min)', 'Q&A (5 min)'] },
            audience: { es: 'Nivel intermedio: estudiantes e investigadores de ciencias e ingeniería.', en: 'Intermediate level: science and engineering students and researchers.' }
        }
    };
    Object.entries(TALK_INFO).forEach(([id, info]) => Object.assign(EVENTS[id], info));
    const RECOMMENDED = 'd1-2';

    // Conteos por formato (totales y por día): las cifras de la landing y de la agenda salen
    // de aquí, así siempre coinciden con los eventos reales
    const countOf = (list) => list.reduce((c, e) => { if (e.format !== 'break') c[e.format] = (c[e.format] || 0) + 1; return c; }, {});
    const COUNTS = { total: countOf(DAYS.flatMap((d) => d.events)), days: DAYS.map((d) => countOf(d.events)) };

    /* ---------------------------------------------------------------- */
    /*  Patrocinadores (marcas ficticias para la maqueta, salvo la sede) */
    /* ---------------------------------------------------------------- */
    const SPONSORS = [
        { id: 'eafit', tier: 'venue', name: 'Universidad EAFIT', mono: 'EAFIT', color: '#1D3E73', url: 'https://www.eafit.edu.co',
          about: { es: 'La Universidad EAFIT es la sede de PyCon Colombia 2028. Su campus en Medellín, con más de 500 especies de plantas, recibe a la comunidad Python durante los tres días de la conferencia.', en: 'Universidad EAFIT is the venue of PyCon Colombia 2028. Its Medellín campus, home to more than 500 plant species, welcomes the Python community for the three days of the conference.' },
          more: { es: 'EAFIT impulsa la investigación en ciencia de datos, ingeniería de software e inteligencia artificial, y abre sus auditorios, laboratorios y zonas verdes para que la comunidad aprenda y se conecte.', en: 'EAFIT drives research in data science, software engineering and artificial intelligence, and opens its auditoriums, labs and green spaces for the community to learn and connect.' } },
        { id: 'ceiba', tier: 'platinum', name: 'Ceiba Cloud', mono: 'CC', color: '#2E6266',
          about: { es: 'Ceiba Cloud es una plataforma de infraestructura en la nube para equipos de datos de Latinoamérica, con regiones en Bogotá y São Paulo.', en: 'Ceiba Cloud is a cloud infrastructure platform for Latin American data teams, with regions in Bogotá and São Paulo.' },
          more: { es: 'Con más de diez años construyendo plataformas a la medida, Ceiba ayuda a las organizaciones a evolucionar hacia modelos de negocio basados en IA, generando valor tangible a partir de la innovación.', en: 'With over ten years building custom platforms, Ceiba helps organizations evolve toward AI-driven business models, generating tangible value from innovation.' } },
        { id: 'selva', tier: 'platinum', name: 'Selva Data', mono: 'SD', color: '#3B7A3A',
          about: { es: 'Selva Data construye productos de analítica y aprendizaje automático para el sector agrícola y ambiental.', en: 'Selva Data builds analytics and machine learning products for the agricultural and environmental sectors.' },
          more: { es: 'Su equipo, 100 % Python, contribuye a proyectos open source de geociencia y patrocina becas para estudiantes de regiones apartadas.', en: 'Its 100% Python team contributes to open source geoscience projects and sponsors grants for students from remote regions.' } },
        { id: 'tucan', tier: 'goldplus', name: 'Tucán Labs', mono: 'TL', color: '#C46A0E',
          about: { es: 'Tucán Labs es un estudio de ingeniería de software especializado en productos web con Django y FastAPI.', en: 'Tucán Labs is a software engineering studio specialized in web products with Django and FastAPI.' },
          more: { es: 'Reconocido por su cultura de mentoría, Tucán Labs acompaña a desarrolladores junior en su primer empleo en tecnología.', en: 'Known for its mentoring culture, Tucán Labs supports junior developers in their first tech job.' } },
        { id: 'rio', tier: 'goldplus', name: 'Río Software', mono: 'RS', color: '#2B5C8A',
          about: { es: 'Río Software desarrolla plataformas financieras y de pagos para millones de usuarios en la región.', en: 'Río Software develops financial and payment platforms for millions of users in the region.' },
          more: { es: 'Sus equipos de seguridad y datos usan Python a diario y comparten su conocimiento en meetups de toda Colombia.', en: 'Its security and data teams use Python daily and share their knowledge at meetups across Colombia.' } },
        { id: 'jaguar', tier: 'gold', name: 'Jaguar Dev', mono: 'JD', color: '#8A5A12',
          about: { es: 'Jaguar Dev es una consultora de automatización y DevOps con raíces en Medellín.', en: 'Jaguar Dev is an automation and DevOps consultancy rooted in Medellín.' },
          more: { es: 'Patrocina los sprints de la conferencia y regala horas de mentoría a proyectos open source locales.', en: 'It sponsors the conference sprints and donates mentoring hours to local open source projects.' } },
        { id: 'orquidea', tier: 'gold', name: 'Orquídea AI', mono: 'OA', color: '#9A2F6B',
          about: { es: 'Orquídea AI crea asistentes conversacionales en español para salud y educación.', en: 'Orquídea AI builds Spanish-language conversational assistants for health and education.' },
          more: { es: 'Su equipo de investigación publica modelos abiertos entrenados con datos de la región.', en: 'Its research team publishes open models trained on regional data.' } },
        { id: 'guadua', tier: 'silverplus', name: 'Guadua Systems', mono: 'GS', color: '#4E7A2A',
          about: { es: 'Guadua Systems ofrece soluciones de IoT y sensores para ciudades sostenibles.', en: 'Guadua Systems provides IoT and sensor solutions for sustainable cities.' },
          more: { es: 'Programa sus dispositivos con MicroPython y apoya el taller de hardware de la conferencia.', en: 'It programs its devices with MicroPython and supports the conference hardware workshop.' } },
        { id: 'colibri', tier: 'silverplus', name: 'Colibrí Media', mono: 'CM', color: '#2F7F86',
          about: { es: 'Colibrí Media es nuestro aliado de medios: cubre y transmite las charlas de la sala principal.', en: 'Colibrí Media is our media partner: it covers and streams the main room talks.' },
          more: { es: 'Gracias a su equipo, las charlas quedan grabadas y disponibles para toda la comunidad.', en: 'Thanks to its team, talks are recorded and available to the whole community.' } }
    ];
    const TIERS = [
        ['venue', { es: 'Sede', en: 'Venue' }], ['platinum', 'Platinum'], ['goldplus', 'Gold +'], ['gold', 'Gold'], ['silverplus', 'Silver +']
    ];

    /* ---------------------------------------------------------------- */
    /*  Código de conducta                                               */
    /* ---------------------------------------------------------------- */
    // Cada sección: [título, párrafos, lista de viñetas opcional, párrafos después de la lista]
    // Español: traducción fiel del texto oficial
    const COC_ES = [
        ['Introducción', [
            'PyCon Colombia es una conferencia organizada por miembros de la comunidad Python de este país para promover este lenguaje de programación en todo el territorio nacional y en Latinoamérica. El objetivo de este espacio es posicionar a Colombia como un referente tecnológico a nivel mundial, creando una red colaborativa de conocimiento que amplíe las oportunidades de interacción e intercambio entre asistentes y miembros de la comunidad.',
            'Para cumplir este propósito, es importante que cada asistente a la conferencia tenga una experiencia enriquecedora y llena de aprendizaje. Creemos que cada persona que hace parte de este espacio tiene algo valioso que aportar. Por esta razón, el siguiente código de conducta especifica lo que se espera de todas las personas participantes; en la conferencia y en los eventos relacionados, todas las personas, sin importar su rol, deben cumplir estas normas para garantizar un ambiente libre de prejuicios y acoso, donde todas las interacciones se den en un marco de respeto, dignidad y diálogo. Además, quienes organizan este evento están obligados a cumplir las leyes colombianas e internacionales, así como las de la Python Software Foundation.'
        ]],
        ['Contenido del código de conducta', [
            'PyCon Colombia se dedica a ofrecer una conferencia libre de acoso para todas las personas, sin importar su orientación sexual, identidad de género, origen étnico o racial, discapacidades o condiciones de salud, religión o creencias, edad, clase social y apariencia física. No se tolerará ninguna forma de discriminación o abuso por parte de quienes participan.',
            'La comunicación y las opiniones expresadas en la conferencia y en otros eventos deben tener en cuenta la diversidad de orígenes y experiencias del público participante. El lenguaje sexual no es apropiado en ningún evento organizado bajo nuestras normas, incluidas las charlas.'
        ]],
        ['Nuestros objetivos como comunidad', [
            'Promover un ambiente respetuoso y seguro para todas las personas es una prioridad para PyCon Colombia. Por esta razón, promovemos comportamientos y actitudes coherentes con este objetivo, entre ellos:'
        ], [
            'Escucha activa y respetuosa hacia las demás personas participantes, incluso cuando tienen puntos de vista diferentes',
            'Amabilidad y apertura para colaborar con otras personas',
            'Aportes constructivos que fortalezcan a la comunidad y sus experiencias',
            'Reconocer y valorar el tiempo y el esfuerzo de las demás personas participantes y voluntarias',
            'Expresar opiniones de manera respetuosa, tranquila y constructiva',
            'Usar un lenguaje inclusivo que respete la identidad de las personas',
            'Promover la inclusión y la participación de todas las personas sin importar diferencias de edad, orientación sexual, identidad de género, origen étnico o racial, clase social, discapacidades o condiciones de salud, religión o creencias y apariencia física',
            'Hacer uso de los recursos y materiales de la conferencia citando las fuentes'
        ]],
        ['Conductas inapropiadas', [
            'A continuación se presenta una lista de ejemplos de comportamientos inapropiados que no serán aceptados en la conferencia ni en los eventos relacionados:'
        ], [
            'Comentarios o comportamientos discriminatorios, ofensivos o agresivos que refuercen estereotipos o prejuicios basados en clase, género, raza, apariencia física, entre otros',
            'Cualquier forma de acoso (físico, sexual, digital, discriminatorio)',
            'Contacto físico sin consentimiento o insinuaciones no deseadas',
            'Uso de lenguaje sexual o intimidante, incluidas anécdotas, chistes sexuales y comentarios sobre la ropa o partes del cuerpo',
            'Usar la información privada de las personas participantes sin su consentimiento',
            'Cualquier forma de violencia contra otras personas'
        ]],
        ['Cumplimiento', [
            'Si alguien incumple las normas y los comportamientos aceptados en la conferencia PyCon Colombia y en los eventos relacionados, se le hará una advertencia y, según la gravedad del comportamiento, se considerará su expulsión del evento sin reembolso.',
            'Gracias por acatar estas normas, que ayudan a crear un ambiente respetuoso, amable y constructivo para todas las personas que participan en PyCon Colombia.'
        ]]
    ];
    // Inglés: texto oficial, tal cual fue entregado
    const COC_EN = [
        ['Introduction', [
            'PyCon Colombia is a conference organized by members of this country\'s Python community to promote this programming language throughout the national territory and in Latin America. The goal of this space is to position Colombia as a global technology reference point, creating a collaborative knowledge network that expands opportunities for interaction and exchange among attendees and community members.',
            'To fulfill this purpose, it\'s important that every conference attendee has an enriching experience full of learning. We believe that each person who is part of this space has something valuable to contribute. For this reason, the following code of conduct specifies what is expected of all participants; at the conference and related events, everyone, regardless of role, must comply with these rules to guarantee an environment free of prejudice and harassment, where all interactions take place within a framework of respect, dignity, and dialogue. Additionally, those organizing this event are obligated to comply with Colombian and international laws, as well as those of the Python Software Foundation.'
        ]],
        ['Code of Conduct Content', [
            'PyCon Colombia is dedicated to providing a harassment-free conference for everyone, regardless of sexual orientation, gender identity, ethnic or racial origin, disabilities or health conditions, religion or beliefs, age, social class, and physical appearance. No form of discrimination or abuse by participants will be tolerated.',
            'Communication and opinions expressed at the conference and other events must take into account the diversity of backgrounds and experiences of the participating audience. Sexual language is not appropriate at any event organized under our rules, including talks.'
        ]],
        ['Our Goals as a Community', [
            'Promoting a respectful and safe environment for everyone is a priority for PyCon Colombia. For this reason, we promote behaviors and attitudes consistent with this goal, including:'
        ], [
            'Active and respectful listening to other participants, even when they hold different points of view',
            'Kindness and openness to collaborate with others',
            'Constructive contributions that strengthen the community and its experiences',
            'Recognizing and valuing the time and effort of other participants and volunteers',
            'Expressing opinions respectfully, calmly, and constructively',
            'Using inclusive language that respects people\'s identities',
            'Promoting the inclusion and participation of all people regardless of differences in age, sexual orientation, gender identity, ethnic or racial origin, social class, disabilities or health conditions, religion or beliefs, and physical appearance',
            'Making use of conference resources and materials while citing sources'
        ]],
        ['Inappropriate Conduct', [
            'Below is a list of examples of inappropriate behaviors that will not be accepted at the conference and related events:'
        ], [
            'Discriminatory, offensive, or aggressive comments or behaviors that reinforce stereotypes or prejudices based on class, gender, race, physical appearance, among others',
            'Any form of harassment (physical, sexual, digital, discriminatory)',
            'Physical contact without consent or unwanted advances',
            'Use of sexual or intimidating language, including anecdotes, sexual jokes, and comments about clothing or body parts',
            'Using participants\' private information without their consent',
            'Any form of violence against others'
        ]],
        ['Enforcement', [
            'If someone fails to comply with the norms and accepted behaviors at the PyCon Colombia conference and related events, they will be warned about it, and depending on the severity of the behavior, their expulsion from the event without refund will be considered.',
            'Thank you for abiding by these norms, which help create a respectful, kind, and constructive environment for all PyCon Colombia participants.'
        ]]
    ];
    const COC = { es: COC_ES, en: COC_EN };

    /* ---------------------------------------------------------------- */
    /*  Mapa del campus (coordenadas en el SVG de 800 × 520)              */
    /* ---------------------------------------------------------------- */
    const MAP = {
        nodes: {
            metro: { x: 24, y: 488, label: { es: 'Estación Aguacatala', en: 'Aguacatala station' } },
            gate: { x: 120, y: 440, label: { es: 'Portería principal (Cra. 49)', en: 'Main gate (Cra. 49)' } },
            reg: { x: 300, y: 360, label: { es: 'Plazoleta de registro', en: 'Registration plaza' } },
            west: { x: 250, y: 280, label: { es: 'Sendero del lago', en: 'Lake path' } },
            hub: { x: 440, y: 290, label: { es: 'Plazoleta central', en: 'Central plaza' } },
            north: { x: 440, y: 200, label: { es: 'Sendero de los samanes', en: 'Saman trees path' } },
            south: { x: 600, y: 420, label: { es: 'Sendero sur', en: 'South path' } },
            park: { x: 760, y: 470, label: { es: 'Parqueadero', en: 'Parking lot' } },
            selvaDoor: { x: 250, y: 196 }, labDoor: { x: 440, y: 112 }, fundDoor: { x: 590, y: 184 }, rioDoor: { x: 668, y: 300 }
        },
        edges: [['metro', 'gate'], ['gate', 'reg'], ['reg', 'west'], ['west', 'selvaDoor'], ['reg', 'hub'], ['west', 'hub'],
                ['hub', 'north'], ['north', 'labDoor'], ['north', 'fundDoor'], ['hub', 'rioDoor'], ['hub', 'south'], ['south', 'rioDoor'], ['park', 'south'], ['gate', 'south']],
        starts: ['gate', 'metro', 'reg', 'park']
    };

    return { ROOMS, TRACKS, FORMATS, LEVELS, LANGS, SPEAKERS, KEYNOTES, DAYS, EVENTS, RECOMMENDED, COUNTS, SPONSORS, TIERS, COC, MAP };
})();
