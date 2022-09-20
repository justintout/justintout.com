#!npx ts-node
import path from 'path';
import glob from 'glob';
import puppeteer from 'puppeteer';
//@ts-ignore
import replace from 'replace-in-file';
import Bundler, { ParcelOptions } from 'parcel-bundler';

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    const charactersOn = async function(p: string): Promise<string[]> {
        await page.goto(`localhost:1234/${p}`);
        //@ts-ignore
        const text: string = await page.$eval('*', (el) => el.innerText);
        return text.split('');   
    }

    glob("src/**.html", async (_, files) => {
        console.log(files.map(x=>path.basename(x)));
        const bundlerOptions: ParcelOptions = {
            // @ts-ignore
            logLevel: 4,
        }
        const bundler = new Bundler(files, bundlerOptions);
        const server = await bundler.serve(1234, false, 'localhost');
        for (let p of files.map(x=>path.basename(x))) {
            try {
                const letterSet = new Set<string>();
                const letters = await charactersOn(path.basename(p));
                letters.forEach(l => letterSet.add(l));
                const s = Array.from(letterSet.values())
                    .join('')
                    .replace(/\s/g, '');
                const results = await replace({
                    files: `dist/${p}`,
                    from: /&display=swap/,
                    to: `&display=swap&text=${s}`
                });
                console.log(results);
            } catch (e) {
                console.log(e);
            }
        }
        server.close();
        process.exit(0);
    });
})();