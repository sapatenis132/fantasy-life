import assert from 'node:assert/strict';
import {writeFileSync,mkdirSync} from 'node:fs';
import {createLife,act,choose,travel,resume,wait,save,load,view} from '../src/life.mjs';
function settle(s){let n=0;while(s.pending||s.target!==null||s.life.route.length){assert.ok(++n<100);if(s.pending)choose(s,s.pending.decision==='bosque_encontro'?'recuar':s.pending.decision==='aula_agendada'?'cancelar':'deixar');else resume(s);}}
function go(s,p){travel(s,p);settle(s);}function task(s,d,o){act(s,d,o);settle(s);}
const report=[];mkdirSync(new URL('../evidencias/vidas/',import.meta.url),{recursive:true});
for(const choice of ['reparar','libertar','extrair','renovar']){const s=createLife(42,{name:'Ari',origin:'artesao'});if(choice==='renovar'){go(s,'poco');task(s,'poco','eco');go(s,'bosque');task(s,'passagem_raizes','buscar');}
 go(s,'praca');task(s,'rumos',choice==='extrair'?'ferramentas':'presenca');go(s,'mirante');task(s,'mirante','cuidado');go(s,'moinho');task(s,'guardiao',choice==='extrair'?'consertar':'galeria');task(s,'achados','ferramentas');task(s,'achados','notas');go(s,'camara');task(s,'destino_moinho',choice);
 go(s,'oficina');if(s.npcs.maira.location!=='oficina'){const h=s.day%1440;wait(s,h<780?780-h:1920-h);settle(s);}task(s,'retorno_maira','devolver');task(s,'retorno_maira','relatar');
 const raw=save(s);assert.equal(save(load(raw)),raw);writeFileSync(new URL(`../evidencias/vidas/${choice}.json`,import.meta.url),raw+'\n');report.push({choice,seed:s.seed,identity:s.life.identity,ending:view(s).journey.ending,calendar:view(s).calendar,money:s.money,health:s.health,skills:s.skills,items:s.items,mairaTrust:s.relations['maira:player'],mairaKnows:s.knowledge.maira,merchantKnows:s.knowledge.mercador||{},riverShortcut:!!s.flags.rota_rio_aberta,millWork:!!s.flags.fluxo_estavel,riverHealing:!!s.flags.espirito_livre,riverRest:!!s.flags.pacto_renovado});}
writeFileSync(new URL('../evidencias/TRAJETORIAS.json',import.meta.url),JSON.stringify(report,null,2)+'\n');console.log('Quatro trajetórias sem inserção de recursos; mesma identidade e seed, decisões e preparação diferentes. Saves importáveis.');
