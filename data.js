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
        { id: 'k3', name: { es: 'Por anunciar', en: 'To be announced' }, hue: 40, tba: true, role: { es: 'Core developer de CPython', en: 'CPython core developer' },
          bio: { es: 'Muy pronto revelaremos a nuestra keynote de cierre. ¡Síguenos en redes para enterarte primero!',
                 en: 'We will reveal our closing keynote very soon. Follow us on social media to be the first to know!' }, talk: 'd2-7' }
    ];

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
    const RECOMMENDED = 'd1-2';

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
    const COC = {
        es: [
            ['Nuestro compromiso', 'PyCon Colombia es una conferencia dedicada a ofrecer una experiencia libre de acoso para todas las personas, sin importar su género, identidad o expresión de género, orientación sexual, discapacidad, apariencia física, tamaño corporal, etnia, edad, religión, nacionalidad o nivel de experiencia. No toleramos el acoso en ninguna de sus formas.'],
            ['Comportamiento esperado', 'Sé amable y paciente. Respeta los diferentes puntos de vista y experiencias. Usa un lenguaje inclusivo. Acepta la crítica constructiva con gracia. Cuida a las demás personas: si ves a alguien en apuros, ofrece ayuda o avisa al equipo organizador.'],
            ['Comportamiento inaceptable', 'Comentarios ofensivos o discriminatorios, intimidación, acecho, seguimiento, fotografías o grabaciones no deseadas, interrupción reiterada de charlas u otros eventos, contacto físico inapropiado y atención sexual no deseada. El lenguaje e imágenes sexuales no son apropiados en ningún espacio de la conferencia, incluidas charlas, talleres, fiestas, redes sociales y medios en línea.'],
            ['Alcance', 'Este código aplica a asistentes, ponentes, patrocinadores, voluntarios y equipo organizador, en todos los espacios de la conferencia: sedes, eventos sociales, canales en línea y redes sociales relacionadas con PyCon Colombia.'],
            ['Cómo reportar', 'Si sufres o presencias un comportamiento inaceptable, o tienes cualquier otra inquietud, contacta de inmediato al equipo organizador (camisetas naranjas) o escríbenos a conducta@pycon.co. También puedes usar el formulario de reporte, que puede ser anónimo. Todos los reportes se tratan con confidencialidad.'],
            ['Consecuencias', 'Las personas a quienes se les pida detener un comportamiento inaceptable deben hacerlo de inmediato. El equipo organizador puede tomar cualquier acción que considere adecuada, incluida una advertencia o la expulsión de la conferencia sin reembolso.']
        ],
        en: [
            ['Our pledge', 'PyCon Colombia is dedicated to providing a harassment-free experience for everyone, regardless of gender, gender identity and expression, sexual orientation, disability, physical appearance, body size, ethnicity, age, religion, nationality or level of experience. We do not tolerate harassment in any form.'],
            ['Expected behavior', 'Be kind and patient. Respect differing viewpoints and experiences. Use inclusive language. Gracefully accept constructive criticism. Look out for each other: if you see someone in distress, offer help or alert the organizing team.'],
            ['Unacceptable behavior', 'Offensive or discriminatory comments, intimidation, stalking, following, unwanted photography or recording, sustained disruption of talks or other events, inappropriate physical contact and unwelcome sexual attention. Sexual language and imagery is not appropriate in any conference venue, including talks, workshops, parties, social media and online channels.'],
            ['Scope', 'This code applies to attendees, speakers, sponsors, volunteers and organizers in every conference space: venues, social events, online channels and social media related to PyCon Colombia.'],
            ['How to report', 'If you experience or witness unacceptable behavior, or have any other concerns, contact the organizing team immediately (orange t-shirts) or email conducta@pycon.co. You can also use the report form, which can be anonymous. All reports are handled confidentially.'],
            ['Consequences', 'Participants asked to stop any unacceptable behavior are expected to comply immediately. Organizers may take any action they deem appropriate, including a warning or expulsion from the conference without a refund.']
        ]
    };

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

    return { ROOMS, TRACKS, FORMATS, LEVELS, LANGS, SPEAKERS, KEYNOTES, DAYS, EVENTS, RECOMMENDED, SPONSORS, TIERS, COC, MAP };
})();
