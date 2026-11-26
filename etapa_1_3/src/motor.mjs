// Evolução do motor da etapa 1.2: preserva relógio por marcos, fila, PRNG,
// pausa/retomada, agenda legada e seleção ponderada. Contrato novo: save v2.
import {copy, integer, check, id, jsonData, compile, eligible, readStat, person, availableParticipants} from './contrato.mjs';
const EMPTY = {schemaVersion:1, id:'laboratorio', version:1, decisions:[], consequences:[], activities:[]};
const order = {playerDeath:0, npcDeath:1, fact:2, consequence:2, offer:3, decision:3};
const log = (s, type, data = {}) => s.history.push({day:s.day, type, ...data});
function mix(seed) { let n = seed ^ 0x9e3779b9; n = Math.imul(n ^ n >>> 16, 0x21f0aaad); n = Math.imul(n ^ n >>> 15, 0x735a2d97); return (n ^ n >>> 15) >>> 0 || 1; }
function random(s) { let x=s.rng; x^=x<<13; x^=x>>>17; x^=x<<5; s.rng=x>>>0; return s.rng/4294967296; }
function weighted(s, entries, weight) {
  if (entries.length === 1) return entries[0];
  const scale=Math.max(...entries.map(weight));check(Number.isFinite(scale)&&scale>0,'Pesos inválidos');
  let draw = random(s) * entries.reduce((sum, e) => sum + weight(e)/scale, 0);
  for (const e of entries) { draw -= weight(e)/scale; if (draw < 0) return e; }
  return entries.at(-1);
}
const idle = s => check(s.alive && !s.pending && s.target === null && !s.work.length, 'Ação indisponível durante avanço ou decisão');
export function createEngine(input = EMPTY) {
  // Catálogo privado: o chamador não pode alterar regras de um save em andamento.
  const {catalog, decisions, consequences, activities} = compile(input);
  const stamp = {id:catalog.id, version:catalog.version, fingerprint:JSON.stringify(catalog)};
  function validate(s) {
    jsonData(s);
    check(s.version === 2 && s.catalog?.id === stamp.id && s.catalog.version === stamp.version && s.catalog.fingerprint === stamp.fingerprint, 'Save/catálogo incompatível');
    check(integer(s.seed) && s.seed <= 0xffffffff && integer(s.rng,1) && s.rng <= 0xffffffff && integer(s.day) &&
      Number.isSafeInteger(s.birthDay) && s.birthDay <= s.day && typeof s.alive === 'boolean' && integer(s.money) &&
      integer(s.health) && s.health <= 100 && id(s.location) && integer(s.nextId,1) &&
      integer(s.nextPulse,1) && s.nextPulse >= s.day && s.nextPulse % 7 === 0 &&
      (s.target === null || integer(s.target) && s.target >= s.day), 'Estado vital/temporal inválido');
    for (const field of ['skills','attributes','items','relations','flags','world','knowledge','npcs','seen','families','resolved','processed'])
      check(s[field] && typeof s[field] === 'object' && !Array.isArray(s[field]), `Mapa inválido: ${field}`);
    for (const field of ['skills','attributes','items']) for (const [key,value] of Object.entries(s[field])) check(id(key) && integer(value), `Valor inválido: ${field}`);
    for (const [key,value] of Object.entries(s.relations)) check(key.split(':').length === 2 && key.split(':').every(who => !!person(s,who)) && Number.isSafeInteger(value) && value >= -100 && value <= 100, 'Relação inválida');
    for (const [key,value] of Object.entries(s.flags)) check(id(key) && typeof value === 'boolean', 'Flag de save inválida');
    for (const [key,value] of Object.entries(s.world)) check(id(key) && ['boolean','string','number'].includes(typeof value) && (typeof value !== 'number' || Number.isSafeInteger(value)), 'Fato de save inválido');
    for (const [who,facts] of Object.entries(s.knowledge)) {
      check(!!person(s,who) && facts && typeof facts === 'object' && !Array.isArray(facts), 'Conhecedor inexistente');
      for (const [fact,value] of Object.entries(facts)) check(id(fact) && value === true, 'Conhecimento de save inválido');
    }
    for (const [key,n] of Object.entries(s.npcs)) check(id(key) && key !== 'player' && typeof n.alive === 'boolean' && id(n.location) && typeof n.name === 'string', 'NPC de save inválido');
    for (const [key,value] of Object.entries(s.seen)) check(id(key) && integer(value.count,1) && integer(value.last) && value.last <= s.day, 'Exposição inválida');
    for (const [key,value] of Object.entries(s.families)) check(id(key) && integer(value,1), 'Família inválida');
    for (const field of ['resolved','processed']) for (const [key,value] of Object.entries(s[field])) check(integer(Number(key),1) && Number(key)<s.nextId && value === true, 'Registro de execução inválido');
    check(Array.isArray(s.history) && Array.isArray(s.queue) && Array.isArray(s.activities) && Array.isArray(s.work), 'Coleções inválidas');
    let previous = 0;
    for (const h of s.history) { check(integer(h.day) && h.day >= previous && h.day <= s.day && typeof h.type === 'string', 'Diário inválido'); previous=h.day; }
    const runningIds = new Set();
    const instance = e => { check(integer(e.id,1) && e.id < s.nextId && !runningIds.has(e.id) && !s.processed[e.id] && !s.resolved[e.id], 'Instância duplicada ou reaplicada'); runningIds.add(e.id); };
    function event(e, pending = false) {
      check(e && Object.hasOwn(order,e.type) && integer(e.day) && (pending ? e.day <= s.day : e.day >= s.day), 'Evento de save inválido'); instance(e);
      if (['npcDeath','offer'].includes(e.type)) check(!!s.npcs[e.npc], 'NPC de evento desconhecido');
      if (e.type === 'offer') check(typeof e.title === 'string' && integer(e.reward), 'Oferta legada inválida');
      if (e.type === 'fact') check(typeof e.title === 'string', 'Fato legado inválido');
      if (e.type === 'decision') check(decisions.get(e.decision)?.kind === 'opportunity', 'Decisão de save desconhecida');
      if (e.type === 'consequence') check(consequences.has(e.consequence), 'Consequência de save desconhecida');
      check(!pending || ['offer','decision'].includes(e.type), 'Pendência inválida');
    }
    s.queue.forEach(e => event(e)); if (s.pending !== null) event(s.pending,true);
    for (const w of s.work) {
      instance(w); const d = decisions.get(w.decision), o=d?.options.find(x => x.id===w.option);
      check(!!o && integer(w.remaining) && w.remaining <= o.cost.days && integer(w.started) && w.started <= s.day, 'Ação em curso inválida');
    }
    check(!s.work.length || s.target !== null, 'Ação em curso sem destino');
    check(new Set(s.activities.map(a => a.id)).size === s.activities.length, 'Atividade duplicada');
    for (const a of s.activities) {
      check(id(a.id) && integer(a.end) && a.end >= s.day, 'Atividade de save inválida');
      if (a.definition) check(activities.has(a.definition) && a.definition === a.id && ['occupation','project'].includes(a.slot), 'Definição de atividade inválida');
      else check(integer(a.hours,1) && a.hours <= 12 && id(a.skill) && integer(a.rate) && integer(a.pay), 'Atividade legada inválida');
    }
    const modern = s.activities.filter(a=>a.definition);
    check(new Set(modern.map(a=>a.slot)).size===modern.length && s.activities.filter(a=>!a.definition).reduce((n,a)=>n+a.hours,0)<=12, 'Atividades incompatíveis');
    check(s.alive || (!s.pending && !s.work.length && !s.activities.length && !s.queue.length && s.target === null), 'Morte não encerrada');
    check(!s.alive || s.health>0, 'Pessoa viva sem saúde');
    return s;
  }
  function tx(s, operation) { const draft=copy(s); operation(draft); validate(draft); Object.assign(s,draft); return s; }
  function create(seed=1, initial={}) {
    check(integer(seed) && seed <= 0xffffffff, 'Seed inválida'); jsonData(initial);
    const allowed=['money','health','birthDay','location','skills','attributes','items','relations','flags','world','knowledge','npcs'];
    check(Object.keys(initial).every(k=>allowed.includes(k)), 'Campo inicial desconhecido');
    return validate({version:2,catalog:copy(stamp),seed,rng:mix(seed),day:0,birthDay:0,alive:true,money:0,health:100,
      location:'aldeia',skills:{},attributes:{},items:{},relations:{},flags:{},world:{},knowledge:{player:{}},
      activities:[],npcs:{},queue:[],pending:null,target:null,work:[],history:[],seen:{},families:{},resolved:{},processed:{},nextId:1,nextPulse:7,...copy(initial)});
  }
  function load(raw) {
    check(typeof raw === 'string' && raw.length < 8_000_000, 'Save ausente ou grande demais');
    let s=JSON.parse(raw); jsonData(s);
    if (s.version === 1) {
      // A base 1.2 só continha agenda, fatos e ofertas legadas. Não inventar pessoas/posses.
      const defaults=create(s.seed);
      s={...defaults,...s,version:2,catalog:copy(stamp),nextPulse:(Math.floor(s.day/7)+1)*7,
        npcs:Object.fromEntries(Object.entries(s.npcs || {}).map(([key,n])=>[key,{name:key,location:'aldeia',...n}]))};
    }
    return validate(s);
  }
  const save = s => JSON.stringify(validate(s));
  const permitted = (s,d) => !!d && s.alive && eligible(s,d.requires) && availableParticipants(s,d.participants);
  const repetition = (s,d) => (s.seen[d.id]?.count || 0) < d.repeat.max && s.day-(s.seen[d.id]?.last ?? -Infinity) >= d.repeat.cooldown;
  function expose(s,d) { s.seen[d.id]={count:(s.seen[d.id]?.count||0)+1,last:s.day}; s.families[d.family]=(s.families[d.family]||0)+1; }
  function push(s,event) { s.queue.push({...copy(event),id:s.nextId++}); }
  function dead(s) { s.alive=false; s.activities=[]; s.queue=[]; s.pending=null; s.work=[]; s.target=null; log(s,'death',{text:'Sua vida chegou ao fim.'}); }
  function change(s,key,amount) {
    const [type,a,b]=key.split(':'); const value=readStat(s,key)+amount;
    check(Number.isSafeInteger(value), 'Resultado numérico inválido');
    if(type==='money') {check(value>=0,'Recursos insuficientes'); s.money=value;}
    else if(type==='health') {s.health=Math.max(0,Math.min(100,value)); if(s.health===0) dead(s);}
    else if(type==='skill') {check(value>=0,'Habilidade negativa');s.skills[a]=value;}
    else if(type==='trust') {check(person(s,a)&&person(s,b),'Relação com pessoa inexistente');s.relations[`${a}:${b}`]=Math.max(-100,Math.min(100,value));}
    else check(false,'Estatística não alterável');
  }
  function start(s,key) {
    const a=activities.get(key); check(!!a && eligible(s,a.requires) && availableParticipants(s,a.participants),'Requisitos da atividade não atendidos');
    check(!s.activities.some(x=>x.id===key || x.slot===a.slot),'Já existe um compromisso nessa categoria');
    check(s.money>=a.costPerDay,'Recursos insuficientes para iniciar');
    s.activities.push({id:a.id,definition:a.id,slot:a.slot,end:s.day+a.duration});
    log(s,'activityStart',{id:a.id,text:`Você começou: ${a.label}.`});
  }
  function apply(s,list) {
    for (const e of list) {
      if (!s.alive) break;
      switch(e.op) {
        case 'add': change(s,e.stat,e.amount); break;
        case 'flag': s.flags[e.id]=e.value; break;
        case 'world': s.world[e.id]=e.value; break;
        case 'item': {const n=(s.items[e.id]||0)+e.amount;check(integer(n),'Item insuficiente');s.items[e.id]=n;break;}
        case 'learn': check(person(s,e.who)?.alive,'Conhecedor indisponível');(s.knowledge[e.who]??={})[e.fact]=true;break;
        case 'move': check(person(s,e.who)?.alive,'Pessoa indisponível');if(e.who==='player')s.location=e.to;else s.npcs[e.who].location=e.to;break;
        case 'kill': check(!!person(s,e.who),'Pessoa desconhecida');if(e.who==='player')dead(s);else if(s.npcs[e.who].alive){s.npcs[e.who].alive=false;log(s,'npcDeath',{npc:e.who});}break;
        case 'schedule': push(s,{type:'consequence',consequence:e.consequence,day:s.day+e.after});break;
        case 'offer': push(s,{type:'decision',decision:e.decision,day:s.day});break;
        case 'startActivity': start(s,e.activity);break;
        case 'cancelActivity': s.activities=s.activities.filter(a=>a.id!==e.activity);log(s,'activityCancel',{id:e.activity});break;
        default: throw new Error('Operação não suportada');
      }
    }
  }
  function finish(s,w) {
    const d=decisions.get(w.decision),o=d.options.find(x=>x.id===w.option);
    s.resolved[w.id]=true;
    if(!permitted(s,d) || !eligible(s,o.requires)) {log(s,'actionInvalidated',{id:w.id,text:'A situação mudou antes da conclusão. A ação foi interrompida; o tempo e os custos já gastos foram preservados.'});return;}
    const results=o.outcomes.filter(r=>eligible(s,r.when));
    const r=weighted(s,results,x=>x.weight);
    apply(s,o.effects); apply(s,r.effects);
    log(s,'decision',{id:w.id,decision:d.id,choice:o.id,intent:o.intent,outcome:r.id,text:r.text});
  }
  function cleanActivities(s) {
    for (const a of [...s.activities]) {
      if(!a.definition) continue;
      const d=activities.get(a.definition);
      if(!eligible(s,d.requires)||!availableParticipants(s,d.participants)) {
        s.activities=s.activities.filter(x=>x.id!==a.id); log(s,'activityInterrupted',{id:a.id,text:`${d.label}: o compromisso terminou porque as condições mudaram.`});
      }
    }
  }
  function pulse(s) {
    s.nextPulse+=7;
    const list=[...decisions.values()].filter(d=>d.selection&&permitted(s,d)&&repetition(s,d)&&!s.queue.some(e=>e.decision===d.id));
    if(list.length) {
      const d=weighted(s,list,x=>x.selection.weight/(1+3*(s.seen[x.id]?.count||0)+2*(s.families[x.family]||0)));
      push(s,{type:'decision',decision:d.id,day:s.day});
    }
  }
  function settle(s) {
    if(!s.alive || s.pending) return;
    const sorted=()=>s.queue.sort((a,b)=>a.day-b.day||order[a.type]-order[b.type]||a.id-b.id);
    // Mudanças causais vencem conclusões e convites na mesma data.
    sorted();
    while(s.alive && s.queue[0]?.day<=s.day && order[s.queue[0].type]<3) {
      const e=s.queue.shift();s.processed[e.id]=true;
      if(e.type==='playerDeath') dead(s);
      else if(e.type==='npcDeath') {if(s.npcs[e.npc].alive){s.npcs[e.npc].alive=false;log(s,'npcDeath',{npc:e.npc});}}
      else if(e.type==='fact') log(s,'fact',{title:e.title,text:e.title});
      else {
        const c=consequences.get(e.consequence);
        if(eligible(s,c.requires)&&availableParticipants(s,c.participants)) {apply(s,c.effects);if(c.visibility==='observed')log(s,'consequence',{id:e.id,consequence:c.id,text:c.text});}
        else log(s,'invalidated',{id:e.id});
      }
      sorted();
    }
    if(!s.alive) return;
    cleanActivities(s);
    for(const a of [...s.activities].filter(a=>a.end===s.day)) {
      if(!s.alive)break;
      if(!s.activities.some(x=>x.id===a.id))continue;
      s.activities=s.activities.filter(x=>x.id!==a.id);
      if(a.definition) {const d=activities.get(a.definition);
        if(!eligible(s,d.requires)||!availableParticipants(s,d.participants)){log(s,'activityInterrupted',{id:a.id,text:`${d.label}: as condições mudaram antes da conclusão.`});continue;}
        apply(s,d.onComplete);log(s,'activityComplete',{id:a.id,text:d.completionText});}
      else log(s,'activityComplete',{id:a.id});
    }
    while(s.alive && s.work.at(-1)?.remaining===0) finish(s,s.work.pop());
    cleanActivities(s);
    if(!s.alive) return;
    if(s.day===s.nextPulse) pulse(s);
    sorted();
    while(s.alive&&!s.pending&&s.queue[0]?.day<=s.day) {
      const e=s.queue.shift();
      check(order[e.type]===3,'Fato fora de fase');
      if(e.type==='offer' ? s.npcs[e.npc].alive : permitted(s,decisions.get(e.decision))&&repetition(s,decisions.get(e.decision))) {
        s.pending=e;
        if(e.type==='decision')expose(s,decisions.get(e.decision));
        log(s,'offer',{id:e.id,...(e.decision?{decision:e.decision}:{npc:e.npc})});
      } else {s.processed[e.id]=true;log(s,'invalidated',{id:e.id});}
    }
    if(!s.pending&&!s.work.length&&s.day===s.target)s.target=null;
  }
  function progress(s,dt) {
    cleanActivities(s);
    // Categorias simples substituem a distribuição de horas no conteúdo novo.
    for(const a of [...s.activities]) {
      const d=a.definition?activities.get(a.definition):null;
      if(d) {
        if(s.money < d.costPerDay*dt) { // O relógio inclui um marco antes de faltar dinheiro.
          throw new Error('Marco financeiro ausente');
        }
        s.money+=(d.pay-d.costPerDay)*dt;s.skills[d.skill]=(s.skills[d.skill]||0)+d.rate*dt;
      } else {s.skills[a.skill]=(s.skills[a.skill]||0)+a.hours*a.rate*dt;s.money+=a.pay*dt;}
    }
    if(s.work.length)s.work.at(-1).remaining-=dt;
  }
  function run(s,stopAfter=null) {
    while(s.alive&&!s.pending&&s.target!==null) {
      settle(s); if(!s.alive||s.pending||s.target===null)break;
      // Cumprir a duração da resposta não autoriza retomar o resto do salto.
      if(stopAfter!==null&&!s.work.some(w=>w.id===stopAfter))break;
      if(s.day===s.target) {s.target=null;break;}
      // Custos de rotina são reservados por dia, antes de contar renda futura.
      let dailyCost=s.activities.reduce((sum,a)=>sum+(a.definition?activities.get(a.definition).costPerDay:0),0);
      if(dailyCost>s.money) {
        for(const a of [...s.activities].filter(a=>a.definition&&activities.get(a.definition).costPerDay>0)) {
          s.activities=s.activities.filter(x=>x.id!==a.id);log(s,'activityInterrupted',{id:a.id,text:'A atividade foi interrompida por falta de recursos.'});
        }
        dailyCost=0;
      }
      const next=Math.min(s.target,s.nextPulse,...s.queue.map(e=>e.day),...s.activities.map(a=>a.end),
        s.work.length?s.day+s.work.at(-1).remaining:Infinity,dailyCost?s.day+1:Infinity);
      const dt=next-s.day;check(integer(dt,1),'Relógio travado');progress(s,dt);s.day=next;
    }
  }
  function options(s,d) {
    return d.options.filter(o=>eligible(s,o.visibleWhen)).map(o=>({id:o.id,label:o.label,intent:o.intent,hint:o.hint,cost:copy(o.cost),
      enabled:eligible(s,o.requires)&&s.money>=o.cost.money,
      reason:!eligible(s,o.requires)?o.blockedReason:s.money<o.cost.money?'Moedas insuficientes.':null}));
  }
  function begin(s,d,o,instance) {
    check(eligible(s,o.visibleWhen)&&eligible(s,o.requires)&&s.money>=o.cost.money,'Escolha indisponível');
    s.money-=o.cost.money;
    log(s,'intention',{id:instance,decision:d.id,choice:o.id,intent:o.intent,text:o.intent,cost:copy(o.cost)});
    const w={id:instance,decision:d.id,option:o.id,remaining:o.cost.days,started:s.day};
    if(o.cost.days) {
      s.work.push(w);
      s.target=Math.max(s.target??s.day,s.day+s.work.reduce((n,a)=>n+a.remaining,0));
      run(s,w.id);
    } else {finish(s,w);settle(s);}
  }
  const api = {
    create,save,load,
    addNPC:(s,key,details={})=>tx(s,t=>{check(id(key)&&key!=='player'&&!Object.hasOwn(t.npcs,key),'NPC inválido');t.npcs[key]={alive:true,name:key,location:t.location,...copy(details)};}),
    // API de compatibilidade do laboratório 1.2; horas não são expostas à UI nova.
    activity:(s,a)=>tx(s,t=>{idle(t);check(id(a.id)&&id(a.skill)&&integer(a.hours,1)&&a.hours<=12&&integer(a.duration,1)&&integer(a.rate??1)&&integer(a.pay??0)&&!t.activities.some(x=>x.id===a.id),'Atividade inválida');check(t.activities.filter(x=>!x.definition).reduce((n,x)=>n+x.hours,0)+a.hours<=12,'Agenda excedida');t.activities.push({...copy(a),rate:a.rate??1,pay:a.pay??0,end:t.day+a.duration});log(t,'activityStart',{id:a.id});}),
    cancel:(s,key)=>tx(s,t=>{idle(t);check(t.activities.some(a=>a.id===key),'Atividade inexistente');t.activities=t.activities.filter(a=>a.id!==key);log(t,'activityCancel',{id:key,text:'Você encerrou uma atividade.'});}),
    schedule:(s,e)=>tx(s,t=>{check(t.alive&&integer(e.day)&&e.day>t.day&&Object.hasOwn(order,e.type),'Evento inválido');push(t,e);}),
    advance:(s,days)=>tx(s,t=>{idle(t);check(integer(days,1)&&days<=36500,'Avanço inválido');t.target=t.day+days;run(t);}),
    age:s=>api.advance(s,365),
    resume:s=>tx(s,t=>{check(t.alive&&!t.pending&&t.target!==null,'Não há avanço para retomar');run(t);}),
    stop:s=>tx(s,t=>{check(!t.pending&&!t.work.length,'Resolva a decisão ou conclua a ação primeiro');t.target=null;}),
    abandon:s=>tx(s,t=>{check(t.alive&&!t.pending&&t.work.length,'Não há ação para abandonar');for(const w of t.work){t.resolved[w.id]=true;log(t,'actionAbandoned',{id:w.id,text:'Você abandonou a ação em andamento. Os custos pagos e o tempo passado foram preservados.'});}t.work=[];t.target=null;settle(t);}),
    act:(s,key,option)=>tx(s,t=>{idle(t);const d=decisions.get(key);check(d?.kind==='action'&&permitted(t,d)&&repetition(t,d),'Iniciativa indisponível');const o=d.options.find(x=>x.id===option);check(!!o,'Opção desconhecida');const instance=t.nextId++;expose(t,d);begin(t,d,o,instance);}),
    choose:(s,{instance,option})=>tx(s,t=>{
      check(t.alive&&t.pending?.type==='decision'&&t.pending.id===instance,'Decisão expirada ou já resolvida');
      const e=t.pending,d=decisions.get(e.decision);
      check(permitted(t,d),'Participantes ou situação indisponíveis');const o=d.options.find(x=>x.id===option);check(!!o,'Opção desconhecida');
      t.pending=null;begin(t,d,o,e.id);
    }),
    dismiss:s=>tx(s,t=>{ // Usado apenas se uma integração externa mudou participantes enquanto a UI estava aberta.
      check(t.pending?.type==='decision'&&!permitted(t,decisions.get(t.pending.decision)),'A decisão continua válida');
      t.processed[t.pending.id]=true;log(t,'invalidated',{id:t.pending.id});t.pending=null;settle(t);
    }),
    resolve:(s,choice)=>tx(s,t=>{check(t.alive&&t.pending?.type==='offer'&&['accept','decline'].includes(choice),'Escolha legada inválida');const e=t.pending;t.pending=null;t.resolved[e.id]=true;if(choice==='accept')t.money+=e.reward;log(t,'decision',{id:e.id,choice});settle(t);}),
    view:s=>{
      const p=s.pending,d=p?.type==='decision'?decisions.get(p.decision):null;
      return {day:s.day,age:readStat(s,'age'),alive:s.alive,money:s.money,health:s.health,location:s.location,
        skills:copy(s.skills),items:copy(s.items),
        activities:s.activities.map(a=>({id:a.id,label:activities.get(a.definition)?.label||a.id})),
        pending:d?{instance:p.id,title:d.title,text:d.text,options:options(s,d)}:p?{instance:p.id,title:p.title,legacy:true}:null,
        canAge:s.alive&&!p&&s.target===null&&!s.work.length,canResume:s.alive&&!p&&s.target!==null,
        canStop:s.target!==null&&!p&&!s.work.length,
        canAbandon:s.alive&&!p&&s.work.length>0,
        remaining:s.target===null?0:s.target-s.day,
        actions:s.alive&&!p&&s.target===null&&!s.work.length?[...decisions.values()].filter(d=>d.kind==='action'&&permitted(s,d)&&repetition(s,d)).map(d=>({id:d.id,title:d.title,text:d.text,options:options(s,d)})):[],
        diary:s.history.filter(h=>h.text).map(h=>({day:h.day,type:h.type,text:h.text})).slice(-80)};
    },
    select:(s,list,context)=>{let chosen=null;tx(s,t=>{if(!t.alive||t.pending)return;const candidates=list.filter(e=>e.context===context&&e.weight>0&&(!e.npc||t.npcs[e.npc]?.alive)&&(t.seen[e.id]?.count||0)<(e.max||1)&&t.day-(t.seen[e.id]?.last??-Infinity)>=(e.cooldown||0));if(!candidates.length)return;const e=weighted(t,candidates,x=>x.weight/(1+3*(t.seen[x.id]?.count||0)+2*(t.families[x.family]||0)));t.seen[e.id]={count:(t.seen[e.id]?.count||0)+1,last:t.day};t.families[e.family]=(t.families[e.family]||0)+1;log(t,'storylet',{id:e.id,family:e.family});chosen=e.id;});return chosen;},
  };
  return Object.freeze(api);
}
// Os testes originais podem usar o mesmo conjunto de funções sem catálogo narrativo.
export const {create,save,load,addNPC,activity,cancel,schedule,advance,resolve,resume,stop,select}=createEngine();
