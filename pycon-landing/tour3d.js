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
     para reducir las llamadas de dibujo.
   - Luz de atardecer del inventario: sol cálido con sombras, relleno frío,
     cielo degradado y bruma por distancia teñida hacia el sol.
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

const root = document.documentElement;
const host = document.getElementById('tour');
const canvas = document.getElementById('tour-canvas');
const statusEl = document.getElementById('tour-status');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const ease = (rate, dt) => 1 - Math.exp(-rate * dt);
const smooth = (a, b, v) => { const x = Math.min(1, Math.max(0, (v - a) / (b - a))); return x * x * (3 - 2 * x); };
const linear = (rgb) => new THREE.Color().setRGB(rgb[0], rgb[1], rgb[2], THREE.LinearSRGBColorSpace);

/* ------------------------------------------------------------------ */
/*  Aviso de carga (abajo a la izquierda, no bloquea la página)        */
/* ------------------------------------------------------------------ */
const MSG = {
    es: { loading: 'Cargando el recorrido 3D', preparing: 'Preparando la selva…', error: 'No se pudo cargar el recorrido 3D', nogl: 'Tu navegador no muestra 3D: usamos un fondo simple' },
    en: { loading: 'Loading the 3D journey', preparing: 'Preparing the rainforest…', error: 'The 3D journey could not be loaded', nogl: 'Your browser cannot show 3D: using a simple background' }
};
function setStatus(key, pct = null) {
    if (!statusEl) return;
    statusEl.querySelector('.tour-status__text').textContent = (MSG[root.lang] || MSG.es)[key];
    statusEl.style.setProperty('--p', pct == null ? 1 : pct.toFixed(3));
    statusEl.classList.toggle('is-error', key === 'error' || key === 'nogl');
    statusEl.classList.remove('is-done');
}
const hideStatus = (delay = 0) => setTimeout(() => statusEl?.classList.add('is-done'), delay);

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

    // El logo flota sobre la escena siguiendo al puntero
    const mx = still ? 0 : sway.x, my = still ? 0 : sway.y;
    for (const f of floaters) {
        const tx = mx * f.depth * 0.021 * innerWidth, ty = my * f.depth * 0.017 * innerHeight;
        f.el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
    }
    // --hero: 1 arriba de la landing → 0 al bajar (aclara el cielo detrás del logo)
    const hero = inView() ? 0 : 1 - smooth(0, innerHeight * 0.85, scrollY);
    if (Math.abs(hero - lastHero) > 0.002) { root.style.setProperty('--hero', hero.toFixed(3)); lastHero = hero; }

    const ambient = world ? world.update(state.cur, sway, dt, now, moving) : false;
    raf = moving || (ambient && !still) ? requestAnimationFrame(loop) : 0;
}

/* ------------------------------------------------------------------ */
/*  Calidad según el dispositivo (y se ajusta sola si va lento)        */
/* ------------------------------------------------------------------ */
const coarse = matchMedia('(pointer: coarse)').matches;
const smallScreen = Math.min(screen.width, screen.height) < 760;
const weak = (navigator.deviceMemory || 8) <= 4 || (navigator.hardwareConcurrency || 8) <= 4;
const Q = {
    dprMax: coarse || smallScreen ? 1 : Math.min(devicePixelRatio || 1, 1.5),
    dprMin: 0.7,
    shadows: !(coarse || smallScreen || weak),
    antialias: !(coarse || smallScreen) && (devicePixelRatio || 1) < 2
};

/* ------------------------------------------------------------------ */
/*  Materiales: bruma por distancia y aleteo                           */
/* ------------------------------------------------------------------ */
const SHARED = {
    uFogSun: { value: new THREE.Vector3() },                 // dirección del sol en espacio de vista
    uFogWarm: { value: linear([1.1, 0.77, 0.44]) },          // la bruma se calienta mirando al sol
    uTime: { value: 0 }
};
// Bruma como en los renders de Blender: 1 - e^(-d / 2400 m), máximo 92 %
const FOG_GLSL = /* glsl */`
#ifdef USE_FOG
    float fogF = 0.92 * (1.0 - exp(-fogDensity * vFogDepth));
    float toSun = max(dot(normalize(-vViewPosition), uFogSun), 0.0);
    vec3 fogC = mix(fogColor, uFogWarm, pow(toSun, 5.0) * 0.8);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogC, fogF);
#endif`;
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

/* ------------------------------------------------------------------ */
/*  Cielo degradado con halo solar (mismo cálculo que preview.py)      */
/* ------------------------------------------------------------------ */
function makeSky(sunDir, colors = {}) {
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

async function init() {
    if (!host || !canvas) return;
    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: Q.antialias, powerPreference: 'high-performance', stencil: false });
    } catch (err) {
        setStatus('nogl'); hideStatus(6000); return;
    }
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;   // como la vista "Standard" de Blender
    renderer.setClearColor(linear(LIGHT.fog));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
    await new Promise((r) => setTimeout(r, 30));   // deja pintar el aviso antes de preparar la escena

    world = buildWorld(renderer, gltf);
    try { await renderer.compileAsync(world.scene, world.camera); } catch (_) { /* compila al primer cuadro */ }
    world.ready();
    host.classList.add('is-ready');
    hideStatus(400);
    draco.dispose();
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
    sun.castShadow = Q.shadows;
    sun.shadow.mapSize.set(2048, 2048);
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
    })));
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envMap = pmrem.fromScene(envScene, 0, 0.1, 500).texture;
    pmrem.dispose();

    /* --- Zonas, materiales, sombras e instancias --- */
    const zones = [];
    const flocks = [];
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
        zones.push({ obj: zone, p0: zone.userData.p_ini, p1: zone.userData.p_fin });
        if (isFlock) flocks.push({ obj: zone, phase: flocks.length * 1.7 });
    }

    /* --- Tamaño y resolución --- */
    let dpr = Q.dprMax, size = { w: 0, h: 0 }, portrait = 0;
    const PORTRAIT_TILT = THREE.MathUtils.degToRad(8);
    function resize(force = false) {
        const w = host.clientWidth, h = host.clientHeight;
        if (!force && w === size.w && h === size.h) return false;
        size = { w, h };
        renderer.setPixelRatio(dpr);
        renderer.setSize(w, h, false);
        const aspect = w / h;
        portrait = Math.min(1, Math.max(0, (1 - aspect) / 0.5));
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

    /* --- Ajuste automático de calidad --- */
    let frameAvg = 16, slowFrames = 0, warmup = 90;
    function adapt(dtMs) {
        if (warmup > 0) { warmup--; return; }
        frameAvg += (dtMs - frameAvg) * 0.06;
        if (frameAvg < 34) { slowFrames = 0; return; }
        if (++slowFrames < 50) return;
        slowFrames = 0; warmup = 60;
        if (dpr > Q.dprMin + 0.01) { dpr = Math.max(Q.dprMin, dpr * 0.8); resize(true); }
        else if (sun.castShadow) { sun.castShadow = false; scene.traverse((o) => { if (o.material) o.material.needsUpdate = true; }); }
    }

    /* --- Cuadro --- */
    let lastP = -1, lastRender = 0, lastSwayX = 0, lastSwayY = 0, needsRender = true;
    function update(p, sw, dt, now, moving) {
        const resized = resize();
        const still = reduce.matches;
        const moved = Math.abs(p - lastP) > 1e-6 || Math.abs(sw.x - lastSwayX) > 1e-5 || Math.abs(sw.y - lastSwayY) > 1e-5;
        // en reposo basta con ~30 cuadros por segundo para el agua y las alas
        const due = !still && now - lastRender > 32;
        if (!(moved || resized || needsRender || due)) return !still;

        if (moving && dt < 0.09) adapt(dt * 1000);   // ignora tirones aislados (pestaña oculta, compilación)
        if (Math.abs(p - lastP) > 1e-6) {
            for (const z of zones) z.obj.visible = p >= z.p0 - ZONE_MARGIN && p <= z.p1 + ZONE_MARGIN;
        }
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

        if (moved || resized || needsRender) { placeShadow(p); renderer.shadowMap.needsUpdate = true; }
        SHARED.uFogSun.value.copy(SUN_DIR).transformDirection(camera.matrixWorldInverse);

        if (!still) {
            const s = now / 1000;
            SHARED.uTime.value = s;
            if (water?.normalMap) water.normalMap.offset.set(s * 0.004, -s * 0.012);
            for (const f of flocks) f.obj.position.set(Math.sin(s * 0.35 + f.phase) * 1.2, Math.sin(s * 0.8 + f.phase) * 0.7, 0);
        }

        renderer.render(scene, camera);
        lastP = p; lastSwayX = sw.x; lastSwayY = sw.y; lastRender = now; needsRender = false;
        return !still;
    }

    function ready() {
        resize(true);
        for (const z of zones) z.obj.visible = true;
        renderer.shadowMap.needsUpdate = true;
        needsRender = true;
        lastP = -1;
    }

    canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); host.classList.remove('is-ready'); });
    canvas.addEventListener('webglcontextrestored', () => { needsRender = true; host.classList.add('is-ready'); wake(); });

    // Para depurar desde la consola: PYTOUR.renderer.info.render
    window.PYTOUR = { renderer, scene, camera, zones, state, quality: Q, sun, fill, hemi, sky: skyMat, water };
    return { scene, camera, update, ready };
}

wake();
init();
