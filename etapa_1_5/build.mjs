import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
const root=new URL('../',import.meta.url),read=p=>readFile(new URL(p,root),'utf8');
const modules=[
 ['contract','etapa_1_3/src/contrato.mjs','copy,integer,check,id,jsonData,compile,eligible,readStat,person,availableParticipants'],
 ['kernel','etapa_1_3/src/motor.mjs','createEngine'],
 ['legacy','etapa_1_3/content/fatia.mjs','catalog,newLife'],
 ['world14','etapa_1_4/src/world.mjs','PLACES,EDGES,SKILLS,ORIGINS,RACES,TRAITS,GIFTS,path,calendar,npcPlace'],
 ['content14','etapa_1_4/src/content.mjs','catalog'],
 ['life14','etapa_1_4/src/life.mjs','engine,load'],
 ['world','etapa_1_5/src/world.mjs','PLACES,EDGES,SKILLS,ORIGINS,RACES,TRAITS,GIFTS,path,calendar,npcPlace,ACTORS,contextFor,edgeOpen'],
 ['content','etapa_1_5/src/content.mjs','catalog'],
 ['life','etapa_1_5/src/life.mjs','engine,legacyEngine,createLife,act,choose,travel,resume,stopRoute,abandon,wait,save,load,migrateLegacy,view,trackGoal'],
 ['ui','etapa_1_5/src/ui.mjs','']
];
const absolute={'./contrato.mjs':'contract','../../etapa_1_3/src/contrato.mjs':'contract','../../etapa_1_3/src/motor.mjs':'kernel','../../etapa_1_3/content/fatia.mjs':'legacy','../../etapa_1_4/src/world.mjs':'world14','../../etapa_1_4/src/content.mjs':'content14','../../etapa_1_4/src/life.mjs':'life14'};
let script="(()=>{'use strict';\n";
for(const[name,file,returns]of modules){let s=await read(file);const suffix=file.startsWith('etapa_1_4/')?'14':'';s=s.replace(/^import \{([^}]+)\} from '([^']+)';/gm,(_,names,path)=>{const target=absolute[path]||({'./world.mjs':'world'+suffix,'./content.mjs':'content'+suffix,'./life.mjs':'life'+suffix})[path];if(!target)throw Error(`Importação desconhecida: ${path}`);return `const {${names.replace(/\bas\b/g,':')}}=${target};`;}).replace(/^export \{[^}]+\};?$/gm,'').replace(/^export (?=(?:const|function)\b)/gm,'');script+=`const ${name}=(()=>{\n${s}\nreturn {${returns}};})();\n`;}
script+='})();';if(/^(import|export) /m.test(script))throw Error('Módulo não empacotado.');
const html=(await read('etapa_1_5/template.html')).replace('<!--APP_SCRIPT-->',()=>`<script>\n${script.replace(/<\/script/gi,'<\\/script')}\n</script>`);
await writeFile(new URL('etapa_1_5/Fantasy_Life_Moinho.html',root),html);
await mkdir(new URL('docs/legado-0-5/',root),{recursive:true});try{await access(new URL('docs/legado-0-5/index.html',root));}catch{const old=(await read('etapa_1_4/Fantasy_Life_Ponteclara.html')).replaceAll('fantasy-life-vida-1.4','fantasy-life-vida-1.4-antes-0.6').replaceAll('href="./legado/"','href="../legado/"');await writeFile(new URL('docs/legado-0-5/index.html',root),old);}
await writeFile(new URL('docs/index.html',root),html);console.log('Moinho Afogado 0.6.0: build gerado e cópia 0.5.2 preservada.');
