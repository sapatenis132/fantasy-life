import {readFile,writeFile,mkdir} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
await mkdir(new URL('docs/vida-preview/',root),{recursive:true});
const html=(await readFile(new URL('docs/index.html',root),'utf8')).replaceAll('fantasy-life-vida-1.4','fantasy-life-preview-1.4-hud1').replaceAll('fantasy-life-agencia-1.3','fantasy-life-preview-legado-1.3').replaceAll('href="./legado/"','href="../legado/"');
await writeFile(new URL('docs/vida-preview/jogo.html',root),html);
console.log('Revisão com save isolado preparada em docs/vida-preview/.');
