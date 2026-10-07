// "After you tip" — scroll-driven Three.js scene.
// The props were modelled in Blender (tools/models.py) and exported as one GLB.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const GREEN = 0x39ff13;
const GAP = 9; // metres between stations
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const ease = (x) => { x = clamp01(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const range = (t, a, b) => clamp01((t - a) / (b - a));
const back = (x) => { x = clamp01(x); const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };

// Each chapter: the props before and after
const CHAPTERS = [
  { before: ['mattress', 'springs'], after: 'steelBale' },
  { before: ['polyPile'], after: 'polyBlock' },
  { before: ['boxes'], after: 'cardBale' },
  { before: ['sofa'], after: null },
  { before: ['residualPile'], after: 'residualCube' },
];

function fadeable(obj) {
  const mats = [];
  obj.traverse((o) => {
    if (o.isMesh) {
      o.material = o.material.clone();
      o.material.transparent = true;
      o.castShadow = false;
      mats.push(o.material);
    }
  });
  obj.userData.mats = mats;
  return obj;
}
function setOpacity(obj, a) {
  obj.visible = a > 0.01;
  for (const m of obj.userData.mats || []) { m.opacity = a; m.depthWrite = a > 0.98; }
}

function blobShadow(w, d) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 4, 64, 64, 64);
  grd.addColorStop(0, 'rgba(0,0,0,.75)');
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.005;
  return m;
}

function floorTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = '#1b1b1a'; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 2600; i++) {
    const v = 20 + Math.random() * 18;
    g.fillStyle = `rgba(${v},${v},${v - 1},${Math.random() * 0.5})`;
    g.fillRect(Math.random() * 512, Math.random() * 512, 1 + Math.random() * 3, 1 + Math.random() * 3);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(24, 6);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function boxEdges(w, h, d, color, opacity = 0.9) {
  const geo = new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d));
  const m = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
  m.position.y = h / 2;
  return m;
}

function houseOutline() {
  const w = 2.8, h = 1.7, peak = 2.75, d = 2.2;
  const pts = [];
  const front = [[-w / 2, 0], [w / 2, 0], [w / 2, h], [0, peak], [-w / 2, h], [-w / 2, 0]];
  for (const z of [-d / 2, d / 2]) {
    for (let i = 0; i < front.length - 1; i++) pts.push(new THREE.Vector3(front[i][0], front[i][1], z), new THREE.Vector3(front[i + 1][0], front[i + 1][1], z));
  }
  for (const [x, y] of front.slice(0, 5)) pts.push(new THREE.Vector3(x, y, -d / 2), new THREE.Vector3(x, y, d / 2));
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  return new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: GREEN, transparent: true, opacity: 0 }));
}

function sparks(count = 160) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3), vel = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2, r = 0.6 + Math.random() * 1.2;
    vel[i * 3] = Math.cos(a) * r; vel[i * 3 + 1] = 0.4 + Math.random() * 1.6; vel[i * 3 + 2] = Math.sin(a) * r;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: GREEN, size: 0.035, transparent: true, opacity: 0, depthWrite: false }));
  pts.userData.vel = vel;
  pts.userData.update = (k) => {
    const p = geo.attributes.position.array;
    for (let i = 0; i < count; i++) {
      p[i * 3] = vel[i * 3] * k * 1.2;
      p[i * 3 + 1] = 0.5 + vel[i * 3 + 1] * k - 1.4 * k * k;
      p[i * 3 + 2] = vel[i * 3 + 2] * k * 1.2;
    }
    geo.attributes.position.needsUpdate = true;
    pts.material.opacity = k > 0 && k < 1 ? Math.sin(k * Math.PI) * 0.9 : 0;
  };
  return pts;
}

export async function start(sec) {
  const canvas = sec.querySelector('canvas');
  const label = sec.querySelector('[data-journey-label]');
  const steps = [...sec.querySelectorAll('.jstep')];
  const dots = [...sec.querySelectorAll('[data-goto]')];
  const intro = sec.querySelector('.journey-intro');
  const scrollEl = sec.querySelector('.journey-scroll');
  const mobile = matchMedia('(max-width: 760px)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x060606);
  scene.fog = new THREE.Fog(0x060606, 9, 26);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;

  const camera = new THREE.PerspectiveCamera(mobile ? 50 : 38, 1, 0.1, 80);

  // light: cool overhead key, warm fill, green rim per station
  scene.add(new THREE.HemisphereLight(0xdfe6ea, 0x0b0b0b, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(4, 9, 6);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffe7cc, 0.6);
  fill.position.set(-6, 3, 4);
  scene.add(fill);

  // floor, bay lines, overhead strip lights
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(120, 30), new THREE.MeshStandardMaterial({ map: floorTexture(), roughness: 0.92, metalness: 0 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(GAP * 2, 0, 0);
  scene.add(floor);
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xe9e9e4, transparent: true, opacity: 0.55 });
  const dashMat = new THREE.MeshBasicMaterial({ color: GREEN, transparent: true, opacity: 0.7 });
  for (let x = -10; x < GAP * 5 + 10; x += 1.4) {
    const d = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.08), dashMat);
    d.rotation.x = -Math.PI / 2; d.position.set(x, 0.006, 2.6);
    scene.add(d);
  }
  for (let i = 0; i < CHAPTERS.length; i++) {
    for (const s of [-1, 1]) {
      const l = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 4.2), lineMat);
      l.rotation.x = -Math.PI / 2; l.position.set(i * GAP + s * 2.4, 0.006, 0.4);
      scene.add(l);
    }
  }
  const stripMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  for (let x = -8; x < GAP * 5 + 8; x += 4) {
    for (const z of [-3, 1.5]) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.04, 0.16), stripMat);
      s.position.set(x, 6.5, z);
      scene.add(s);
    }
  }

  try { await document.fonts.load('900 64px Archivo'); } catch { /* system font fallback */ }
  // back wall: a dim banner run, like the hall's own, kept low-key so the props lead
  const wallTex = (() => {
    const g0 = document.createElement('canvas').getContext('2d');
    const font = '900 86px Archivo, Arial, sans-serif';
    g0.font = font;
    if ('fontStretch' in g0) g0.fontStretch = 'expanded';
    const words = [['LOVE', '#ffffff'], ['NOT', '#39ff13'], ['LANDFILL.', '#ffffff'], ['RECYCLE', '#39ff13'], ['NORTH GEELONG', '#ffffff']];
    const gapW = 60;
    const seq = words.reduce((w, [t]) => w + g0.measureText(t).width + gapW, 0);
    const c = document.createElement('canvas');
    c.width = Math.ceil(seq); c.height = 200;
    const g = c.getContext('2d');
    g.fillStyle = '#0b0b0b'; g.fillRect(0, 0, c.width, c.height);
    g.font = font;
    if ('fontStretch' in g) g.fontStretch = 'expanded';
    g.textBaseline = 'middle';
    let x = gapW / 2;
    for (const [w, col] of words) { g.fillStyle = col; g.fillText(w, x, 104); x += g.measureText(w).width + gapW; }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.RepeatWrapping;
    const wallW = 80, wallH = 0.9;
    t.repeat.set(wallW / (wallH * c.width / c.height), 1);
    return { t, wallW, wallH };
  })();
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(wallTex.wallW, wallTex.wallH), new THREE.MeshBasicMaterial({ map: wallTex.t, color: 0x4a4a4a, fog: true }));
  wall.position.set(GAP * 2, 2.2, -7);
  scene.add(wall);
  const wallBody = new THREE.Mesh(new THREE.PlaneGeometry(80, 12), new THREE.MeshBasicMaterial({ color: 0x090909 }));
  wallBody.position.set(GAP * 2, 3, -7.02);
  scene.add(wallBody);

  // load props
  label.textContent = 'Loading 3D…';
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync((window.__BASE || '/') + 'models/journey.min.glb');
  const P = {};
  for (const name of ['mattress', 'springs', 'steelBale', 'polyPile', 'polyBlock', 'boxes', 'cardBale', 'sofa', 'residualPile', 'residualCube']) {
    const o = gltf.scene.getObjectByName(name);
    if (!o) throw new Error('missing prop ' + name);
    o.removeFromParent();
    o.position.set(0, 0, 0);
    fadeable(o);
    P[name] = o;
  }

  const stations = CHAPTERS.map((c, i) => {
    const g = new THREE.Group();
    g.position.set(i * GAP, 0, 0);
    scene.add(g);
    const turn = new THREE.Group();
    g.add(turn);
    c.before.forEach((n) => turn.add(P[n]));
    if (c.after) turn.add(P[c.after]);
    const rim = new THREE.PointLight(GREEN, 0, 7, 1.6);
    rim.position.set(-1.5, 1.6, -2.2);
    g.add(rim);
    const shadow = blobShadow(3.4, 2.4);
    g.add(shadow);
    const fx = sparks();
    g.add(fx);
    return { g, turn, rim, fx, shadow };
  });

  // chapter-specific helpers
  const containers = new THREE.Group();
  for (let k = 0; k < 3; k++) {
    const e = boxEdges(2.42, 1.04, 0.98, 0xffffff, 0.55);
    e.position.z = (k - 1) * 1.08;
    containers.add(e);
  }
  containers.position.set(0, 0, -0.1);
  stations[1].g.add(containers);
  const ghost = boxEdges(1.51, 0.95, 1.05, GREEN, 0);
  stations[4].g.add(ghost);
  const house = houseOutline();
  house.position.set(3.0, 0, -0.2);
  stations[3].g.add(house);

  // ---------------------------------------------------------- scroll → state
  let progress = 0, target = 0, size = [0, 0];
  const N = CHAPTERS.length;
  const INTRO = 0.08;

  function measure() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (w === size[0] && h === size[1]) return;
    size = [w, h];
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  function readScroll() {
    const r = sec.getBoundingClientRect();
    const total = sec.offsetHeight - innerHeight;
    target = clamp01(-r.top / Math.max(1, total));
  }

  const camPos = new THREE.Vector3(), camLook = new THREE.Vector3();
  function frameFor(i, t) {
    const portrait = camera.aspect < 0.9;
    const x = i * GAP;
    const dist = portrait ? 6.2 : 4.5;
    const swing = (t - 0.5) * 0.8;
    const extraX = i === 3 ? ease(range(t, 0.3, 0.8)) * 2.6 : 0; // follow the couch
    const pullBack = i === 1 ? (1 - ease(range(t, 0.25, 0.7))) * 1.6 : 0; // see the containers first
    camPos.set(x + 0.8 + swing * (portrait ? 0.5 : 1) + extraX, (portrait ? 3.4 : 1.85) + pullBack * 0.5, dist + pullBack);
    camLook.set(x + extraX + (portrait ? 0 : -1.45), portrait ? -1.1 : 0.75, 0);
  }

  function apply(p, time) {
    const q = clamp01((p - INTRO) / (1 - INTRO)) * N;
    const i = Math.min(N - 1, Math.floor(q));
    const t = q - i;
    intro && intro.classList.toggle('out', p > INTRO * 0.6);
    const ti = Math.min(N - 1, Math.floor(q + 0.12));
    steps.forEach((s, k) => {
      s.classList.toggle('on', p > INTRO * 0.6 && k === ti);
      s.classList.toggle('before', k > ti);
      s.classList.toggle('after', k < ti);
    });
    dots.forEach((d, k) => d.classList.toggle('on', k === ti));

    // camera: blend from this chapter towards the next over the last 25%
    frameFor(i, t);
    const a = camPos.clone(), b = camLook.clone();
    if (i < N - 1 && t > 0.78) {
      const k = ease(range(t, 0.78, 1));
      frameFor(i + 1, 0);
      a.lerp(camPos, k); b.lerp(camLook, k);
    }
    if (p < INTRO) {
      frameFor(0, 0);
      const k = ease(p / INTRO);
      a.copy(camPos).add(new THREE.Vector3(-2.5 * (1 - k), 1.2 * (1 - k), 2.5 * (1 - k)));
      b.copy(camLook);
    }
    camera.position.copy(a);
    camera.lookAt(b);

    // per-station animation; stations not near the camera are left at rest
    stations.forEach((s, k) => {
      const tt = k < i ? 1 : k > i ? 0 : t;
      s.turn.rotation.y = -0.35 + Math.sin(time * 0.25 + k) * 0.06 + (k === i ? (t - 0.5) * 0.5 : 0);
      s.rim.intensity = k === i ? 6 * Math.sin(Math.PI * clamp01(t * 1.1)) + 2 : 0.5;
      const burst = range(tt, 0.45, 0.8);
      s.fx.userData.update(k === i ? burst : 0);
      animateStation(k, tt);
    });
  }

  function animateStation(k, t) {
    if (k === 0) {
      // mattress lifts away, springs compress into a bale
      const lift = ease(range(t, 0.15, 0.42));
      P.mattress.position.y = lift * 1.4;
      P.mattress.rotation.z = lift * 0.15;
      setOpacity(P.mattress, 1 - lift);
      const squash = ease(range(t, 0.45, 0.68));
      setOpacity(P.springs, lift > 0 ? 1 - range(t, 0.6, 0.7) : 0.0);
      P.springs.scale.set(1 - squash * 0.42, 1 + squash * 2.6, 1 - squash * 0.38);
      const grow = back(range(t, 0.6, 0.78));
      setOpacity(P.steelBale, range(t, 0.6, 0.68));
      P.steelBale.scale.setScalar(0.55 + 0.45 * grow);
    } else if (k === 1) {
      const s = ease(range(t, 0.28, 0.66));
      P.polyPile.scale.setScalar(1 - s * 0.82);
      setOpacity(P.polyPile, 1 - range(t, 0.55, 0.66));
      containers.scale.set(1 - s * 0.68, 1 - s * 0.55, 1 - s * 0.84);
      containers.children.forEach((c) => (c.material.opacity = 0.55 * (1 - range(t, 0.58, 0.7))));
      const g = back(range(t, 0.6, 0.78));
      setOpacity(P.polyBlock, range(t, 0.6, 0.66));
      P.polyBlock.scale.setScalar(0.5 + 0.5 * g);
    } else if (k === 2) {
      const s = ease(range(t, 0.25, 0.6));
      P.boxes.scale.set(1 - s * 0.45, 1 - s * 0.85, 1 - s * 0.35);
      setOpacity(P.boxes, 1 - range(t, 0.52, 0.62));
      const g = back(range(t, 0.55, 0.75));
      setOpacity(P.cardBale, range(t, 0.55, 0.62));
      P.cardBale.scale.set(1, 0.4 + 0.6 * g, 1);
    } else if (k === 3) {
      const m = ease(range(t, 0.3, 0.8));
      P.sofa.position.set(m * 3.0, Math.sin(m * Math.PI) * 0.45, -0.2 * m);
      P.sofa.scale.setScalar(1 - m * 0.18);
      house.material.opacity = ease(range(t, 0.2, 0.45)) * 0.95;
      stations[3].shadow.position.x = m * 3.0;
    } else if (k === 4) {
      const s = ease(range(t, 0.28, 0.62));
      P.residualPile.scale.set(1 - s * 0.55, 1 - s * 0.4, 1 - s * 0.45);
      setOpacity(P.residualPile, 1 - range(t, 0.55, 0.64));
      ghost.material.opacity = range(t, 0.3, 0.5) * 0.9;
      const g = back(range(t, 0.56, 0.74));
      setOpacity(P.residualCube, range(t, 0.56, 0.62));
      P.residualCube.scale.setScalar(0.6 + 0.4 * g);
    }
  }

  // initial state
  setOpacity(P.springs, 0);
  ['steelBale', 'polyBlock', 'cardBale', 'residualCube'].forEach((n) => setOpacity(P[n], 0));

  dots.forEach((d) => d.addEventListener('click', () => {
    const k = Number(d.dataset.goto);
    const total = sec.offsetHeight - innerHeight;
    const p = INTRO + (1 - INTRO) * ((k + 0.7) / N);
    scrollTo({ top: sec.offsetTop + p * total, behavior: 'smooth' });
  }));

  let visible = false, raf = 0;
  const clock = new THREE.Clock();
  function loop() {
    raf = 0;
    if (!visible) return;
    measure();
    readScroll();
    progress += (target - progress) * 0.12;
    if (Math.abs(target - progress) < 0.0004) progress = target;
    apply(progress, clock.getElapsedTime());
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }
  new IntersectionObserver((ents) => {
    visible = ents.some((e) => e.isIntersecting);
    if (visible && !raf) raf = requestAnimationFrame(loop);
  }).observe(sec);
  addEventListener('resize', () => { size = [0, 0]; });

  label.textContent = 'Scroll to follow it through · Modelled in Blender';
  readScroll();
  progress = target;
  measure();
  apply(progress, 0);
  renderer.render(scene, camera);
  if (scrollEl) scrollEl.dataset.ready = '1';
}
