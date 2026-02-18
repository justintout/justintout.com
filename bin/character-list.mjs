#!node
import { readFile } from 'fs/promises';
import glob from 'glob-promise';
import { load } from 'cheerio';
import { replaceInFile } from 'replace-in-file';

const charactersIn = async (filepath) => {
  const html = await readFile(filepath, 'utf-8');
  const $ = load(html);
  const text = $('body').text().replace(/\s/g, '');
  return [...new Set(text.split(''))].filter(c => c !== '');
};

const files = await glob("dist/**.html", { realpath: true });
for (const f of files) {
  try {
    const chars = (await charactersIn(f)).join('');
    console.log(`${f}: ${chars}`);
    const results = await replaceInFile({
      files: f,
      from: /&display=swap.*?">/g,
      to: `&display=swap&text=${chars}">`,
    });
    console.log(results);
  } catch (e) {
    console.log(e);
  }
}
