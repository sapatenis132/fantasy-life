import {spawnSync} from 'node:child_process';
import {writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const cwd=fileURLToPath(new URL('../../',import.meta.url));
const commands=[
  ['Base original (14 testes históricos)', ['base_original/etapa_1_2/testes.mjs']],
  ['Regressão no motor evoluído (mesmos 14 testes)', ['etapa_1_3/tests/regressao_1_2.mjs']],
  ['Empacotamento do HTML', ['etapa_1_3/scripts/build-demo.mjs']],
  ['Agência e integração HTML (47 + 10 testes)', ['--test','--test-reporter=spec','etapa_1_3/tests/agencia.test.mjs','etapa_1_3/tests/html.test.mjs']],
  ['Quatro trajetórias estruturais e seus saves', ['etapa_1_3/scripts/demonstrar.mjs']]
];
let output=`Fantasy Life — verificação da etapa 1.3\nData: ${new Date().toISOString()}\nNode: ${process.version}\n\n`;
for(const [name,args] of commands){
  const result=spawnSync(process.execPath,args,{cwd,encoding:'utf8',env:{...process.env,NO_COLOR:'1'}});
  output+=`== ${name} ==\n${result.stdout||''}${result.stderr||''}\n`;
  if(result.status!==0){writeFileSync(new URL('../evidencias/resultado_testes.txt',import.meta.url),output);throw new Error(`Falhou: ${name}`);}
  console.log(`OK — ${name}`);
}
output+='Total do motor evoluído e HTML: 71 testes aprovados. Base original: 14, verificada separadamente.\n';
output+='500 percursos novos + 500 casos da regressão; números não medem cinquenta horas de variedade.\n';
output+='Smoke HTML em VM/DOM mínimo. Bateria Chromium local e Android físico pendentes; comparação responsiva em Chrome remoto documentada em REVISAO_UX_0_4_1.md.\n';
writeFileSync(new URL('../evidencias/resultado_testes.txt',import.meta.url),output);
console.log('71 testes atuais aprovados; 14 originais também preservados e aprovados.');
