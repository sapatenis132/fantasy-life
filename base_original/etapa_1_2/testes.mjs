import assert from 'node:assert/strict';
import {create,save,load,addNPC,activity,cancel,schedule,advance,resolve,resume,stop,select} from './motor.mjs';
let passed=0;function test(name,f){f();passed++;console.log('OK — '+name);}
function setup(seed=1){let s=create(seed);addNPC(s,'mestre');activity(s,{id:'estudo',hours:4,duration:120,skill:'magia'});schedule(s,{type:'offer',day:90,npc:'mestre',title:'Bolsa',reward:10});return s;}
test('Salto anual interrompe no dia 90',()=>{let s=setup();advance(s,365);assert.equal(s.day,90);assert.equal(s.target,365);assert.equal(s.skills.magia,360);assert.ok(s.pending);});
test('Escolha e retomada mantêm destino',()=>{let s=setup();advance(s,365);resolve(s,'accept');assert.equal(s.day,90);resume(s);assert.equal(s.day,365);assert.equal(s.money,10);assert.equal(s.skills.magia,480);});
test('Save durante decisão é reproduzível',()=>{let a=setup();advance(a,365);let b=load(save(a));for(let s of [a,b]){resolve(s,'decline');resume(s);}assert.equal(save(a),save(b));});
test('Morte no mesmo dia invalida convite',()=>{let s=setup();schedule(s,{day:90,type:'npcDeath',npc:'mestre'});advance(s,365);assert.equal(s.day,365);assert.equal(s.pending,null);assert.ok(s.history.some(e=>e.type==='invalidated'));});
test('Morte do jogador encerra relógio',()=>{let s=setup();schedule(s,{day:50,type:'playerDeath'});advance(s,365);assert.equal(s.day,50);assert.equal(s.alive,false);assert.throws(()=>advance(s,1));});
test('Agenda impede exceder 12 horas',()=>{let s=setup();assert.throws(()=>activity(s,{id:'trabalho',hours:9,duration:4,skill:'forja'}));});
test('Cancelar atividade impede progresso futuro',()=>{let s=setup();advance(s,30);cancel(s,'estudo');advance(s,30);assert.equal(s.skills.magia,120);});
test('Parar salto preserva dia e efeitos',()=>{let s=setup();advance(s,365);resolve(s,'accept');stop(s);assert.equal(s.day,90);assert.equal(s.money,10);advance(s,1);assert.equal(s.day,91);});
test('Avanço em partes tem mesmo resultado',()=>{let a=setup(),b=setup();advance(a,80);for(let i=0;i<8;i++)advance(b,10);assert.equal(save(a),save(b));});
test('Sem eventos elegíveis não inventa conteúdo',()=>{let s=create();assert.equal(select(s,[],'rural'),null);});
const catalog=Array.from({length:24},(_,i)=>({id:`e${i}`,family:`f${i%6}`,context:i<12?'rural':'cidade',weight:1,max:1}));
test('Contexto e limite por evento respeitados',()=>{let s=create();let result=Array.from({length:13},()=>select(s,catalog,'rural'));assert.equal(new Set(result.slice(0,12)).size,12);assert.equal(result[12],null);assert.ok(result.slice(0,12).every(x=>Number(x.slice(1))<12));});
test('Cooldown impede repetição imediata',()=>{let s=create();const c=[{id:'a',family:'a',context:'x',weight:1,max:2,cooldown:10}];assert.equal(select(s,c,'x'),'a');assert.equal(select(s,c,'x'),null);advance(s,10);assert.equal(select(s,c,'x'),'a');assert.equal(select(s,c,'x'),null);});
test('Ofertas simultâneas não somem',()=>{let s=setup();schedule(s,{day:90,type:'offer',npc:'mestre',title:'Outra',reward:20});advance(s,90);resolve(s,'accept');assert.ok(s.pending);resolve(s,'accept');assert.equal(s.target,null);assert.equal(s.money,30);});
test('500 trajetórias de laboratório sem inconsistência',()=>{const signatures=new Set();for(let seed=1;seed<=500;seed++){let s=setup(seed);for(let i=0;i<6;i++)select(s,catalog,'rural');signatures.add(s.history.filter(x=>x.type==='storylet').map(x=>x.id).join(','));advance(s,365);resolve(s,seed%2?'accept':'decline');resume(s);assert.equal(s.day,365);assert.equal(s.pending,null);assert.equal(s.skills.magia,480);assert.equal(s.money,seed%2?10:0);}console.log('Sequências distintas de IDs em seis seleções: '+signatures.size+'/500 (não mede diversão)');});
console.log(`\n${passed} testes aprovados.`);
