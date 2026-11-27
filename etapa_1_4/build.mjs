import {readFile,writeFile,mkdir,access,copyFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url),read=p=>readFile(new URL(p,root),'utf8');
const modules=[
 ['contract','etapa_1_3/src/contrato.mjs','copy,integer,check,id,jsonData,compile,eligible,readStat,person,availableParticipants'],
 ['kernel','etapa_1_3/src/motor.mjs','createEngine'],
 ['legacy','etapa_1_3/content/fatia.mjs','catalog,newLife'],
 ['world','etapa_1_4/src/world.mjs','PLACES,EDGES,SKILLS,ORIGINS,RACES,TRAITS,GIFTS,path,calendar,npcPlace'],
 ['content','etapa_1_4/src/content.mjs','catalog'],
 ['life','etapa_1_4/src/life.mjs','engine,legacyEngine,createLife,act,choose,travel,resume,stopRoute,abandon,wait,save,load,migrateLegacy,view'],
 ['ui','etapa_1_4/src/ui.mjs','']
];
const refs={'./contrato.mjs':'contract','../../etapa_1_3/src/contrato.mjs':'contract','../../etapa_1_3/src/motor.mjs':'kernel','../../etapa_1_3/content/fatia.mjs':'legacy','./world.mjs':'world','./content.mjs':'content','./life.mjs':'life'};
let script="(()=>{'use strict';\n";
for(const[name,file,returns]of modules){let s=await read(file);s=s.replace(/^import \{([^}]+)\} from '([^']+)';/gm,(_,names,path)=>{if(!refs[path])throw Error(`Importação desconhecida: ${path}`);return `const {${names.replace(/\bas\b/g,':')}}=${refs[path]};`;}).replace(/^export (?=(?:const|function)\b)/gm,'');script+=`const ${name}=(()=>{\n${s}\nreturn {${returns}};})();\n`;}
script+='})();';if(/^(import|export) /m.test(script))throw Error('Módulo não empacotado.');
const html=(await read('etapa_1_4/template.html')).replace('<!--APP_SCRIPT-->',()=>`<script>\n${script.replace(/<\/script/gi,'<\\/script')}\n</script>`);
await writeFile(new URL('etapa_1_4/Fantasy_Life_Ponteclara.html',root),html);
await mkdir(new URL('docs/legado/',root),{recursive:true});try{await access(new URL('docs/legado/index.html',root));}catch{await copyFile(new URL('docs/index.html',root),new URL('docs/legado/index.html',root));}
await writeFile(new URL('docs/index.html',root),html);console.log('Ponteclara 0.5.1: HTML autocontido e versão anterior preservada.');
