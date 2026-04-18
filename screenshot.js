const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  console.log('Opening page...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 20000 });

  // Wait for the loading screen and 3D scene
  console.log('Waiting for scene...');
  await page.waitForTimeout(6000);
  await page.screenshot({ path: '/tmp/venue-loading.png', fullPage: false });
  console.log('Loading screen captured');

  // Wait longer for 3D to fully load
  await page.waitForTimeout(8000);
  await page.screenshot({ path: '/tmp/venue-scene.png', fullPage: false });
  console.log('Scene captured');

  await browser.close();
  console.log('Done');
})();
