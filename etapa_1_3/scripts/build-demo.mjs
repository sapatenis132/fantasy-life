// Bundle local pequeno e fechado: empacota somente os quatro módulos conhecidos.
// Não é um transpiler genérico e não busca dependências na rede.
import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');
const exportsOff=source=>source.replace(/^export (?=(?:const|function)\b)/gm,'');
const contrato=exportsOff(await read('src/contrato.mjs'));
let motor=exportsOff(await read('src/motor.mjs'));
motor=motor.replace("from './contrato.mjs'","= contrato").replace(/^import /m,'const ');
const content=exportsOff(await read('content/fatia.mjs'));
let demo=await read('src/demo.mjs');
demo=demo.replace("import {createEngine} from './motor.mjs';",'const {createEngine}=motor;').replace("import {catalog,newLife} from '../content/fatia.mjs';",'const {catalog,newLife}=content;');
const script=`(()=>{\n'use strict';\nconst contrato=(()=>{\n${contrato}\nreturn {copy,integer,check,id,jsonData,compile,eligible,readStat,person,availableParticipants};})();\nconst motor=(()=>{\n${motor}\nreturn {createEngine};})();\nconst content=(()=>{\n${content}\nreturn {catalog,newLife};})();\n${demo}\n})();`;
if(/^(import|export) /m.test(script))throw new Error('Módulo não empacotado');
const template=await read('demo.template.html');
if(!template.includes('<!--APP_SCRIPT-->'))throw new Error('Template sem ponto de inserção');
await writeFile(new URL('Fantasy_Life_Laboratorio_1_3.html',root),template.replace('<!--APP_SCRIPT-->',()=>`<script>\n${script.replace(/<\/script/gi,'<\\/script')}\n</script>`));
console.log('Gerado: Fantasy_Life_Laboratorio_1_3.html (sem dependências externas).');
