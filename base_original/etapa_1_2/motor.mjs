// Protótipo de laboratório, não motor final. Dia 0 = início da simulação.
const clone = x => JSON.parse(JSON.stringify(x));
const int = (n,min=0) => Number.isSafeInteger(n)&&n>=min;
const fail = msg => {throw new Error(msg)};
export function create(seed=1){
 if(!int(seed)||seed>0xffffffff) fail('Seed inválida');
 return {version:1,seed,rng:seed||1,day:0,alive:true,money:0,skills:{},activities:[],npcs:{},queue:[],pending:null,target:null,history:[],seen:{},families:{},nextId:1};
}
function random(s){let x=s.rng;x^=x<<13;x^=x>>>17;x^=x<<5;s.rng=x>>>0;return s.rng/4294967296;}
function log(s,type,data={}){s.history.push({day:s.day,type,...data});}
export const save=s=>JSON.stringify(s);
export function load(raw){const s=JSON.parse(raw);if(s.version!==1||!int(s.day)||!int(s.rng,1)||!Array.isArray(s.queue)||!Array.isArray(s.activities)||!Array.isArray(s.history))fail('Save incompatível');return s;}
export function addNPC(s,id){if(!id||Object.hasOwn(s.npcs,id))fail('NPC inválido');s.npcs[id]={alive:true};}
export function activity(s,{id,hours,duration,skill,rate=1,pay=0}){
 if(!s.alive||s.pending||s.target!==null)fail('Ação indisponível durante avanço');
 if(!id||!skill||!int(hours,1)||hours>12||!int(duration,1)||!int(rate)||!int(pay)||s.activities.some(a=>a.id===id))fail('Atividade inválida');
 if(s.activities.reduce((v,a)=>v+a.hours,0)+hours>12)fail('Agenda excedida');
 s.activities.push({id,hours,end:s.day+duration,skill,rate,pay});log(s,'activityStart',{id});
}
export function cancel(s,id){if(!s.alive||s.pending||s.target!==null)fail('Ação indisponível');if(!s.activities.some(a=>a.id===id))fail('Atividade inexistente');s.activities=s.activities.filter(a=>a.id!==id);log(s,'activityCancel',{id});}
export function schedule(s,event){
 if(!int(event.day)||event.day<=s.day||!['npcDeath','playerDeath','offer','fact'].includes(event.type))fail('Evento inválido');
 if(['npcDeath','offer'].includes(event.type)&&!Object.hasOwn(s.npcs,event.npc))fail('NPC desconhecido');
 if(event.type==='offer'&&(!event.title||!int(event.reward)))fail('Oferta inválida');
 s.queue.push({...clone(event),id:s.nextId++});
}
const order={playerDeath:0,npcDeath:1,fact:2,offer:3};
function due(s){
 while(s.alive&&!s.pending){
  s.queue.sort((a,b)=>a.day-b.day||order[a.type]-order[b.type]||a.id-b.id);
  const e=s.queue[0];if(!e||e.day>s.day)break;s.queue.shift();
  if(e.type==='playerDeath'){s.alive=false;s.activities=[];s.queue=[];s.target=null;log(s,'death');}
  else if(e.type==='npcDeath'){if(s.npcs[e.npc].alive){s.npcs[e.npc].alive=false;log(s,'npcDeath',{npc:e.npc});}}
  else if(e.type==='fact'){log(s,'fact',{title:e.title});}
  else if(s.npcs[e.npc].alive){s.pending=e;log(s,'offer',{id:e.id,npc:e.npc});}
  else log(s,'invalidated',{id:e.id});
 }
}
function run(s){
 while(s.alive&&!s.pending&&s.target!==null){
  due(s);if(!s.alive||s.pending)break;
  if(s.day===s.target){s.target=null;break;}
  const next=Math.min(s.target,...s.queue.map(e=>e.day),...s.activities.map(a=>a.end));const dt=next-s.day;
  if(dt<=0)fail('Relógio travado');
  for(const a of s.activities){s.skills[a.skill]=(s.skills[a.skill]||0)+a.hours*a.rate*dt;s.money+=a.pay*dt;}
  s.day=next;
  for(const a of s.activities.filter(a=>a.end===next))log(s,'activityComplete',{id:a.id});
  s.activities=s.activities.filter(a=>a.end>next);
 }
 return s;
}
export function advance(s,days){if(!s.alive||s.pending||s.target!==null||!int(days,1)||days>36500)fail('Avanço inválido');s.target=s.day+days;return run(s);}
export function resolve(s,choice){if(!s.alive||!s.pending||!['accept','decline'].includes(choice))fail('Escolha inválida');const e=s.pending;s.pending=null;if(choice==='accept')s.money+=e.reward;log(s,'decision',{id:e.id,choice});due(s);if(s.alive&&!s.pending&&s.day===s.target)s.target=null;return s;}
export function resume(s){if(!s.alive||s.pending||s.target===null)fail('Não há avanço para retomar');return run(s);}
export function stop(s){if(s.pending)fail('Resolva a decisão primeiro');s.target=null;}
// Seleção independente de storylets de laboratório. Não altera o relógio.
// Contexto e elegibilidade fornecidos pelo catálogo chamador; nunca força um evento.
export function select(s,catalog,context){
 if(!s.alive||s.pending) return null;
 const candidates=catalog.filter(e=>e.context===context&&e.weight>0&&(!e.npc||s.npcs[e.npc]?.alive)&&((s.seen[e.id]?.count||0)<(e.max||1))&&(s.day-(s.seen[e.id]?.last??-Infinity)>=(e.cooldown||0)));
 if(!candidates.length)return null;
 const weighted=candidates.map(e=>[e,e.weight/(1+3*(s.seen[e.id]?.count||0)+2*(s.families[e.family]||0))]);
 let draw=random(s)*weighted.reduce((n,x)=>n+x[1],0);let chosen=weighted.at(-1)[0];
 for(const [e,w] of weighted){draw-=w;if(draw<0){chosen=e;break;}}
 s.seen[chosen.id]={count:(s.seen[chosen.id]?.count||0)+1,last:s.day};s.families[chosen.family]=(s.families[chosen.family]||0)+1;
 log(s,'storylet',{id:chosen.id,family:chosen.family});return chosen.id;
}
