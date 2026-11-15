import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';

const browser = await chromium.launch({ channel: 'chrome' });
const results = [];
try {
  for (const [stage, port] of [['before', 4173], ['after', 4174]]) {
    for (const [width, height] of [[1280,720], [1920,1080], [390,844]]) {
      const page = await browser.newPage({ viewport: { width, height }, locale: 'ja-JP', reducedMotion: 'reduce' });
      const origin = 'http://127.0.0.1:' + port;
      await page.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
      await page.goto(origin);
      await page.evaluate(async () => {
        const { createGame, parseSave, serializeGame } = await import('/src/engine.js?v=0.6.140');
        const { writeStoredGame } = await import('/src/save-storage.js?v=0.6.140');
        const game = createGame();
        game.settings.paused = true;
        const jobs = ['chop_wood', 'quarry_stone', 'gather_food', 'chop_wood', 'quarry_stone'];
        game.run.queue = jobs.map((id, idx) => ({ id, count: 2, kind:'action', goalId:idx + 1 }));
        game.run.queueSeq = jobs.length;
        if (parseSave(serializeGame(game))?.run?.queue?.length !== jobs.length) throw Error('Invalid dashboard QA save');
        writeStoredGame(localStorage, game);
      });
      await page.reload();
      await page.locator('[data-title-action="continue"]').click();
      await page.locator('.village-dashboard').waitFor({ state: 'visible' });
      await page.locator('[data-village-queue] li').nth(4).waitFor({ state: 'attached' });
      await page.evaluate(() => document.fonts.ready);
      const enemy = page.locator('[data-village-enemy-image]');
      await enemy.evaluate(img => img.decode());
      const prefix = stage + '-' + width + 'x' + height;
      await page.screenshot({ path: 'dashboard-evidence/' + prefix + '.png', fullPage: width < 960 });
      const result = await page.evaluate(() => {
        const selectors = ['.village-landscape', '[data-village-enemy-image]', '[data-village-enemy]', '[data-village-equip]', '.village-queue-heading', '.village-queue-heading button', '[data-village-queue] li:first-child', '[data-village-queue] li:nth-child(5)', '[data-village-queue] ~ button'];
        const boxes = Object.fromEntries(selectors.map(selector => {
          const target = document.querySelector(selector);
          if (!target) return [selector, null];
          const r = target.getBoundingClientRect();
          let visible = r.width > 0 && r.height > 0 && r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1;
          for (let parent=target.parentElement; parent && visible; parent=parent.parentElement) {
            const style = getComputedStyle(parent);
            const p = parent.getBoundingClientRect();
            if (style.overflowY !== 'visible' && (r.top < p.top - 1 || r.bottom > p.bottom + 1)) visible = false;
            if (style.overflowX !== 'visible' && (r.left < p.left - 1 || r.right > p.right + 1)) visible = false;
          }
          return [selector, { visible, x:r.x, y:r.y, width:r.width, height:r.height }];
        }));
        const documentElement = document.documentElement;
        return { boxes, horizontalOverflow: documentElement.scrollWidth - innerWidth, pageOverflow: documentElement.scrollHeight - innerHeight };
      });
      if (width >= 960) {
        const edit = page.locator('.village-queue-heading button');
        await edit.focus();
        await edit.press('Enter');
        await page.locator('#info-dialog[open] [data-info-panel="queue"]').waitFor({ state:'visible', timeout:5000 });
        result.queueKeyboard = true;
      }
      results.push({ prefix, ...result });
      await page.close();
    }
  }
} finally {
  await browser.close();
  await writeFile('dashboard-evidence/layout.json', JSON.stringify(results, null, 2));
}
const failures = results.filter(result => result.prefix.startsWith('after-') && (
  result.horizontalOverflow > 1 ||
  (!result.prefix.startsWith('after-390') && (result.pageOverflow > 1 || Object.values(result.boxes).some(box => !box?.visible)))
));
console.log(JSON.stringify(results));
if (failures.length) throw new Error('Viewport criteria failed: ' + failures.map(result => result.prefix).join(', '));
