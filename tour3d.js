/* =========================================================================
   PyCon Colombia 2028 — Recorrido 3D por el Amazonas (Three.js)
   -------------------------------------------------------------------------
   Reemplaza la ilustración 2D del fondo. La escena viene de Blender
   (assets/3d/recorrido-amazonas.glb, comprimida con Draco) y trae la cámara
   animada "Camara_Recorrido": inicio = mirador, final = claro de la ceiba.

   - El scroll mueve la cámara por la animación. Cada sección de la landing
     marca un punto del recorrido con data-tour (0–1), así cada tarjeta se lee
     sobre un hito: mirador, vuelo, botos, playa, victorias, sendero y claro.
   - Cada zona del GLB (nodos G_*) trae extras.p_ini / p_fin: solo se dibujan
     las zonas activas para el progreso actual.
   - Los assets repetidos se agrupan en InstancedMesh por celdas del terreno
     para reducir las llamadas de dibujo, y cada celda se descarta por
     distancia según el tamaño del objeto (además del frustum culling).
   - Luz de atardecer del inventario: sol cálido con sombras, relleno frío,
     cielo degradado y bruma por distancia teñida hacia el sol.
   - Calidad por niveles (alta / media / baja) elegida midiendo la GPU al
     cargar; si después va lento baja de nivel sola.
   - El logo del hero (.hero__float) se desplaza con el puntero, como antes.
   ========================================================================= */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const MODEL_URL = 'assets/3d/recorrido-amazonas.glb';
const DRACO_URL = 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/draco/gltf/';

// Bloque "iluminacion" de export/inventario_recorrido.json (colores lineales)
const LIGHT = {
    sunElevation: 26, sunAzimuth: 55,
    sun: [1.0, 0.70, 0.40], fill: [0.62, 0.74, 1.0], ambient: [0.30, 0.46, 0.72],
    skyTop: [0.20, 0.38, 0.68], skyMid: [0.78, 0.62, 0.60], skyHorizon: [1.0, 0.70, 0.40],
    fog: [0.84, 0.668, 0.56], fogDistance: 2400
};
const VIEW_RANGE = [0.40, 0.50];   // páginas internas: tramo tranquilo del río (playa con capibaras)
const ZONE_MARGIN = 0.012;         // las zonas aparecen un poco antes de su p_ini para evitar saltos
const CELL = 160;                  // metros: celdas para agrupar instancias y poder descartarlas fuera de cámara
const BENCH_P = [0.30, 0.85];      // puntos del recorrido que se miden al cargar (vuelo bajo y sendero, el más pesado)
// Dentro del pasillo del sendero los muros de follaje tapan el fondo: estas zonas dejan
// de dibujarse desde ese progreso aunque su p_fin sea mayor (comprobado cuadro a cuadro)
const HIDDEN_FROM = { G_Relleno_Emergentes: 0.865, G_Arboles_Orilla_3: 0.865 };

const root = document.documentElement;
const host = document.getElementById('tour');
const canvas = document.getElementById('tour-canvas');
const veil = host?.querySelector('.tour__veil');
const statusEl = document.getElementById('tour-status');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const ease = (rate, dt) => 1 - Math.exp(-rate * dt);
const smooth = (a, b, v) => { const x = Math.min(1, Math.max(0, (v - a) / (b - a))); return x * x * (3 - 2 * x); };
const linear = (rgb) => new THREE.Color().setRGB(rgb[0], rgb[1], rgb[2], THREE.LinearSRGBColorSpace);

/* ------------------------------------------------------------------ */
/*  Aviso de carga (abajo a la izquierda, no bloquea la página)        */
/* ------------------------------------------------------------------ */
const MSG = {
    es: { loading: 'Cargando el recorrido 3D', preparing: 'Preparando la selva…', tuning: 'Ajustando la calidad a tu equipo…', error: 'No se pudo cargar el recorrido 3D', lite: 'Modo ligero: fondo simple para ahorrar datos', nogl: 'Tu navegador no muestra 3D: usamos un fondo simple' },
    en: { loading: 'Loading the 3D journey', preparing: 'Preparing the rainforest…', tuning: 'Tuning quality for your device…', error: 'The 3D journey could not be loaded', lite: 'Light mode: simple background to save data', nogl: 'Your browser cannot show 3D: using a simple background' }
};
function setStatus(key, pct = null) {
    if (!statusEl) return;
    statusEl.querySelector('.tour-status__text').textContent = (MSG[root.lang] || MSG.es)[key];
    statusEl.style.setProperty('--p', pct == null ? 1 : pct.toFixed(3));
    statusEl.classList.toggle('is-error', key === 'error' || key === 'nogl' || key === 'lite');
    statusEl.classList.remove('is-done');
}
const hideStatus = (delay = 0) => setTimeout(() => statusEl?.classList.add('is-done'), delay);
// deja pintar el aviso; el temporizador cubre las pestañas en segundo plano (ahí no corre requestAnimationFrame)
const nextPaint = () => new Promise((r) => { requestAnimationFrame(() => setTimeout(r, 0)); setTimeout(r, 80); });

/* ------------------------------------------------------------------ */
/*  Scroll → progreso del recorrido                                    */
/* ------------------------------------------------------------------ */
// Pares [scrollY, progreso]; entre pares se interpola linealmente
let anchors = [[0, 0], [1, 1]];
let anchorsDirty = true;
const inView = () => document.body.classList.contains('in-view');

function buildAnchors() {
    const max = Math.max(1, root.scrollHeight - innerHeight);
    if (inView()) { anchors = [[0, VIEW_RANGE[0]], [max, VIEW_RANGE[1]]]; return; }
    const pts = [[0, 0]];
    document.querySelectorAll('#landing [data-tour]').forEach((el) => {
        const p = +el.dataset.tour;
        // el hito se alcanza cuando la sección llega al 40 % de la pantalla
        const y = Math.min(max, el.getBoundingClientRect().top + scrollY - innerHeight * 0.4);
        const last = pts[pts.length - 1];
        if (y > last[0] + 1 && p > last[1]) pts.push([y, p]);
    });
    const last = pts[pts.length - 1];
    if (max > last[0] + 1) pts.push([max, 1]); else last[1] = 1;
    anchors = pts;
}

function progressAt(y) {
    for (let i = 1; i < anchors.length; i++) {
        const [y1, p1] = anchors[i];
        if (y <= y1) {
            const [y0, p0] = anchors[i - 1];
            return p0 + (p1 - p0) * Math.max(0, (y - y0) / (y1 - y0));
        }
    }
    return anchors[anchors.length - 1][1];
}

/* ------------------------------------------------------------------ */
/*  Puntero / giroscopio: balanceo leve de la cámara y del logo        */
/* ------------------------------------------------------------------ */
const pointer = { x: 0, y: 0 };
const sway = { x: 0, y: 0 };
const floaters = [...document.querySelectorAll('.hero__float[data-depth]')].map((el) => ({ el, depth: +el.dataset.depth || 0 }));

addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    pointer.x = (e.clientX / innerWidth - 0.5) * 2;
    pointer.y = (e.clientY / innerHeight - 0.5) * 2;
    wake();
}, { passive: true });
root.addEventListener('pointerleave', () => { pointer.x = 0; pointer.y = 0; wake(); });
addEventListener('deviceorientation', (e) => {
    if (e.gamma == null) return;
    pointer.x = Math.max(-1, Math.min(1, e.gamma / 25));
    pointer.y = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
    wake();
}, { passive: true });

const markDirty = () => { anchorsDirty = true; wake(); };
addEventListener('scroll', wake, { passive: true });
addEventListener('resize', markDirty);
// Al cambiar entre la landing y las páginas internas cambia la altura del documento
addEventListener('hashchange', () => requestAnimationFrame(markDirty));
new ResizeObserver(markDirty).observe(document.body);
reduce.addEventListener?.('change', wake);

/* ------------------------------------------------------------------ */
/*  Bucle principal                                                    */
/* ------------------------------------------------------------------ */
const state = { target: 0, cur: -1 };
let world = null;
let raf = 0, lastTime = 0, lastHero = -1;

function wake() { if (!raf) { lastTime = performance.now(); raf = requestAnimationFrame(loop); } }

function loop(now) {
    const dt = Math.min(0.1, Math.max(0.001, (now - lastTime) / 1000));
    lastTime = now;
    if (anchorsDirty) { anchorsDirty = false; buildAnchors(); }

    const still = reduce.matches;
    state.target = progressAt(scrollY);
    if (state.cur < 0 || still) state.cur = state.target;
    const dp = state.target - state.cur;
    state.cur = Math.abs(dp) < 1e-5 ? state.target : state.cur + dp * ease(4.2, dt);

    const k = still ? 1 : ease(3.2, dt);
    const sx = (pointer.x - sway.x) * k, sy = (pointer.y - sway.y) * k;
    sway.x += sx; sway.y += sy;
    const swaying = Math.abs(sx) + Math.abs(sy) > 1e-4;
    const moving = Math.abs(dp) > 1e-5 || swaying;

    // El logo flota sobre la escena siguiendo al puntero (solo mientras el hero se ve)
    const heroVisible = !inView() && scrollY < innerHeight * 1.2;
    if (heroVisible) {
        const mx = still ? 0 : sway.x, my = still ? 0 : sway.y;
        for (const f of floaters) {
            const tx = mx * f.depth * 0.021 * innerWidth, ty = my * f.depth * 0.017 * innerHeight;
            f.el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
        }
    }
    // --hero: 1 arriba de la landing → 0 al bajar (aclara el cielo detrás del logo).
    // Se escribe en el velo, no en <html>, para no recalcular estilos de toda la página.
    const hero = heroVisible ? 1 - smooth(0, innerHeight * 0.85, scrollY) : 0;
    if (veil && Math.abs(hero - lastHero) > 0.002) { veil.style.setProperty('--hero', hero.toFixed(3)); lastHero = hero; }

    const ambient = world ? world.update(state.cur, sway, dt, now, moving) : false;
    raf = moving || (ambient && !still) ? requestAnimationFrame(loop) : 0;
}

/* ------------------------------------------------------------------ */
/*  Niveles de calidad                                                 */
/* ------------------------------------------------------------------ */
const DPR = devicePixelRatio || 1;
const coarse = matchMedia('(pointer: coarse)').matches;
// algunos navegadores embebidos informan screen = 0×0: en ese caso se usa la ventana
const smallScreen = Math.min(screen.width || innerWidth, screen.height || innerHeight) < 760;
const gpuName = (() => {
    try {
        const gl = document.createElement('canvas').getContext('webgl');
        const ext = gl?.getExtension('WEBGL_debug_renderer_info');
        const name = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '';
        gl?.getExtension('WEBGL_lose_context')?.loseContext();
        return String(name);
    } catch (_) { return ''; }
})();
const weakGPU = /Intel.*(HD|UHD) Graphics|Mali|Adreno|PowerVR|SwiftShader|llvmpipe|Basic Render/i.test(gpuName);

// dpr: resolución del canvas (nunca más de 1,5 aunque la pantalla sea 2x–4x)
// shadows: sombras en tiempo real · lambert: materiales sin PBR · idle: agua y alas animadas en reposo
// cull: multiplica la distancia a la que se dejan de dibujar los objetos pequeños
// maxFps: tope de cuadros por segundo mientras se hace scroll (equipos muy débiles: el
// scroll de la página sigue fluido porque la GPU no se satura; al soltar se dibuja el final)
const TIERS = {
    high: { dpr: Math.min(DPR, 1.5), shadows: 'soft', shadowSize: 2048, lambert: false, idle: true, cull: 1 },
    medium: { dpr: Math.min(DPR, 1), shadows: 'hard', shadowSize: 1024, lambert: false, idle: false, cull: 0.75 },
    low: { dpr: Math.min(DPR, 0.75), shadows: null, shadowSize: 0, lambert: true, idle: false, cull: 0.55 },
    minimal: { dpr: Math.min(DPR, 0.6), shadows: null, shadowSize: 0, lambert: true, idle: false, cull: 0.4, maxFps: 12 }
};
const ORDER = ['high', 'medium', 'low', 'minimal'];
// Modo ligero: con ahorro de datos, conexión 2G o muy poca memoria no se descargan los
// 9 MB del modelo; queda el fondo de atardecer en CSS y la página funciona igual
const conn = navigator.connection || {};
const LITE = !!conn.saveData || /2g$/.test(conn.effectiveType || '') || (navigator.deviceMemory || 8) < 2;
const DPR_FLOOR = 0.55;
// Punto de partida antes de medir: el antialias (MSAA) solo se puede decidir al crear el contexto
const GUESS = coarse || smallScreen || weakGPU ? 'low' : /Iris/i.test(gpuName) || (navigator.hardwareConcurrency || 8) <= 4 ? 'medium' : 'high';
const ANTIALIAS = GUESS === 'high' && DPR < 2;

/* ------------------------------------------------------------------ */
/*  Materiales: bruma por distancia, gradación y aleteo                */
/* ------------------------------------------------------------------ */
const SHARED = {
    uFogSun: { value: new THREE.Vector3() },                 // dirección del sol en espacio de vista
    uFogWarm: { value: linear([1.1, 0.77, 0.44]) },          // la bruma se calienta mirando al sol
    uTime: { value: 0 }
};
// Gradación de los renders de Blender (+25 % saturación, +6 % contraste) dentro del shader:
// sale gratis, mientras que un filter: CSS sobre el canvas suma una pasada de pantalla completa
const GRADE_GLSL = /* glsl */`
    float gradeL = dot(gl_FragColor.rgb, vec3(0.2126, 0.7152, 0.0722));
    gl_FragColor.rgb = (mix(vec3(gradeL), gl_FragColor.rgb, 1.25) - 0.5) * 1.06 + 0.5;`;
// Bruma como en los renders de Blender: 1 - e^(-d / 2400 m), máximo 92 %
const FOG_GLSL = /* glsl */`
#ifdef USE_FOG
    float fogF = 0.92 * (1.0 - exp(-fogDensity * vFogDepth));
    float toSun = max(dot(normalize(-vViewPosition), uFogSun), 0.0);
    vec3 fogC = mix(fogColor, uFogWarm, pow(toSun, 5.0) * 0.8);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogC, fogF);
#endif
${GRADE_GLSL}`;
// Aleteo de guacamayas y morfos en vuelo: las alas (eje X local) giran sobre el cuerpo
const FLAP_GLSL = /* glsl */`
#include <begin_vertex>
    float flapSeed = 0.0;
    #ifdef USE_INSTANCING
        flapSeed = float(gl_InstanceID) * 0.618;
    #endif
    float flapA = sin(uTime * FLAP_SPEED + flapSeed * 6.2831) * FLAP_AMP;
    float flapR = abs(transformed.x);
    transformed.y += flapR * sin(flapA);
    transformed.x *= cos(flapA);`;

function patchFog(shader) {
    shader.uniforms.uFogSun = SHARED.uFogSun;
    shader.uniforms.uFogWarm = SHARED.uFogWarm;
    shader.fragmentShader = shader.fragmentShader
        .replace('#include <fog_pars_fragment>', '#include <fog_pars_fragment>\nuniform vec3 uFogSun;\nuniform vec3 uFogWarm;')
        .replace('#include <fog_fragment>', FOG_GLSL);
}
function patchFlap(shader) {
    patchFog(shader);
    shader.uniforms.uTime = SHARED.uTime;
    shader.vertexShader = 'uniform float uTime;\n' + shader.vertexShader.replace('#include <begin_vertex>', FLAP_GLSL);
}

const FLAP = {
    bird: { FLAP_SPEED: '5.5', FLAP_AMP: '0.55' },
    butterfly: { FLAP_SPEED: '16.0', FLAP_AMP: '0.95' }
};
const flapCache = new Map();
function flapMaterial(src, kind) {
    const key = src.uuid + kind;
    if (!flapCache.has(key)) {
        const m = src.clone();
        m.defines = { ...(m.defines || {}), ...FLAP[kind] };
        m.onBeforeCompile = patchFlap;
        flapCache.set(key, m);
    }
    return flapCache.get(key);
}

// Nivel bajo: la misma apariencia con MeshLambertMaterial (sin el cálculo PBR por píxel)
const LAMBERT_KEYS = ['name', 'color', 'map', 'normalMap', 'normalScale', 'emissive', 'emissiveMap', 'emissiveIntensity',
    'vertexColors', 'transparent', 'opacity', 'alphaTest', 'side', 'blending', 'depthWrite'];
function toLambert(src) {
    const m = new THREE.MeshLambertMaterial();
    for (const k of LAMBERT_KEYS) if (src[k] !== undefined) m[k] = src[k]?.isColor || src[k]?.isVector2 ? src[k].clone() : src[k];
    m.defines = Object.fromEntries(Object.entries(src.defines || {}).filter(([k]) => k.startsWith('FLAP')));
    m.onBeforeCompile = src.onBeforeCompile;
    if (src.envMap) { m.envMap = src.envMap; m.combine = THREE.MixOperation; m.reflectivity = 0.5; }
    return m;
}

/* ------------------------------------------------------------------ */
/*  Cielo degradado con halo solar (mismo cálculo que preview.py)      */
/* ------------------------------------------------------------------ */
function makeSky(sunDir, colors = {}, grade = true) {
    const c = { top: LIGHT.skyTop, mid: LIGHT.skyMid, hor: LIGHT.skyHorizon, fog: LIGHT.fog, ...colors };
    return new THREE.ShaderMaterial({
        side: THREE.BackSide, depthTest: false, depthWrite: false, fog: false,
        uniforms: {
            uTop: { value: linear(c.top) }, uMid: { value: linear(c.mid) },
            uHor: { value: linear(c.hor) }, uFog: { value: linear(c.fog) },
            uWarm: { value: linear([1.0, 0.80, 0.52]) }, uSun: { value: sunDir.clone() }
        },
        vertexShader: /* glsl */`
            varying vec3 vDir;
            void main() {
                vDir = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }`,
        fragmentShader: /* glsl */`
            uniform vec3 uTop, uMid, uHor, uFog, uWarm, uSun;
            varying vec3 vDir;
            void main() {
                vec3 d = normalize(vDir);
                // el degradado completo cabe en la parte alta del encuadre, como en el render
                float t = clamp(d.y / 0.30, 0.0, 1.0);
                vec3 sky = t < 0.35 ? mix(uHor, uMid, pow(t / 0.35, 0.8)) : mix(uMid, uTop, pow((t - 0.35) / 0.65, 0.7));
                // cerca del horizonte el cielo se funde con la bruma del terreno
                sky = mix(sky, uFog, (1.0 - smoothstep(-0.02, 0.07, d.y)) * 0.8);
                float r = acos(clamp(dot(d, uSun), -1.0, 1.0));
                float glow = 0.9 * exp(-r * 4.0) + 0.7 * exp(-r * 27.0) + step(r, 0.016) * 2.0;
                sky += glow * (uWarm - sky) * clamp(glow, 0.0, 1.0);
                gl_FragColor = vec4(sky, 1.0);
                #include <colorspace_fragment>
                ${grade ? GRADE_GLSL : ''}
            }`
    });
}

/* ------------------------------------------------------------------ */
/*  Construcción de la escena                                          */
/* ------------------------------------------------------------------ */
function nodeOf(obj, zone) {
    // nodo directo bajo la zona (p. ej. "Guacamaya_Vuelo003"), dueño de las primitivas
    let o = obj;
    while (o.parent && o.parent !== zone) o = o.parent;
    return o;
}

function instanceZone(zone) {
    zone.updateMatrixWorld(true);
    const inv = zone.matrixWorld.clone().invert();
    const buckets = new Map();
    const pos = new THREE.Vector3();
    zone.traverse((o) => {
        if (!o.isMesh) return;
        o.getWorldPosition(pos);
        const key = `${o.geometry.uuid}|${o.material.uuid}|${Math.floor(pos.x / CELL)},${Math.floor(pos.z / CELL)}`;
        if (!buckets.has(key)) buckets.set(key, []);
        buckets.get(key).push(o);
    });
    const m = new THREE.Matrix4();
    for (const list of buckets.values()) {
        if (list.length < 2) continue;
        const src = list[0];
        const im = new THREE.InstancedMesh(src.geometry, src.material, list.length);
        list.forEach((o, i) => { im.setMatrixAt(i, m.multiplyMatrices(inv, o.matrixWorld)); o.removeFromParent(); });
        im.name = src.name;
        im.castShadow = src.castShadow;
        im.receiveShadow = src.receiveShadow;
        im.computeBoundingSphere();
        zone.add(im);
    }
    const empty = [];
    zone.traverse((o) => { if (o !== zone && !o.isMesh && o.children.length === 0) empty.push(o); });
    empty.forEach((o) => o.removeFromParent());
}

// Distancia máxima de dibujo según el tamaño real del objeto: una heliconia a 500 m
// ocupa menos de un píxel y está casi cubierta por la bruma
const drawDistance = (size) => (size < 1.5 ? 180 : size < 6 ? 450 : size < 20 ? 1100 : Infinity);

function collectCullables(zone) {
    const out = [];
    const m = new THREE.Matrix4(), s = new THREE.Vector3(), q = new THREE.Quaternion(), p = new THREE.Vector3();
    zone.updateMatrixWorld(true);
    zone.traverse((o) => {
        if (!o.isMesh) return;
        if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
        let sphere;
        if (o.isInstancedMesh) {
            o.getMatrixAt(0, m);
            sphere = o.boundingSphere.clone().applyMatrix4(o.matrixWorld);
        } else {
            m.copy(o.matrixWorld);
            sphere = o.geometry.boundingSphere.clone().applyMatrix4(o.matrixWorld);
        }
        m.decompose(p, q, s);
        const size = o.geometry.boundingSphere.radius * Math.max(s.x, s.y, s.z);
        const max = drawDistance(size);
        if (max < Infinity) out.push({ obj: o, center: sphere.center, radius: sphere.radius, max });
    });
    return out;
}

async function init() {
    if (!host || !canvas) return;
    if (LITE) { root.classList.add('tour-lite'); setStatus('lite'); hideStatus(6000); return; }
    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: ANTIALIAS, powerPreference: 'high-performance', stencil: false });
    } catch (err) {
        setStatus('nogl'); hideStatus(6000); return;
    }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;   // como la vista "Standard" de Blender
    renderer.setClearColor(linear(LIGHT.fog));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.autoUpdate = false;        // solo se recalcula cuando la cámara se mueve

    setStatus('loading', 0);
    const draco = new DRACOLoader().setDecoderPath(DRACO_URL);
    const loader = new GLTFLoader().setDRACOLoader(draco);
    let gltf;
    try {
        gltf = await loader.loadAsync(MODEL_URL, (e) => { if (e.total) setStatus('loading', e.loaded / e.total); });
    } catch (err) {
        console.error('[recorrido 3D]', err);
        setStatus('error'); hideStatus(6000); renderer.dispose(); return;
    }
    setStatus('preparing');
    await nextPaint();   // deja pintar el aviso antes de preparar la escena

    world = buildWorld(renderer, gltf);
    draco.dispose();

    // Se mide la GPU en los tramos más exigentes (peor caso: sombras recalculadas en cada cuadro).
    // Se baja de nivel mientras el cuadro cueste más de ~28 ms y se sube mientras sobre margen
    // (la estimación inicial por el nombre de la GPU es solo un punto de partida).
    setStatus('tuning');
    await nextPaint();
    const SLOW = 28, ROOM = 14;
    let tier = GUESS;
    const tryTier = async (name) => { world.applyTier(name); await world.compile(); return world.benchmark(); };
    let cost = await tryTier(tier);
    const log = [`${tier} ${cost.toFixed(1)} ms`];
    while (cost > SLOW && tier !== 'minimal') {
        tier = ORDER[ORDER.indexOf(tier) + 1];
        cost = await tryTier(tier);
        log.push(`${tier} ${cost.toFixed(1)} ms`);
    }
    while (cost < ROOM && tier !== 'high' && !coarse) {
        const up = ORDER[ORDER.indexOf(tier) - 1];
        const c = await tryTier(up);
        log.push(`${up} ${c.toFixed(1)} ms`);
        if (c > SLOW) { await tryTier(tier); break; }
        tier = up; cost = c;
    }
    console.debug('[recorrido 3D] mediciones:', log.join(' → '));
    console.info(`[recorrido 3D] calidad ${tier} · ${cost.toFixed(1)} ms por cuadro en el tramo más pesado · ${gpuName}`);
    world.ready();
    host.classList.add('is-ready');
    hideStatus(400);
    wake();
}

function buildWorld(renderer, gltf) {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(linear(LIGHT.fog), 1 / LIGHT.fogDistance);
    scene.add(gltf.scene);

    /* --- Cámara animada del GLB --- */
    const camera = gltf.cameras[0];
    camera.near = 0.25; camera.far = 12000;
    const clip = gltf.animations[0];
    const posTrack = clip.tracks.find((t) => t.name.endsWith('.position'));
    const rotTrack = clip.tracks.find((t) => t.name.endsWith('.quaternion'));
    const posAt = posTrack.createInterpolant();
    const rotAt = rotTrack.createInterpolant();
    const duration = clip.duration;
    const baseQ = new THREE.Quaternion(), swayQ = new THREE.Quaternion(), swayE = new THREE.Euler();

    /* --- Luces --- */
    const el = THREE.MathUtils.degToRad(LIGHT.sunElevation), az = THREE.MathUtils.degToRad(LIGHT.sunAzimuth);
    // Blender (Z arriba) → glTF (Y arriba): (x, y, z) → (x, z, -y)
    const SUN_DIR = new THREE.Vector3(Math.cos(el) * Math.sin(az), Math.sin(el), -Math.cos(el) * Math.cos(az)).normalize();
    const sun = new THREE.DirectionalLight(linear(LIGHT.sun), 7.5);
    sun.shadow.bias = -0.0004;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 1600;
    scene.add(sun, sun.target);
    const fill = new THREE.DirectionalLight(linear(LIGHT.fill), 1.6);
    fill.position.set(-0.292, 0.892, -0.344);
    scene.add(fill);
    const hemi = new THREE.HemisphereLight(linear(LIGHT.ambient), linear([0.12, 0.13, 0.08]), 1.5);
    scene.add(hemi);

    /* --- Cielo + reflejo para el agua --- */
    const skyMat = makeSky(SUN_DIR);
    const sky = new THREE.Mesh(new THREE.SphereGeometry(9000, 48, 24), skyMat);
    sky.renderOrder = -1;
    sky.frustumCulled = false;
    scene.add(sky);
    // En Blender el agua refleja el "mundo" azul (no el degradado compuesto): por eso el río se ve azul
    const envScene = new THREE.Scene();
    const amb = LIGHT.ambient;
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(100, 48, 24), makeSky(SUN_DIR, {
        top: amb.map((v) => v * 0.8), mid: amb, hor: [0.52, 0.68, 0.86], fog: [0.52, 0.68, 0.86]
    }, false)));
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envMap = pmrem.fromScene(envScene, 0, 0.1, 500).texture;
    pmrem.dispose();

    /* --- Zonas, materiales, sombras, instancias y descarte por distancia --- */
    const zones = [];
    const flocks = [];
    const cullables = [];
    let water = null;
    const NO_CAST = /^(Rio_Agua|Colinas|Terreno|Dosel_Relleno|Rayo_Luz|Muro_Follaje)/;
    const prepared = new Set();
    const prep = (mat) => {
        if (prepared.has(mat)) return;
        prepared.add(mat);
        if (!mat.onBeforeCompile || mat.onBeforeCompile === THREE.Material.prototype.onBeforeCompile) mat.onBeforeCompile = patchFog;
        if (mat.name === 'R_Rio') {
            water = mat;
            mat.envMap = envMap; mat.envMapIntensity = 1.1;
            mat.roughness = 0.32;
        } else if (mat.name === 'R_rayo') {
            mat.transparent = true; mat.depthWrite = false; mat.blending = THREE.AdditiveBlending;
        }
    };

    for (const zone of [...gltf.scene.children]) {
        if (zone.userData.p_ini === undefined) continue;
        const isFlock = /^G_(Ruta_Vuelo|Ruta_Mirador)$/.test(zone.name);
        zone.traverse((o) => {
            if (!o.isMesh) return;
            const node = nodeOf(o, zone).name;
            prep(o.material);
            const kind = /^Guacamaya_Vuelo/.test(node) ? 'bird' : /^Mariposa_Morpho/.test(node) ? 'butterfly' : null;
            if (kind && !reduce.matches) o.material = flapMaterial(o.material, kind);
            const isRay = o.material.name === 'R_rayo';
            o.castShadow = !NO_CAST.test(node) && !isRay && o.material.name !== 'R_muro';
            o.receiveShadow = !isRay && !/^Colinas/.test(node);
        });
        instanceZone(zone);
        // terreno, dosel, río y colinas se ven siempre: no se descartan por distancia
        if (!/^G_(Mundo_|Horizonte)/.test(zone.name)) cullables.push(...collectCullables(zone));
        zones.push({ obj: zone, p0: zone.userData.p_ini, p1: Math.min(zone.userData.p_fin, HIDDEN_FROM[zone.name] ?? 1) });
        if (isFlock) flocks.push({ obj: zone, phase: flocks.length * 1.7 });
    }

    const meshes = [];
    scene.traverse((o) => { if (o.isMesh && o !== sky) meshes.push({ obj: o, pbr: o.material }); });
    const lambertCache = new Map();
    const lambertOf = (m) => { if (!lambertCache.has(m)) lambertCache.set(m, toLambert(m)); return lambertCache.get(m); };

    /* --- Tamaño y resolución --- */
    let tier = TIERS.high, tierName = 'high', dpr = tier.dpr, size = { w: 0, h: 0 }, portrait = 0;
    const PORTRAIT_TILT = THREE.MathUtils.degToRad(8);
    function resize(force = false) {
        const w = host.clientWidth, h = host.clientHeight;
        if (!force && w === size.w && h === size.h) return false;
        size = { w, h };
        renderer.setPixelRatio(dpr);
        renderer.setSize(w, h, false);
        const aspect = w / h;
        // 0 en panorámico (16:9) → 1 en el teléfono vertical
        portrait = Math.min(1, Math.max(0, (1.45 - aspect) / 0.95));
        // Mantiene los 73,7° horizontales de la lente de 24 mm, sin deformar en pantallas verticales
        const vfov = 2 * Math.atan(0.75 / aspect);
        camera.aspect = aspect;
        camera.fov = THREE.MathUtils.radToDeg(Math.min(1.25, Math.max(0.7984, vfov)));
        camera.updateProjectionMatrix();
        return true;
    }

    /* --- Sombras que siguen a la cámara (con ajuste a la rejilla de texeles) --- */
    const lightBasis = new THREE.Matrix4().lookAt(SUN_DIR, new THREE.Vector3(), new THREE.Vector3(0, 1, 0));
    const lightBasisInv = lightBasis.clone().transpose();
    const fwd = new THREE.Vector3(), focus = new THREE.Vector3();
    let shadowSpan = 0;
    function placeShadow(p) {
        if (!sun.castShadow) return;
        // vuelo sobre el río: caja amplia · sendero y claro: caja cerrada y más nítida
        const span = THREE.MathUtils.lerp(230, 85, smooth(0.70, 0.80, p));
        camera.getWorldDirection(fwd);
        focus.copy(camera.position).addScaledVector(fwd, span * 0.55).applyMatrix4(lightBasisInv);
        const texel = (span * 2) / sun.shadow.mapSize.x;
        focus.x = Math.round(focus.x / texel) * texel;
        focus.y = Math.round(focus.y / texel) * texel;
        focus.applyMatrix4(lightBasis);
        sun.target.position.copy(focus);
        sun.position.copy(focus).addScaledVector(SUN_DIR, 800);
        sun.target.updateMatrixWorld();
        if (Math.abs(span - shadowSpan) > 0.5) {
            shadowSpan = span;
            const c = sun.shadow.camera;
            c.left = -span; c.right = span; c.top = span; c.bottom = -span;
            c.updateProjectionMatrix();
            sun.shadow.normalBias = texel * 1.5;
        }
    }

    /* --- Niveles de calidad --- */
    function applyTier(name) {
        tierName = name; tier = TIERS[name];
        dpr = tier.dpr;
        resize(true);
        sun.castShadow = !!tier.shadows;
        renderer.shadowMap.type = tier.shadows === 'hard' ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
        if (tier.shadows && sun.shadow.mapSize.x !== tier.shadowSize) {
            sun.shadow.mapSize.set(tier.shadowSize, tier.shadowSize);
            sun.shadow.map?.dispose(); sun.shadow.map = null;
            shadowSpan = 0;
        }
        for (const m of meshes) m.obj.material = tier.lambert ? lambertOf(m.pbr) : m.pbr;
        for (const m of meshes) m.obj.material.needsUpdate = true;
        // sin MSAA de sobra, el vidrio del menú tampoco necesita desenfoque en el nivel bajo
        root.classList.toggle('tour-lite', name === 'low' || name === 'minimal');
        root.classList.toggle('tour-hq', name === 'high');
        lastP = -1; needsRender = true; renderer.shadowMap.needsUpdate = true;
        if (window.PYTOUR) window.PYTOUR.tier = name;
    }

    // Visibilidad por zona (rango del scroll) + descarte de objetos pequeños lejanos
    function stage(p, sw = { x: 0, y: 0 }) {
        for (const z of zones) z.obj.visible = p >= z.p0 - ZONE_MARGIN && p <= z.p1 + ZONE_MARGIN;
        const t = Math.min(duration, Math.max(0, p * duration));
        camera.position.fromArray(posAt.evaluate(t));
        baseQ.fromArray(rotAt.evaluate(t));
        // En pantallas verticales el mirador se encuadra más abajo: el dosel sale por arriba
        // y el logo queda sobre el cielo (se suelta al bajar del mirador)
        const tilt = portrait * PORTRAIT_TILT * (1 - smooth(0, 0.12, p));
        swayE.set(-sw.y * 0.022 - tilt, -sw.x * 0.04, 0);
        camera.quaternion.copy(baseQ).multiply(swayQ.setFromEuler(swayE));
        camera.updateMatrixWorld();
        sky.position.copy(camera.position);
        const k = tier.cull;
        for (const c of cullables) c.obj.visible = camera.position.distanceTo(c.center) - c.radius < c.max * k;
        SHARED.uFogSun.value.copy(SUN_DIR).transformDirection(camera.matrixWorldInverse);
    }

    // Costo real de un cuadro (CPU + GPU, con sombras recalculadas) en los tramos más pesados
    function benchmark() {
        const gl = renderer.getContext();
        let worst = 0;
        for (const p of BENCH_P) {
            stage(p); placeShadow(p);
            // dos cuadros de calentamiento: suben geometrías y texturas, y en Windows (ANGLE)
            // terminan de compilar los shaders en el primer dibujo real
            for (let i = 0; i < 2; i++) { renderer.shadowMap.needsUpdate = true; renderer.render(scene, camera); }
            gl.finish();
            const times = [];
            for (let i = 0; i < 5; i++) {
                const t0 = performance.now();
                renderer.shadowMap.needsUpdate = true;
                renderer.render(scene, camera);
                gl.finish();
                times.push(performance.now() - t0);
            }
            times.sort((a, b) => a - b);
            worst = Math.max(worst, times[2]);
        }
        return worst;
    }

    async function compile() {
        for (const z of zones) z.obj.visible = true;
        for (const c of cullables) c.obj.visible = true;
        try { await renderer.compileAsync(scene, camera); } catch (_) { /* compila al primer cuadro */ }
    }

    /* --- Ajuste automático en marcha: si va lento baja de nivel, y luego la resolución --- */
    let frameAvg = 16, slowFrames = 0, warmup = 90;
    function adapt(dtMs) {
        if (warmup > 0) { warmup--; return; }
        frameAvg += (dtMs - frameAvg) * 0.06;
        if (frameAvg < 34) { slowFrames = 0; return; }
        if (++slowFrames < 45) return;
        slowFrames = 0; warmup = 90; frameAvg = 16;
        if (tierName !== 'minimal') applyTier(ORDER[ORDER.indexOf(tierName) + 1]);
        else if (dpr > DPR_FLOOR + 0.01) { dpr = Math.max(DPR_FLOOR, dpr * 0.8); resize(true); }
    }

    /* --- Cuadro --- */
    let lastP = -1, lastRender = 0, lastSwayX = 0, lastSwayY = 0, needsRender = true, shadowTick = 0;
    function update(p, sw, dt, now, moving) {
        const resized = resize();
        const still = reduce.matches;
        const animate = tier.idle && !still;
        const moved = Math.abs(p - lastP) > 1e-6 || Math.abs(sw.x - lastSwayX) > 1e-5 || Math.abs(sw.y - lastSwayY) > 1e-5;
        // en reposo: nivel alto ~30 cuadros/s para el agua y las alas; medio y bajo no dibujan nada
        const due = animate && now - lastRender > 32;
        if (!(moved || resized || needsRender || due)) return animate;
        // nivel mínimo: mientras el scroll sigue se dibuja a lo sumo 12 veces por segundo
        if (tier.maxFps && moving && !resized && !needsRender && now - lastRender < 1000 / tier.maxFps) return animate;

        if (moving && dt < 0.09) adapt(dt * 1000);   // ignora tirones aislados (pestaña oculta, compilación)
        stage(p, sw);

        if (moved || resized || needsRender) {
            placeShadow(p);
            // nivel medio: la sombra se recalcula uno de cada tres cuadros mientras la cámara avanza
            shadowTick++;
            if (tierName !== 'medium' || !moving || shadowTick % 3 === 0) renderer.shadowMap.needsUpdate = true;
        }
        if (animate) {
            const s = now / 1000;
            SHARED.uTime.value = s;
            if (water?.normalMap) water.normalMap.offset.set(s * 0.004, -s * 0.012);
            for (const f of flocks) f.obj.position.set(Math.sin(s * 0.35 + f.phase) * 1.2, Math.sin(s * 0.8 + f.phase) * 0.7, 0);
        }

        renderer.render(scene, camera);
        lastP = p; lastSwayX = sw.x; lastSwayY = sw.y; lastRender = now; needsRender = false;
        return animate;
    }

    function ready() {
        resize(true);
        renderer.shadowMap.needsUpdate = true;
        needsRender = true;
        lastP = -1;
    }

    canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); host.classList.remove('is-ready'); });
    canvas.addEventListener('webglcontextrestored', () => { needsRender = true; host.classList.add('is-ready'); wake(); });

    // Para depurar desde la consola: PYTOUR.tier, PYTOUR.renderer.info.render
    window.PYTOUR = { renderer, scene, camera, zones, state, sun, water, gpu: gpuName, tier: tierName, applyTier, benchmark };
    return { scene, camera, update, ready, applyTier, compile, benchmark };
}

wake();
init();
