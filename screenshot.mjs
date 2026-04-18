import { chromium } from 'playwright';

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage',
    '--use-gl=swiftshader','--enable-webgl','--enable-webgl2','--ignore-gpu-blocklist',
    '--disable-background-timer-throttling'],
  headless: true,
});
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

// Test: render pure THREE.js without React
await page.setContent(`<canvas id="c" style="width:100%;height:100vh;"></canvas>`);

const rendered = await page.evaluate(async () => {
  // Load THREE.js
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.min.js';
  document.head.appendChild(s);
  await new Promise(r => s.onload = r);

  const canvas = document.getElementById('c');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(800, 600);
  renderer.setClearColor(0x111111);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(65, 800/600, 0.1, 100);
  camera.position.set(0, 2, 5);
  camera.lookAt(0, 0, 0);

  // Bright box
  const geo = new THREE.BoxGeometry(2, 2, 2);
  const mat = new THREE.MeshStandardMaterial({ color: '#FF6B00', emissive: '#FF6B00', emissiveIntensity: 2 });
  scene.add(new THREE.Mesh(geo, mat));

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 1));
  scene.add(new THREE.PointLight(0xff6600, 3, 20));

  renderer.render(scene, camera);

  // Check pixels
  const ctx = document.createElement('canvas').getContext('2d');
  const data = renderer.getContext().readPixels ? 
    (() => {
      const gl = renderer.getContext();
      const buf = new Uint8Array(4);
      gl.readPixels(400, 300, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
      return { center: Array.from(buf) };
    })() : 'no readPixels';
  
  return data;
});

console.log('Rendered pixel:', JSON.stringify(rendered));
await page.screenshot({ path: '/tmp/three-test.png' });
await browser.close();
