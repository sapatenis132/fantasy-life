import {createEngine} from './motor.mjs';
import {catalog,newLife} from '../content/fatia.mjs';
const e=createEngine(catalog),key='fantasy-life-agencia-1.3';
const $=selector=>document.querySelector(selector);
let s=newLife(e),lastPending=null;
const message=text=>{const el=$('#message');el.textContent=text;el.hidden=!text;};
try {const raw=localStorage.getItem(key);if(raw)s=e.load(raw);} catch {message('Não foi possível carregar a vida salva. Você pode importar uma cópia; a versão anterior não será substituída até sua próxima ação.');}
function persist(){try{localStorage.setItem(key,e.save(s));}catch{message('Sua escolha foi aplicada, mas o navegador não conseguiu salvar. Exporte a vida para conservar este progresso.');}}
function command(fn){message('');try{fn();persist();render();}catch(error){message(error.message);}}
function node(tag,text,className){const el=document.createElement(tag);if(text)el.textContent=text;if(className)el.className=className;return el;}
function options(container,choice,callback){
  const group=node('div',null,'options');
  for(const o of choice.options){const button=node('button',null,'option');button.disabled=!o.enabled;button.append(node('strong',o.label),node('small',o.hint));
    if(o.reason)button.append(node('small',o.reason,'reason'));button.addEventListener('click',()=>command(()=>callback(o.id)));group.append(button);}
  container.append(group);
}
function render(){
  const v=e.view(s);
  $('#stats').replaceChildren(node('span',`${v.age} anos · Ponteclara`),node('span',`${v.money} moedas`),node('span',`Saúde ${v.health}`));
  $('#advance').disabled=!!v.pending||!v.alive;
  $('#advance').textContent=v.canResume?'Retomar avanço':'Envelhecer';
  $('#time-note').textContent=v.pending?'Uma decisão pede sua atenção.':v.canResume?`O avanço foi pausado. Restam ${v.remaining} dias; você pode retomar ou encerrar.`:'Avance um ano. O tempo para quando uma escolha importante aparece.';
  $('#stop').hidden=!v.canStop;$('#abandon').hidden=!v.canAbandon;
  $('#intro').hidden=s.history.some(h=>h.type==='intention')||s.day>0;
  const pending=$('#decision');pending.replaceChildren();pending.hidden=!v.pending;
  if(v.pending){pending.append(node('h2',v.pending.title));pending.firstChild.id='decision-title';pending.firstChild.tabIndex=-1;pending.append(node('p',v.pending.text));
    options(pending,v.pending,option=>e.choose(s,{instance:v.pending.instance,option}));}
  const actions=$('#actions');actions.replaceChildren();
  for(const action of v.actions){const detail=node('details',null,'initiative');detail.append(node('summary',action.title),node('p',action.text));options(detail,action,option=>e.act(s,action.id,option));actions.append(detail);}
  if(!v.actions.length)actions.append(node('p',v.pending?'Resolva a decisão para retomar suas iniciativas.':v.canResume?'Encerre o avanço para escolher outra atividade.':'Nenhuma iniciativa disponível neste momento.'));
  const activities=$('#activities');activities.replaceChildren();
  for(const a of v.activities){const row=node('div',null,'row'),button=node('button','Encerrar');button.disabled=!v.canAge;button.setAttribute('aria-label',`Encerrar ${a.label}`);button.addEventListener('click',()=>command(()=>e.cancel(s,a.id)));row.append(node('span',a.label),button);activities.append(row);}
  if(!v.activities.length)activities.append(node('p','Nenhum compromisso em andamento.'));
  const skillNames={oficio:'Ofício',arcanismo:'Arcanismo'},itemNames={grimorio:'Livro de diagramas',notas:'Anotações copiadas',lanterna:'Lanterna rúnica'};
  const possessions=$('#possessions');possessions.replaceChildren();
  for(const [id,value] of Object.entries(v.skills))possessions.append(node('p',`${skillNames[id]||id}: ${value}`));
  for(const [id,value] of Object.entries(v.items).filter(([,n])=>n>0))possessions.append(node('p',`${itemNames[id]||id}: ${value}`));
  if(!possessions.childElementCount)possessions.append(node('p','Nenhuma posse ou habilidade registrada.'));
  const diary=$('#diary');diary.replaceChildren();
  for(const h of [...v.diary].reverse()){const entry=node('li',null,'entry');entry.append(node('small',`Dia ${h.day}`),node('p',h.text));diary.append(entry);}
  if(!v.diary.length)diary.append(node('li','Sua história começa com a próxima escolha.','muted'));
  if(v.pending&&lastPending!==v.pending.instance){pending.firstChild.focus({preventScroll:true});pending.scrollIntoView({block:'nearest'});}
  lastPending=v.pending?.instance||null;
}
$('#advance').addEventListener('click',()=>command(()=>e.view(s).canResume?e.resume(s):e.age(s)));
$('#stop').addEventListener('click',()=>command(()=>e.stop(s)));
$('#abandon').addEventListener('click',()=>command(()=>e.abandon(s)));
$('#new').addEventListener('click',()=>command(()=>{const seed=Number($('#seed').value);const next=newLife(e,seed);s=next;lastPending=null;}));
$('#export').addEventListener('click',()=>{
  const url=URL.createObjectURL(new Blob([e.save(s)],{type:'application/json'}));const link=node('a');link.href=url;link.download=`Fantasy_Life_vida_dia_${s.day}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
$('#import').addEventListener('change',async event=>{
  const file=event.target.files[0];if(!file)return;
  try{const next=e.load(await file.text());s=next;message('');persist();render();}catch{message('A vida não foi importada: arquivo inválido ou de outra versão. Seu progresso atual foi preservado.');}
  event.target.value='';
});
render();
