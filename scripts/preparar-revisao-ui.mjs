// Página de verificação: viewport real de iframe, saves isolados da vida publicada.
import {execFileSync} from 'node:child_process';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url),dir=new URL('docs/ux/',root);
await mkdir(dir,{recursive:true});
const before=execFileSync('git',['show','04b574f388e7a98e6661e9aa235efd3b484a4110:etapa_1_3/Fantasy_Life_Laboratorio_1_3.html'],{cwd:fileURLToPath(root),encoding:'utf8'});
const after=await readFile(new URL('etapa_1_3/Fantasy_Life_Laboratorio_1_3.html',root),'utf8');
for(const [name,html] of [['antiga',before],['nova',after]]){
  const isolated=html.replace("key='fantasy-life-agencia-1.3'",`key='fantasy-life-ux-${name}'`);
  if(isolated===html)throw new Error('Save de teste não isolado');
  await writeFile(new URL(`${name}.html`,dir),isolated);
}
await writeFile(new URL('index.html',dir),`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Verificação mobile · Fantasy Life</title><style>body{font:16px system-ui;margin:16px;background:#e8e8e3;color:#28352e}header{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:16px}button,select{font:inherit;padding:10px;min-height:44px}iframe{display:block;border:0;background:#f6f2e8}main{width:max-content;max-width:none;margin:auto;box-shadow:0 2px 12px #0003}</style><header><strong>Verificação de interface</strong><button id="before">Antes</button><button id="after">Nova interface</button><label>Tela <select id="size"><option value="320,568">320 × 568</option><option value="360,640" selected>360 × 640</option><option value="412,915">412 × 915</option></select></label><button id="reload">Recarregar tela</button><span id="version">Nova interface</span></header><main><iframe id="preview" title="Fantasy Life em tela de celular" src="nova.html" width="360" height="640"></iframe></main><script>const frame=document.querySelector('#preview');function load(name){frame.src=name+'.html';document.querySelector('#version').textContent=name==='nova'?'Nova interface':'Antes';}document.querySelector('#before').onclick=()=>load('antiga');document.querySelector('#after').onclick=()=>load('nova');document.querySelector('#size').onchange=e=>{const [width,height]=e.target.value.split(',');frame.width=width;frame.height=height;};document.querySelector('#reload').onclick=()=>frame.src=frame.src;</script></html>`);
console.log('Revisão em docs/ux/, com saves próprios para antiga e nova interface.');
