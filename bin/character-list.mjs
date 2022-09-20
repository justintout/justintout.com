#!node
import glob from 'glob-promise';
import { chromium } from '@playwright/test';
import replace from 'replace-in-file';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const charactersOn = async function(p) {
        await page.goto(`file://${p}`);
        const t = await page.evaluate(() => [...new Set(Array.from(document.querySelectorAll('*')).map(e => (e.innerText ?? '').replace(/\s/g,'').split('')).reduce((ac, c) => ac.concat(c), []))].join(''));
        return t.split('').filter(c => c !== '');
    }
    const files = await glob("dist/**.html", { realpath: true });
    for (let f of files) {
        try {
          const chars = (await charactersOn(f)).filter(c => c !== '').join('')
          console.log(`${f}: ${chars}`);
          const results = await replace({
            files: f,
            from: /&display=swap.*?">/g,
            to: `&display=swap&text=${chars}">`,
          });
          console.log(results);
        } catch(e) {
            console.log(e);
        }
    }
    // await server.close();
    await browser.close();
    process.exit(0);
})();
