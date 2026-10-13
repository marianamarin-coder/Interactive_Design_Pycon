/* =========================================================================
   PyCon Colombia 2028 — Parallax de la ilustración (capas del PSD)
   -------------------------------------------------------------------------
   Todas las capas comparten un "escenario" (#stage) con la proporción del
   lienzo original (1920 × 1080). El escenario se escala para cubrir la
   pantalla con un margen extra, de modo que las capas puedan moverse sin
   dejar ver sus bordes.

   - data-depth  → cuánto se desplaza la capa con el mouse / giroscopio.
   - data-scroll → cuánto baja la capa al hacer scroll (la cámara "sube").
   El logo del hero (.hero__float) también tiene data-depth y se mueve con
   el mismo motor, para que flote sobre la escena.

   Ciclo del día: a medida que se recorre la página la escena pasa de día a
   atardecer y a noche. Cada capa pintada se tiñe (multiplicar) con un color
   que JS calcula, usando la propia capa como máscara; aparecen estrellas,
   luna y luciérnagas, y el sol se oculta.
   ========================================================================= */
(() => {
    const CANVAS_W = 1920, CANVAS_H = 1080;
    // Margen extra (en fracción de pantalla) para que el movimiento nunca muestre bordes
    const OVER = { x: 0.05, top: 0.09, bottom: 0.035 };
    // Amplitud del movimiento, en fracción de pantalla
    const AMP = { x: 0.035, y: 0.028, scroll: 0.07 };

    const stage = document.getElementById('stage');
    if (!stage) return;

    const layers = [...stage.querySelectorAll('.layer')].map((el) => ({
        el, depth: +el.dataset.depth || 0, scroll: +el.dataset.scroll || 0
    }));
    const floaters = [...document.querySelectorAll('.hero__float[data-depth]')].map((el) => ({
        el, depth: +el.dataset.depth || 0
    }));
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const root = document.documentElement;

    /* ------------------------------------------------------------ */
    /*  Estrellas y luciérnagas (generadas una vez, con semilla)     */
    /* ------------------------------------------------------------ */
    const seeded = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const rnd = seeded(2028);
    const stars = document.getElementById('stars');
    if (stars) {
        let html = '';
        for (let i = 0; i < 140; i++) {
            const big = rnd() > 0.88;
            html += `<i style="left:${(rnd() * 100).toFixed(2)}%;top:${(rnd() * 52).toFixed(2)}%;` +
                `--s:${big ? 3 : 1.5 + rnd()}px;--d:${(2 + rnd() * 4).toFixed(1)}s;--o:${(0.5 + rnd() * 0.5).toFixed(2)}"></i>`;
        }
        stars.innerHTML = html;
    }
    const flies = document.getElementById('fireflies');
    if (flies) {
        let html = '';
        for (let i = 0; i < 26; i++) {
            html += `<i style="left:${(8 + rnd() * 84).toFixed(2)}%;top:${(55 + rnd() * 40).toFixed(2)}%;` +
                `--d:${(5 + rnd() * 6).toFixed(1)}s;--delay:${(-rnd() * 8).toFixed(1)}s;--dx:${(rnd() * 60 - 30).toFixed(0)}px;--dy:${(-20 - rnd() * 50).toFixed(0)}px"></i>`;
        }
        flies.innerHTML = html;
    }

    /* Colores del tinte (multiplicar): blanco = sin cambio */
    const DAY = [255, 255, 255], DUSK = [246, 168, 128], NIGHT = [52, 66, 120];
    const SKY_DUSK = [250, 150, 120], SKY_NIGHT = [22, 32, 78];
    const mix = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
    const rgb = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;
    const smooth = (a, b, v) => { const x = Math.min(1, Math.max(0, (v - a) / (b - a))); return x * x * (3 - 2 * x); };

    /* ------------------------------------------------------------ */
    /*  Encuadre: cubrir la pantalla con un punto focal adaptable    */
    /* ------------------------------------------------------------ */
    function fitStage() {
        const vw = innerWidth, vh = innerHeight;
        const needW = vw * (1 + OVER.x * 2);
        const needH = vh * (1 + OVER.top + OVER.bottom);
        const s = Math.max(needW / CANVAS_W, needH / CANVAS_H);
        const w = CANVAS_W * s, h = CANVAS_H * s;

        // En pantallas verticales enfocamos el lado izquierdo: guacamaya, lianas y mariposa
        const portrait = vw / vh < 0.9;
        const fx = portrait ? 0.3 : 0.5;
        const fy = 0.45;

        const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
        const left = clamp(vw / 2 - fx * w, vw * (1 + OVER.x) - w, -vw * OVER.x);
        const top = clamp(vh / 2 - fy * h, vh * (1 + OVER.bottom) - h, -vh * OVER.top);

        stage.style.width = `${w}px`;
        stage.style.height = `${h}px`;
        stage.style.left = `${left}px`;
        stage.style.top = `${top}px`;
    }

    /* ------------------------------------------------------------ */
    /*  Movimiento suavizado (interpolación) con mouse + scroll      */
    /* ------------------------------------------------------------ */
    const target = { x: 0, y: 0, p: 0, n: 0 };
    const cur = { x: 0, y: 0, p: 0, n: 0 };
    let raf = 0;

    const scrollProgress = () => Math.min(1, Math.max(0, scrollY / innerHeight));
    // Progreso de toda la página: 0 = arriba (día) · 1 = pie de página (noche)
    const pageProgress = () => {
        const max = root.scrollHeight - innerHeight;
        return max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    };

    function paintSky(n) {
        const dusk = smooth(0.08, 0.38, n) * (1 - smooth(0.55, 0.85, n));
        const night = smooth(0.4, 0.82, n);
        const tint = mix(mix(DAY, DUSK, dusk), NIGHT, night);
        const sky = mix(mix(DAY, SKY_DUSK, dusk), SKY_NIGHT, night);
        root.style.setProperty('--tint', rgb(tint));
        root.style.setProperty('--tint-sky', rgb(sky));
        root.style.setProperty('--dusk', dusk.toFixed(3));
        root.style.setProperty('--night', night.toFixed(3));
        root.style.setProperty('--sun-down', smooth(0.05, 0.6, n).toFixed(3));
    }

    function frame() {
        const still = reduce.matches;
        const ease = still ? 1 : 0.07;
        cur.x += (target.x - cur.x) * ease;
        cur.y += (target.y - cur.y) * ease;
        cur.p += (target.p - cur.p) * (still ? 1 : 0.14);
        cur.n += (target.n - cur.n) * (still ? 1 : 0.1);

        const vw = innerWidth, vh = innerHeight;
        const m = still ? 0 : 1;
        const mx = cur.x * m, my = cur.y * m, p = cur.p * m;

        for (const l of layers) {
            const tx = -mx * l.depth * AMP.x * vw;
            const ty = -my * l.depth * AMP.y * vh + p * l.scroll * AMP.scroll * vh;
            l.el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
        }
        for (const f of floaters) {
            const tx = mx * f.depth * AMP.x * vw * 0.6;
            const ty = my * f.depth * AMP.y * vh * 0.6;
            f.el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
        }
        paintSky(cur.n);

        const settled = Math.abs(target.x - cur.x) < 0.0005 && Math.abs(target.y - cur.y) < 0.0005 &&
            Math.abs(target.p - cur.p) < 0.0005 && Math.abs(target.n - cur.n) < 0.0005;
        raf = settled ? 0 : requestAnimationFrame(frame);
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

    addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch') return;
        target.x = (e.clientX / innerWidth - 0.5) * 2;
        target.y = (e.clientY / innerHeight - 0.5) * 2;
        kick();
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => { target.x = 0; target.y = 0; kick(); });

    // En móviles, el giroscopio (si el navegador lo expone sin pedir permiso) hace de mouse
    addEventListener('deviceorientation', (e) => {
        if (e.gamma == null) return;
        target.x = Math.max(-1, Math.min(1, e.gamma / 25));
        target.y = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
        kick();
    }, { passive: true });

    const onScroll = () => { target.p = scrollProgress(); target.n = pageProgress(); kick(); };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', () => { fitStage(); onScroll(); });
    // Al cambiar entre la landing y las páginas internas cambia la altura del documento
    addEventListener('hashchange', () => requestAnimationFrame(onScroll));
    reduce.addEventListener?.('change', kick);

    fitStage();
    target.p = cur.p = scrollProgress();
    target.n = cur.n = pageProgress();
    paintSky(cur.n);
    kick();

    // La escena aparece cuando sus capas ya cargaron (evita ver capas a medias)
    const imgs = [...stage.querySelectorAll('img')];
    Promise.all(imgs.map((img) => (img.complete ? Promise.resolve() : new Promise((r) => { img.onload = img.onerror = r; }))))
        .then(() => document.documentElement.classList.add('scene-ready'));
})();
