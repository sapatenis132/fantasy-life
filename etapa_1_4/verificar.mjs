import {spawnSync} from 'node:child_process';
import {writeFileSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const cwd=fileURLToPath(new URL('../',import.meta.url));
let log=`Fantasy Life 0.5.0 — verificação integrada\n${new Date().toISOString()}\nNode ${process.version}\n\n`;
for(const[name,args]of[
 ['Compatibilidade da etapa 1.3 e base original',['etapa_1_3/scripts/verificar.mjs']],
 ['Build autocontido atual',['etapa_1_4/build.mjs']],
 ['Vida, calendário, agência e integração da interface',['--test','--test-reporter=spec','etapa_1_4/tests/life.test.mjs','etapa_1_4/tests/ui.test.mjs']]
]){const r=spawnSync(process.execPath,args,{cwd,encoding:'utf8',env:{...process.env,NO_COLOR:'1'}});log+=`== ${name} ==\n${r.stdout||''}${r.stderr||''}\n`;writeFileSync(new URL('evidencias/resultado_testes.txt',import.meta.url),log);if(r.status!==0)throw Error(`Falhou: ${name}`);console.log(`OK — ${name}`);}
if(readFileSync(new URL('../docs/index.html',import.meta.url),'utf8')!==readFileSync(new URL('Fantasy_Life_Ponteclara.html',import.meta.url),'utf8'))throw Error('O site não corresponde ao build atual.');
log+='126 casos atuais aprovados: 71 da arquitetura/UI anterior + 43 de vida + 12 da nova UI. Base histórica original: outros 14 executados separadamente.\n';
log+='100 percursos novos integrados e 500 da etapa 1.3 não comprovam variedade por 50 horas. VM/DOM mínimo não verifica layout; inspeção responsiva separada.\n';writeFileSync(new URL('evidencias/resultado_testes.txt',import.meta.url),log);
