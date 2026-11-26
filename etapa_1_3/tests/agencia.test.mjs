import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createEngine} from '../src/motor.mjs';
import * as old from '../../base_original/etapa_1_2/motor.mjs';
import {catalog,newLife} from '../content/fatia.mjs';
const clone=x=>JSON.parse(JSON.stringify(x));
const engine=()=>createEngine(catalog);
const sample=(seed=2026)=>{const e=engine();return [e,newLife(e,seed)];};
const choose=(e,s,option)=>e.choose(s,{instance:s.pending.id,option});
function finishAdvance(e,s,policy={}) {
  for(let n=0;n<100;n++) {
    if(s.pending)choose(e,s,policy[s.pending.decision]||({'magia.poco':'deixar','familia.telhado':'recusar','familia.retorno':'recusar','mentor.proposta':'recusar'})[s.pending.decision]);
    else if(s.target!==null)e.resume(s);
    else return;
  }
  throw new Error('Avanço não terminou');
}
function fixture({days=0,effects=[],outcomes,reactDays=0}={}) {
  const o=(id,days,effects)=>({id,label:id,intent:id,hint:'Custo explícito',blockedReason:'Indisponível',cost:{days,money:0},effects,outcomes:[{id:'feito',weight:1,text:'Resultado',effects:[]}]});
  const c={schemaVersion:1,id:'teste',version:1,activities:[],consequences:[],decisions:[
    {id:'acao',version:1,kind:'action',family:'f',domain:'teste',title:'Ação',text:'Texto',repeat:{max:2,cooldown:0},options:[{...o('fazer',days,effects),...(outcomes?{outcomes}:{})}]},
    {id:'reacao',version:1,kind:'opportunity',family:'g',domain:'teste',title:'Decisão',text:'Texto',repeat:{max:1,cooldown:0},options:[o('responder',reactDays,[{op:'add',stat:'money',amount:2}])]}
  ]};
  return c;
}

test('catálogo possui 12 decisões, 34 opções e operações declarativas',()=>{
  assert.equal(catalog.decisions.length,12);assert.equal(catalog.decisions.reduce((n,d)=>n+d.options.length,0),34);
  assert.ok(JSON.stringify(catalog).includes('conducao_segura'));engine();
});
test('iniciativa não depende de evento sorteado',()=>{
  const [e,s]=sample();e.act(s,'oficina.iniciativa','trabalhar');assert.equal(s.activities[0].id,'oficina');assert.equal(s.day,0);
});
test('trabalho e estudo combinam rotinas sem agenda de horas',()=>{
  const [e,s]=sample();e.act(s,'oficina.iniciativa','trabalhar');e.act(s,'oficina.iniciativa','estudar');e.advance(s,10);
  assert.equal(s.money,12);assert.equal(s.skills.oficio,10);assert.equal(s.skills.arcanismo,10);
});
test('examinar antes de vender conserva conhecimento e notas',()=>{
  const [e,s]=sample();e.act(s,'livro.destino','examinar');e.act(s,'livro.destino','vender');
  assert.equal(s.day,3);assert.equal(s.items.grimorio,0);assert.equal(s.items.notas,1);assert.ok(s.knowledge.player.diagramas);
  assert.ok(!e.view(s).actions.some(x=>x.id==='livro.destino'));
});
test('vender primeiro fecha o estudo do livro, mas abre contato depois',()=>{
  const [e,s]=sample();e.act(s,'livro.destino','vender');e.advance(s,10);
  assert.ok(!s.knowledge.player.diagramas);assert.ok(s.flags.contato_comercial);
  assert.ok(e.view(s).actions.some(x=>x.id==='comercio.iniciativa'));
});
test('conhecimento do mentor não é conhecimento do jogador nem da irmã',()=>{
  const [e,s]=sample();assert.ok(s.knowledge.maira.selo_proibido);assert.ok(!s.knowledge.player.selo_proibido);
  assert.ok(!e.view(s).actions[0].options.some(x=>x.id==='revelar'));
  e.act(s,'livro.destino','consultar');assert.ok(s.knowledge.player.selo_proibido);assert.ok(s.knowledge.maira.viu_grimorio);
  assert.ok(!s.knowledge.irma.selo_proibido);assert.ok(!s.knowledge.mercador.selo_proibido);
  const o=e.view(s).actions.find(x=>x.id==='livro.destino').options.find(x=>x.id==='revelar');assert.equal(o.enabled,false);
});
test('recusa de aprendizagem não inicia profissão nem elimina iniciativa',()=>{
  const [e,s]=sample();e.act(s,'livro.destino','entregar');e.advance(s,3);choose(e,s,'recusar');
  assert.equal(s.activities.length,0);assert.ok(s.flags.bolsa_recusada);assert.equal(s.target,null);
  assert.ok(e.view(s).actions.some(x=>x.id==='oficina.iniciativa'));
});
test('requisito de recursos tem motivo público e bloqueio atômico',()=>{
  const [e,s]=sample();s.money=2;
  const o=e.view(s).actions.find(x=>x.id==='livro.destino').options.find(x=>x.id==='consultar');
  assert.equal(o.reason,'Moedas insuficientes.');const before=e.save(s);
  assert.throws(()=>e.act(s,'livro.destino','consultar'));assert.equal(e.save(s),before);
});
test('efeito que falha reverte dinheiro, diário, IDs e PRNG',()=>{
  const e=createEngine(fixture({effects:[{op:'add',stat:'money',amount:10},{op:'item',id:'inexistente',amount:-1}]})),s=e.create(9);
  const before=e.save(s);assert.throws(()=>e.act(s,'acao','fazer'));assert.equal(e.save(s),before);
});
test('decisão pendente bloqueia envelhecer e nova iniciativa',()=>{
  const [e,s]=sample();e.age(s);assert.equal(s.day,14);const before=e.save(s);
  assert.throws(()=>e.age(s));assert.throws(()=>e.act(s,'oficina.iniciativa','trabalhar'));assert.equal(e.save(s),before);
});
test('token da decisão impede clique duplo e decisão errada',()=>{
  const [e,s]=sample();e.advance(s,14);const token=s.pending.id;choose(e,s,'recusar');const before=e.save(s);
  assert.throws(()=>e.choose(s,{instance:token,option:'pagar'}));assert.equal(e.save(s),before);
});
test('opções com projeto incompatível são bloqueadas sem gastar',()=>{
  const [e,s]=sample();s.money=40;e.act(s,'oficina.iniciativa','estudar');e.advance(s,14);
  const o=e.view(s).pending.options.find(x=>x.id==='reparar');assert.equal(o.enabled,false);
  const before=e.save(s);assert.throws(()=>choose(e,s,'reparar'));assert.equal(e.save(s),before);
});
test('pagar, reparar e recusar mudam recursos, habilidade e moradia',()=>{
  const rows=[];
  for(const option of ['pagar','reparar','recusar']) {
    const [e,s]=sample();e.age(s);choose(e,s,option);finishAdvance(e,s);
    rows.push([s.money,s.skills.oficio||0,!!s.flags.casa_reparada,!!s.world.quarto_interditado]);
  }
  assert.deepEqual(rows,[[3,0,true,false],[12,7,true,false],[12,0,false,true]]);
});
test('adiar volta em dez dias e sobrevive ao save',()=>{
  const [e,s]=sample();e.age(s);choose(e,s,'adiar');const b=e.load(e.save(s));
  for(const x of [s,b]){e.resume(x);assert.equal(x.day,24);assert.equal(x.pending.decision,'familia.retorno');}
  assert.equal(e.save(s),e.save(b));
});
test('consequência tardia ocorre uma vez após carregar',()=>{
  const [e,s]=sample();e.act(s,'livro.destino','vender');e.advance(s,4);const b=e.load(e.save(s));
  for(const x of [s,b]){e.advance(x,6);assert.equal(x.history.filter(h=>h.consequence==='comercio.retorno').length,1);e.advance(x,1);}
  assert.equal(e.save(s),e.save(b));
});
test('morte no mesmo dia invalida convite antes de apresentá-lo',()=>{
  const [e,s]=sample();e.act(s,'livro.destino','entregar');e.schedule(s,{type:'npcDeath',npc:'maira',day:3});e.advance(s,3);
  assert.equal(s.pending,null);assert.equal(s.npcs.maira.alive,false);assert.ok(!s.seen['mentor.proposta']);
});
test('mudança de local invalida consequência presencial',()=>{
  const c=clone(catalog);c.consequences.push({id:'partida',version:1,visibility:'private',effects:[{op:'move',who:'maira',to:'cidade'}]});
  const e=createEngine(c),s=newLife(e);e.act(s,'livro.destino','entregar');e.schedule(s,{type:'consequence',consequence:'partida',day:2});e.advance(s,3);
  assert.equal(s.pending,null);assert.ok(!e.view(s).actions.some(x=>x.id==='oficina.iniciativa'));
});
test('morte durante consulta preserva custo e tempo, sem resultado impossível',()=>{
  const [e,s]=sample();e.schedule(s,{type:'npcDeath',npc:'maira',day:1});e.act(s,'livro.destino','consultar');
  assert.equal(s.day,2);assert.equal(s.money,9);assert.ok(!s.knowledge.player.selo_proibido);assert.equal(s.work.length,0);
  assert.ok(s.history.some(h=>h.type==='actionInvalidated'));
});
test('atividade deixa de produzir depois da morte do mentor',()=>{
  const [e,s]=sample();e.act(s,'oficina.iniciativa','trabalhar');e.schedule(s,{type:'npcDeath',npc:'maira',day:4});e.advance(s,10);
  assert.equal(s.money,16);assert.equal(s.skills.oficio,4);assert.equal(s.activities.length,0);
});
test('ação de sete dias é interrompida no segundo dia sem recompensa antecipada',()=>{
  const e=createEngine(fixture({days:7,effects:[{op:'add',stat:'money',amount:5}]})),s=e.create();
  e.schedule(s,{type:'decision',decision:'reacao',day:2});e.act(s,'acao','fazer');
  assert.equal(s.day,2);assert.equal(s.money,0);assert.equal(s.work[0].remaining,5);
  const b=e.load(e.save(s));for(const x of [s,b]){choose(e,x,'responder');assert.equal(x.money,2);e.resume(x);assert.equal(x.day,7);assert.equal(x.money,7);}assert.equal(e.save(s),e.save(b));
});
test('reação demorada pausa a ação anterior e conta seu próprio tempo',()=>{
  const e=createEngine(fixture({days:7,reactDays:3,effects:[{op:'add',stat:'money',amount:5}]})),s=e.create();
  e.schedule(s,{type:'decision',decision:'reacao',day:2});e.act(s,'acao','fazer');choose(e,s,'responder');
  assert.equal(s.day,5);assert.equal(s.money,2);assert.equal(s.work[0].remaining,5);
  e.resume(s);assert.equal(s.day,10);assert.equal(s.money,7);assert.equal(s.work.length,0);
});
test('resposta com duração não retoma automaticamente o resto do ano',()=>{
  const e=createEngine(fixture({reactDays:3})),s=e.create();e.schedule(s,{type:'decision',decision:'reacao',day:14});e.age(s);
  choose(e,s,'responder');assert.equal(s.day,17);assert.equal(s.target,365);assert.equal(e.view(s).canResume,true);
  const b=e.load(e.save(s));e.stop(b);assert.equal(b.day,17);assert.equal(b.target,null);
});
test('ação interrompida pode ser abandonada sem reembolso ou recompensa',()=>{
  const c=fixture({days:7,effects:[{op:'add',stat:'money',amount:5}]});c.decisions[0].options[0].cost.money=3;
  const e=createEngine(c),s=e.create(3,{money:10});e.schedule(s,{type:'decision',decision:'reacao',day:2});e.act(s,'acao','fazer');choose(e,s,'responder');e.abandon(s);
  assert.equal(s.day,2);assert.equal(s.money,9);assert.equal(s.work.length,0);assert.equal(s.target,null);
});
test('morte do jogador durante ação não concede recompensa posterior',()=>{
  const e=createEngine(fixture({days:7,effects:[{op:'add',stat:'money',amount:50}]})),s=e.create();
  e.schedule(s,{type:'playerDeath',day:3});e.act(s,'acao','fazer');assert.equal(s.alive,false);assert.equal(s.day,3);assert.equal(s.money,0);e.load(e.save(s));
});
test('consultas de UI não sorteiam nem registram exposição',()=>{
  const [e,s]=sample();const before=e.save(s);for(let i=0;i<100;i++)e.view(s);assert.equal(e.save(s),before);
});
test('marcos semanais têm o mesmo resultado em salto e cliques diários',()=>{
  const [e,a]=sample(71),b=e.load(e.save(a));
  for(const s of [a,b])e.act(s,'livro.destino','examinar');
  e.advance(a,363);finishAdvance(e,a);
  while(b.day<365){e.advance(b,1);finishAdvance(e,b);}
  assert.equal(e.save(a),e.save(b));assert.equal(a.history.filter(h=>h.decision==='magia.poco'&&h.type==='offer').length,1);
});
test('salvar e retomar repetidamente não duplica a seleção do marco',()=>{
  let [e,s]=sample();e.act(s,'livro.destino','examinar');e.age(s);assert.equal(s.day,7);
  const seen=s.seen['magia.poco'].count;for(let i=0;i<30;i++)s=e.load(e.save(s));assert.equal(s.seen['magia.poco'].count,seen);
  choose(e,s,'deixar');finishAdvance(e,s);assert.equal(s.seen['magia.poco'].count,1);
});
test('consequência privada não vaza no diário público ou na visão',()=>{
  const [e,s]=sample();e.act(s,'livro.destino','examinar');e.advance(s,5);const v=e.view(s);
  assert.ok(s.world.eco_no_poco);assert.ok(!JSON.stringify(v).includes('origem_livro'));assert.ok(!JSON.stringify(v).includes('eco_no_poco'));
  assert.equal(s.history.filter(h=>h.consequence==='magia.eco').length,0);
});
test('projeto próprio exige combinação de conhecimentos e conserva notas vendidas',()=>{
  const [e,s]=sample();e.act(s,'livro.destino','examinar');e.act(s,'livro.destino','vender');
  e.act(s,'oficina.iniciativa','trabalhar');e.act(s,'oficina.iniciativa','estudar');e.age(s);finishAdvance(e,s,{'familia.telhado':'pagar'});
  assert.ok(e.view(s).actions.some(x=>x.id==='projeto.lanterna'));
  e.act(s,'projeto.lanterna','construir');e.advance(s,14);assert.equal(s.items.lanterna,1);assert.equal(s.items.grimorio,0);
});
test('estudo sem dinheiro é interrompido, sem renda ou dívida fantasma',()=>{
  const [e,s]=sample();s.money=2;e.act(s,'oficina.iniciativa','estudar');e.advance(s,10);
  assert.equal(s.money,0);assert.equal(s.skills.arcanismo,2);assert.equal(s.activities.length,0);
});
test('cancelar estudo preserva aprendizado e cessa custos futuros',()=>{
  const [e,s]=sample();e.act(s,'oficina.iniciativa','estudar');e.advance(s,3);e.cancel(s,'estudo');e.advance(s,5);
  assert.equal(s.money,9);assert.equal(s.skills.arcanismo,3);
});
test('retomar o telhado permite trocar uma lanterna construída mais tarde',()=>{
  const [e,s]=sample();e.act(s,'livro.destino','examinar');e.act(s,'oficina.iniciativa','trabalhar');e.act(s,'oficina.iniciativa','estudar');
  e.advance(s,40);finishAdvance(e,s,{'magia.poco':'adiar'});assert.ok(s.world.quarto_interditado);
  e.act(s,'projeto.lanterna','construir');e.advance(s,14);e.act(s,'familia.iniciativa','lanterna');
  assert.ok(s.flags.casa_reparada);assert.equal(s.world.quarto_interditado,false);assert.equal(s.items.lanterna,0);
});
test('adiar o poço permite iniciativa posterior e abre uma encomenda real',()=>{
  const [e,s]=sample();e.act(s,'livro.destino','examinar');e.act(s,'oficina.iniciativa','trabalhar');e.act(s,'oficina.iniciativa','estudar');
  e.advance(s,40);finishAdvance(e,s,{'magia.poco':'adiar'});
  e.act(s,'magia.investigar','estabilizar');e.advance(s,14);assert.ok(e.view(s).actions.some(x=>x.id==='oficina.encomenda'));
  const before=s.money;e.act(s,'oficina.encomenda','assumir');e.advance(s,14);
  // A oficina também pagou os seis dias restantes da temporada (dia 56 a 62).
  assert.equal(s.money,before-6+18+6);
});
test('opção de atributo avalia resultado condicional sem excluir fallback',()=>{
  const c=fixture({outcomes:[{id:'comum',weight:1,text:'Comum',effects:[]},{id:'especial',weight:100,text:'Especial',effects:[],when:{stat:'aptitude:intelecto',op:'gte',value:3}}]});
  const e=createEngine(c);const a=e.create(10,{attributes:{intelecto:1}});e.act(a,'acao','fazer');assert.equal(a.history.at(-1).outcome,'comum');
  const outcomes=new Set();for(let i=1;i<=100;i++){const s=e.create(i,{attributes:{intelecto:3}});e.act(s,'acao','fazer');outcomes.add(s.history.at(-1).outcome);}assert.ok(outcomes.has('especial'));
});
test('sementes iguais e escolhas iguais reproduzem resultados incertos',()=>{
  const [e,a]=sample(89),b=newLife(e,89);
  for(const s of [a,b]){e.act(s,'livro.destino','examinar');e.act(s,'livro.destino','experimentar');e.age(s);finishAdvance(e,s);}
  assert.equal(e.save(a),e.save(b));
});
test('resultados incertos incluem sucesso e ferimento em múltiplas seeds',()=>{
  const seen=new Set();for(let seed=1;seed<=100;seed++){const [e,s]=sample(seed);e.act(s,'livro.destino','examinar');e.act(s,'livro.destino','experimentar');seen.add(s.history.at(-1).outcome);}
  assert.deepEqual([...seen].sort(),['luz','queimadura']);
});
test('save v1 migra relógio, dinheiro, ofertas pendentes e agenda',()=>{
  const a=old.create(3);old.addNPC(a,'mestre');old.activity(a,{id:'estudo',hours:4,duration:120,skill:'magia'});old.schedule(a,{type:'offer',day:90,npc:'mestre',title:'Bolsa',reward:10});old.advance(a,365);
  const e=createEngine(),s=e.load(old.save(a));assert.equal(s.version,2);e.resolve(s,'accept');e.resume(s);assert.equal(s.skills.magia,480);assert.equal(s.money,10);assert.equal(s.day,365);
});
test('catálogo alterado não reutiliza silenciosamente save antigo',()=>{
  const [e,s]=sample();const c=clone(catalog);c.decisions[0].options[0].cost.days=8;
  assert.throws(()=>createEngine(c).load(e.save(s)),/incompatível/);
});
test('saves malformados, negativos e com instâncias duplicadas são rejeitados',()=>{
  const [e,s]=sample();e.age(s);const before=e.save(s);
  const mutations=[x=>x.money=-1,x=>x.rng=0,x=>x.day=-1,x=>x.nextPulse=1,x=>x.knowledge.player=null,x=>x.queue.push(clone(x.pending)),x=>x.resolved[x.pending.id]=true,x=>x.pending.decision='sumiu',x=>x.activities.push({id:'x',end:0})];
  for(const change of mutations){const b=JSON.parse(before);change(b);assert.throws(()=>e.load(JSON.stringify(b)));}
  assert.equal(e.save(s),before);
});
test('proteção contra propriedades de protótipo e scripts no conteúdo',()=>{
  const c=clone(catalog);c.decisions[0].requires=JSON.parse('{"flag":"__proto__","is":true}');assert.throws(()=>createEngine(c));
  const d=clone(catalog);d.decisions[0].options[0].effects=[{op:'eval',code:'alert(1)'}];assert.throws(()=>createEngine(d));
  const x=clone(catalog);x.decisions[0].requires=()=>true;assert.throws(()=>createEngine(x));
  const [e]=sample();assert.throws(()=>e.load('{"__proto__":{"admin":true}}'));
});
test('referências, custos, versões e fallback são validados na autoria',()=>{
  for(const mutate of [
    c=>c.decisions.push(clone(c.decisions[0])),c=>c.schemaVersion=8,c=>c.decisions[0].options[0].cost.days=-1,
    c=>c.decisions[0].options[0].outcomes.forEach(r=>r.when={flag:'impossivel',is:true}),
    c=>c.decisions[0].options[0].effects.push({op:'schedule',consequence:'sumiu',after:1})
  ]){const c=clone(catalog);mutate(c);assert.throws(()=>createEngine(c));}
});
test('conteúdo externo não altera um motor já compilado',()=>{
  const c=clone(catalog),e=createEngine(c),s=newLife(e);c.decisions[0].options[2].effects=[];e.act(s,'livro.destino','vender');assert.equal(s.items.grimorio,0);
});
test('500 percursos válidos atravessam pausas, saves e abandono sem violar invariantes',()=>{
  for(let seed=1;seed<=500;seed++) {
    const [e,start]=sample(seed);let s=start;
    if(seed%3===0)e.act(s,'livro.destino','examinar');
    if(seed%2===0)e.act(s,'livro.destino','consultar');else e.act(s,'livro.destino','vender');
    if(!s.pending&&s.target===null)e.act(s,'oficina.iniciativa','trabalhar');
    e.age(s);
    for(let n=0;n<30&&(s.pending||s.target!==null);n++) {
      s=e.load(e.save(s));
      if(s.pending){const choices=e.view(s).pending.options.filter(o=>o.enabled);const option=choices[(seed+n)%choices.length];assert.ok(option);choose(e,s,option.id);}
      else e.resume(s);
    }
    assert.equal(s.target,null);assert.equal(s.pending,null);assert.ok(s.money>=0);assert.ok(s.day>=365);e.load(e.save(s));
  }
});

test('arquivos históricos continuam presentes sem serem sobrescritos',()=>{
  assert.ok(readFileSync(new URL('../../base_original/etapa_1_2/motor.mjs',import.meta.url),'utf8').includes('version:1'));
});
test('conclusão que cancela outro projeto impede recompensa fantasma no mesmo dia',()=>{
  const c=clone(catalog),work=c.activities.find(a=>a.id==='oficina'),study=c.activities.find(a=>a.id==='estudo');
  work.duration=7;study.duration=7;work.onComplete=[{op:'cancelActivity',activity:'estudo'}];study.onComplete=[{op:'add',stat:'money',amount:100}];
  const e=createEngine(c),s=newLife(e);e.act(s,'oficina.iniciativa','trabalhar');e.act(s,'oficina.iniciativa','estudar');e.advance(s,7);
  assert.equal(s.money,12);assert.ok(!s.history.some(h=>h.type==='activityComplete'&&h.id==='estudo'));
});
test('erros de digitação em condições e operações são rejeitados',()=>{
  const c=clone(catalog);c.decisions[0].requires.extra=true;assert.throws(()=>createEngine(c),/desconhecido/);
  const d=clone(catalog);d.decisions[0].options[0].effects[0].everyone=true;assert.throws(()=>createEngine(d),/desconhecido/);
});
test('saves que reintroduzem saúde zero numa pessoa viva são rejeitados',()=>{
  const [e,s]=sample();const raw=JSON.parse(e.save(s));raw.health=0;assert.throws(()=>e.load(JSON.stringify(raw)));
});
