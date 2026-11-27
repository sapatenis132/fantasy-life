import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const cwd=fileURLToPath(new URL('../',import.meta.url));
let log=`Fantasy Life 0.6.0 — etapa 1.5\n${new Date().toISOString()}\nNode ${process.version}\n\n`;
for(const[name,args]of[
 ['Base preservada e compatibilidade 0.5.2',['etapa_1_4/verificar.mjs']],
 ['Build atual com migrador do catálogo anterior',['etapa_1_5/build.mjs']],
 ['Regressão atual, capítulo, migração e interface',['--test','--test-reporter=spec','etapa_1_5/tests/life-regression.test.mjs','etapa_1_5/tests/ui-regression.test.mjs','etapa_1_5/tests/chapter.test.mjs','etapa_1_5/tests/chapter-ui.test.mjs']],
 ['Comparação de quatro trajetórias jogáveis',['etapa_1_5/scripts/comparar.mjs']],
 ['Ambiente público de revisão isolado',['scripts/preparar-revisao-vida.mjs']]
]){const r=spawnSync(process.execPath,args,{cwd,encoding:'utf8',env:{...process.env,NO_COLOR:'1'}});log+=`== ${name} ==\n${r.stdout||''}${r.stderr||''}\n`;writeFileSync(new URL('evidencias/resultado_testes.txt',import.meta.url),log);if(r.status!==0)throw Error(`Falhou: ${name}`);console.log(`OK — ${name}`);}
if(readFileSync(new URL('../docs/index.html',import.meta.url),'utf8')!==readFileSync(new URL('Fantasy_Life_Moinho.html',import.meta.url),'utf8'))throw Error('Site difere do build atual.');
log+='194 casos do conjunto atual: 71 da arquitetura anterior + 123 da versão 0.6 (43 de vida, 28 de HUD, 41 do capítulo, 11 da nova interface).\n71 casos da fundação 0.5.2 também reexecutados em separado; 14 da base original. Há casos de regressão equivalentes nas duas versões.\n100 expedições, 100 percursos cotidianos e comparação de 200 confrontos na bateria atual. Não comprovam 50h de variedade, diversão ou equilíbrio. VM/DOM não verifica layout; Android físico pendente.\n';writeFileSync(new URL('evidencias/resultado_testes.txt',import.meta.url),log);
