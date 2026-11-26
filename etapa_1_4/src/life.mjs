import {createEngine} from '../../etapa_1_3/src/motor.mjs';
import {copy,check,integer,eligible} from '../../etapa_1_3/src/contrato.mjs';
import {catalog} from './content.mjs';
import {catalog as legacyCatalog} from '../../etapa_1_3/content/fatia.mjs';
import {PLACES,SKILLS,ORIGINS,RACES,TRAITS,GIFTS,path,calendar,npcPlace} from './world.mjs';
const record=x=>x&&typeof x==='object'&&!Array.isArray(x);
const needNames={food:'Saciedade',energy:'Energia',hygiene:'Higiene',mood:'Ânimo'};
const note=(s,type,text)=>s.history.push({day:s.day,type,text});
const talents=Object.keys(SKILLS);
function identity(input={}){
 const p={name:'Ari',race:'humano',origin:'artesao',trait:'observador',talent:'oficio',gift:'eco',...input};
 check(typeof p.name==='string'&&p.name.trim().length>0&&p.name.trim().length<=32,'Use um nome entre 1 e 32 caracteres.');
 check(!/[<>\u0000-\u001f]/.test(p.name),'O nome contém caracteres inválidos.');
 check(Object.hasOwn(RACES,p.race)&&Object.hasOwn(ORIGINS,p.origin)&&Object.hasOwn(TRAITS,p.trait)&&talents.includes(p.talent)&&Object.hasOwn(GIFTS,p.gift),'Características de personagem inválidas.');
 return {id:'player',name:p.name.trim(),race:p.race,origin:p.origin,trait:p.trait,talent:p.talent,gift:p.gift};
}
function data(p){return {identity:p,needs:{food:80,energy:85,hygiene:75,mood:70},carry:{food:0,energy:0,hygiene:0,mood:0},route:[],appointment:null,project:0,milestones:{},socialDay:-1,revision:1};}
function validate(s){
 const l=s.life;check(l?.revision===1,'Dados de vida incompatíveis.');identity(l.identity);
 for(const k of Object.keys(needNames))check(integer(l.needs?.[k])&&l.needs[k]<=100&&integer(l.carry?.[k])&&l.carry[k]<60,'Necessidades inválidas.');
 check(record(l.milestones)&&integer(l.project)&&l.project<=180&&Number.isSafeInteger(l.socialDay)&&Array.isArray(l.route)&&l.route.length<=8,'Progresso de vida inválido.');
 for(const[id,n]of Object.entries(s.npcs))if(n.identity){identity(n.identity);check(n.identity.id===id&&n.identity.name===n.name,'Identidade de morador inválida.');}
 check(Object.hasOwn(PLACES,s.location),'Lugar inválido.');
 let from=s.location;
 // O primeiro trecho pode estar em andamento; cada destino continua ligado à origem.
 for(const leg of l.route){check(leg.from===from&&Object.hasOwn(PLACES,leg.to)&&path(from,leg.to).minutes===leg.minutes&&path(from,leg.to).legs.length===1,'Rota inválida.');from=leg.to;}
 if(l.appointment){const a=l.appointment;check(a.npc==='maira'&&a.place==='oficina'&&integer(a.at)&&a.until===a.at+30&&['scheduled','offered','done','cancelled','missed'].includes(a.status),'Compromisso inválido.');}
}
function synchronize(s){
 const h=(s.day%1440)/60;
 for(const p of Object.keys(PLACES))s.flags[`at_${p}`]=s.location===p;
 s.flags.luz_dia=h>=6&&h<18;
 s.flags.oficina_aberta=h>=8&&h<17;s.flags.mercado_aberto=h>=8&&h<18;
 for(const[id,n]of Object.entries(s.npcs))if(n.alive&&['maira','mercador','breno'].includes(id))n.location=npcPlace(id,s.day);
 const day=Math.floor(s.day/1440);
 if(h>=12&&h<13&&s.life.socialDay!==day){
  s.life.socialDay=day;
  const a=s.npcs.maira,b=s.npcs.mercador;
  if(a?.alive&&b?.alive&&a.location===b.location){s.relations['maira:mercador']=Math.min(100,(s.relations['maira:mercador']||0)+1);s.relations['mercador:maira']=Math.min(100,(s.relations['mercador:maira']||0)+1);if(s.location===a.location)note(s,'witness','Maíra e o livreiro conversam durante a pausa. A vila tem relações que não dependem de você.');}
 }
 for(const[skill,value]of Object.entries(s.skills))if(value>=60&&!s.life.milestones[skill]){s.life.milestones[skill]=true;s.flags[`dominio_${skill}`]=true;note(s,'milestone',`${SKILLS[skill]||skill}: você atingiu um novo domínio. Novas técnicas ficam disponíveis.`);}
 const a=s.life.appointment;
 if(a&&['scheduled','offered'].includes(a.status)){
  if(s.day>a.until&&a.status==='scheduled'){a.status='missed';s.flags.aula_marcada=false;s.relations['maira:player']=Math.max(-100,(s.relations['maira:player']||0)-3);note(s,'appointment','O horário da aula passou. Maíra voltou ao trabalho; você poderá combinar outra ocasião.');}
  else if(a.status==='scheduled'&&s.day>=a.at&&s.location===a.place&&s.npcs[a.npc]?.alive&&s.npcs[a.npc].location===a.place){a.status='offered';s.queue.push({id:s.nextId++,type:'decision',decision:'aula_agendada',day:s.day});}
 }
}
function progress(s,dt){
 const o=s.work.length?catalog.decisions.find(d=>d.id===s.work.at(-1).decision)?.options.find(o=>o.id===s.work.at(-1).option):null;
 const sleeping=!!o?.sleep,resting=!!o?.rest;
 const rates={food:sleeping?2:4,energy:sleeping||resting?0:s.life.identity.race==='anao'?1:2,hygiene:1,mood:sleeping?0:1};
 for(const[k,rate]of Object.entries(rates)){const amount=s.life.carry[k]+dt*rate,loss=Math.floor(amount/60);s.life.carry[k]=amount%60;s.life.needs[k]=Math.max(0,s.life.needs[k]-loss);}
}
function afterChoice(s,{decision:d,option:o,outcome:r}){
 if(o.practice){const {skill,base}=o.practice;let gain=base+(s.life.identity.talent===skill?2:0)+(s.life.identity.trait==='persistente'&&r.id==='falha'?3:0);if(s.life.needs.mood<20)gain=Math.max(1,Math.floor(gain/2));s.skills[skill]=(s.skills[skill]||0)+gain;note(s,'practice',`${SKILLS[skill]}: +${gain} de prática.`);}
 if(o.social){if(s.life.identity.trait==='sociavel')s.relations[`${o.social}:player`]=Math.min(100,(s.relations[`${o.social}:player`]||0)+3);if(s.life.needs.hygiene<20){s.relations[`${o.social}:player`]=Math.max(-100,(s.relations[`${o.social}:player`]||0)-3);note(s,'social','O cheiro da estrada dificulta a aproximação. Uma pausa para se lavar pode ajudar.');}}
 if(o.project){s.life.project=Math.min(180,s.life.project+60);if(s.life.project===180){s.items.lanterna=(s.items.lanterna||0)+1;s.flags.lanterna_pronta=true;note(s,'project','A lanterna está pronta. Você pode guardá-la, vendê-la ou levá-la ao bosque.');}else note(s,'project',`Lanterna: ${s.life.project}/180 minutos de trabalho concluídos.`);}
 if(o.travel){const leg=s.life.route[0];if(leg?.to===s.location)s.life.route.shift();}
 if(o.appointment){const at=(Math.floor(s.day/1440)+1)*1440+540;s.life.appointment={npc:'maira',place:'oficina',at,until:at+30,status:'scheduled'};s.flags.aula_marcada=true;}
 if(o.lesson&&s.life.appointment){s.life.appointment.status=o.id==='cancelar'?'cancelled':'done';s.flags.aula_marcada=false;}
 if(d.id==='despertar')s.life.identity.gift='eco';
 if(o.purchase)s.flags.reagente_adquirido=true;
}
const hooks={validate,settle:synchronize,progress,afterChoice,nextBoundary:s=>{
 const a=s.life.appointment;return a?.status==='scheduled'?(s.day<a.at?a.at:s.day<=a.until?a.until+1:Infinity):Infinity;
},onOffer:(s,e,random)=>{if(e.decision==='reagente'){s.world.reagente_real=random()<0.6;s.flags.qualidade_conhecida=false;}}};
export const engine=createEngine(catalog,hooks);
export const legacyEngine=createEngine(legacyCatalog);
function transact(s,op){const draft=copy(s);op(draft);engine.save(draft);Object.assign(s,draft);return s;}
function routeRun(s){while(s.life.route.length&&!s.pending&&s.target===null){const l=s.life.route[0];engine.act(s,`ir_${l.from}_${l.to}`,'andar');}return s;}
export function createLife(seed=1,options={}){
 const p=identity(options),age={humano:18,elfo:40,anao:30}[p.race];
 const s=engine.create(seed,{day:480,birthDay:480-age*365*1440,life:data(p),location:'casa',money:18,items:{grimorio:1},skills:{[ORIGINS[p.origin].skill]:ORIGINS[p.origin].value},flags:{[`raca_${p.race}`]:true,[`traco_${p.trait}`]:true,[`dom_${p.gift}`]:true},npcs:{
 maira:{name:'Maíra',alive:true,location:'oficina',identity:{id:'maira',name:'Maíra',race:'anao',origin:'artesao',trait:'persistente',talent:'oficio',gift:'latente'}},
 mercador:{name:'Livreiro',alive:true,location:'mercado',identity:{id:'mercador',name:'Livreiro',race:'humano',origin:'viajante',trait:'observador',talent:'alquimia',gift:'latente'}},
 breno:{name:'Breno',alive:true,location:'praca',identity:{id:'breno',name:'Breno',race:'elfo',origin:'viajante',trait:'sociavel',talent:'esgrima',gift:'pulso'}}
 }});synchronize(s);note(s,'arrival',`${p.name}, ${ORIGINS[p.origin].name.toLowerCase()}, começa uma nova vida em Ponteclara. O livro na mochila é apenas uma das possibilidades.`);return engine.load(engine.save(s));
}
export const act=(s,id,option)=>transact(s,t=>engine.act(t,id,option));
export const choose=(s,option)=>transact(s,t=>engine.choose(t,{instance:t.pending.id,option}));
export const travel=(s,to)=>transact(s,t=>{check(!t.pending&&t.target===null,'Conclua a situação atual antes de viajar.');t.life.route=path(t.location,to).legs;routeRun(t);});
export const resume=s=>transact(s,t=>{if(t.target!==null)engine.resume(t);if(!t.pending&&t.target===null)routeRun(t);});
export const stopRoute=s=>transact(s,t=>{check(!t.pending,'Resolva a situação atual.');if(t.work.length)t.life.route=t.life.route.slice(0,1);else{t.life.route=[];if(t.target!==null)engine.stop(t);}note(t,'travel','Você decidiu não seguir para os próximos trechos do caminho.');});
export const abandon=s=>transact(s,t=>{t.life.route=[];engine.abandon(t);});
export const wait=(s,minutes)=>transact(s,t=>engine.advance(t,minutes));
export const save=engine.save,load=engine.load;
export function migrateLegacy(raw){
 const old=legacyEngine.load(raw);check(!old.pending&&!old.work.length&&!old.activities.length&&old.target===null&&!old.queue.length,'Conclua os compromissos na versão anterior antes de transferir este personagem.');
 const fresh=createLife(old.seed,{name:'Viajante',gift:'latente'}),t=copy(old);
 t.catalog=fresh.catalog;t.clock=fresh.clock;t.life=fresh.life;t.flags={...fresh.flags,...old.flags};t.day=old.day*1440+480;t.birthDay=old.birthDay*1440+480;t.nextPulse=(Math.floor(t.day/60)+1)*60;t.location='praca';
 t.history=old.history.map(h=>({...h,day:h.day*1440+480}));t.seen={};t.families={};t.npcs={...fresh.npcs,...t.npcs};
 for(const n of Object.values(t.npcs))if(['aldeia','vila'].includes(n.location))n.location=n.name.includes('irmã')?'casa':'praca';
 synchronize(t);note(t,'migration','Você chegou a Ponteclara. Suas posses, habilidades, memórias e consequências anteriores foram preservadas; a rotina passa a ser vivida em minutos.');
 return load(save(t));
}
function reason(s,c){
 if(!c||eligible(s,c))return null;
 if(c.all)return c.all.map(x=>reason(s,x)).filter(Boolean).join(' ');
 if(c.any)return 'Alternativas: '+c.any.map(x=>reason(s,x)).filter(Boolean).join(' ou ');
 if(c.person)return `Encontre ${s.npcs[c.person]?.name||c.person} neste lugar.`;
 if(c.stat){const [type,key]=c.stat.split(':');return `Precisa de ${type==='skill'?SKILLS[key]||key:needNames[key]||c.stat} ${c.value} ou mais.`;}
 if(c.item)return `Precisa de ${c.min} × ${{ervas:'ervas',lanterna:'lanterna',grimorio:'livro'}[c.item]||c.item}.`;
 if(c.knows)return 'Descubra essa informação conversando ou investigando.';
 if(c.flag){if(c.flag.startsWith('at_'))return `Vá a ${PLACES[c.flag.slice(3)]?.name||'outro lugar'}.`;if(c.flag.startsWith('dominio_'))return `Domine ${SKILLS[c.flag.slice(8)]} (60 pontos).`;return ({oficina_aberta:'A oficina atende entre 08:00 e 17:00.',mercado_aberto:'O mercado abre das 08:00 às 18:00.',dom_eco:'Requer o dom Eco espiritual.',luz_dia:'Espere a luz do dia.',traco_observador:'Requer o traço Observador.',raca_elfo:'Um elfo enxerga na escuridão do bosque.'})[c.flag]||'Requer outra condição do personagem.';}
 if(c.not)return 'Você já concluiu esta possibilidade ou tem um compromisso em aberto.';
 return 'Falta uma condição para esta ação.';
}
export function view(s){
 const v=engine.view(s),l=s.life,c=calendar(s.day),p=l.identity;
 const describe=(d,o)=>{const definition=catalog.decisions.find(x=>x.id===d)?.options.find(x=>x.id===o.id);return {...o,minutes:o.cost.days,reason:definition&&!eligible(s,definition.requires)?reason(s,definition.requires):o.reason};};
 const actions=v.actions.filter(d=>!d.id.startsWith('ir_')).map(d=>({...d,options:d.options.map(o=>describe(d.id,o))}));
 if(v.pending&&!v.pending.legacy)v.pending.options=v.pending.options.map(o=>describe(s.pending.decision,o));
 const people=Object.entries(s.npcs).filter(([,n])=>n.alive&&n.location===s.location).map(([id,n])=>({id,name:n.name,friend:!!s.flags[`amizade_${id}`]}));
 const contacts=Object.entries(s.npcs).filter(([id])=>s.knowledge.player?.[`contato_${id}`]||Object.hasOwn(s.relations,`player:${id}`)||Object.hasOwn(s.relations,`${id}:player`)).map(([id,n])=>({id,name:n.name,trust:s.relations[`player:${id}`]||0,reciprocal:s.relations[`${id}:player`]||0,friend:!!s.flags[`amizade_${id}`],routine:s.knowledge.player?.[`rotina_${id}`]?{maira:'Oficina 08–12 e 13–17; mercado ao meio-dia.',mercador:'Mercado 08–18; depois na taverna.',breno:'Pátio 09–12; taverna 18–22.'}[id]:null}));
 return {...v,actions,calendar:c,identity:copy(p),place:{id:s.location,...PLACES[s.location]},people,contacts,route:copy(l.route),appointment:copy(l.appointment),project:l.project,
  needs:Object.entries(l.needs).map(([id,value])=>({id,label:needNames[id],value})),
  traits:[RACES[p.race],TRAITS[p.trait],`Talento: ${SKILLS[p.talent]}`,GIFTS[p.gift]],
  skills:Object.entries(SKILLS).map(([id,label])=>({id,label,value:s.skills[id]||0,mastered:!!l.milestones[id]})),
  diary:v.diary.filter(h=>h.type!=='intention').map(h=>({...h,calendar:calendar(h.day)}))};
}
