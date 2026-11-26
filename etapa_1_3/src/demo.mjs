import {createEngine} from './motor.mjs';
import {catalog,newLife} from '../content/fatia.mjs';
const e=createEngine(catalog),key='fantasy-life-agencia-1.3';
const $=selector=>document.querySelector(selector);
let s=newLife(e),tab='story',selectedAction=null,lastPending=null;
function message(text){for(const selector of ['#message','#menu-message']){const el=$(selector);el.textContent=text;el.hidden=!text;}}
try{const raw=localStorage.getItem(key);if(raw)s=e.load(raw);}catch{message('Não foi possível carregar a vida salva. Você pode importar uma cópia nas opções. O arquivo anterior será preservado até sua próxima ação.');}
function persist(){try{localStorage.setItem(key,e.save(s));}catch{message('Sua escolha foi aplicada, mas o navegador não conseguiu salvar. Exporte a vida nas opções para conservar o progresso.');}}
function node(tag,text,className){const el=document.createElement(tag);if(text)el.textContent=text;if(className)el.className=className;return el;}
function toTop(focus){window.scrollTo({top:0,behavior:'instant'});if(focus)$(focus)?.focus({preventScroll:true});}
function command(fn){message('');try{fn();selectedAction=null;tab='story';persist();render();toTop(s.pending?'#decision-title':'#story-title');}catch(error){message(error.message);}}
function navigate(next){tab=next;selectedAction=null;render();toTop(next==='story'?(s.pending?'#decision-title':'#story-title'):next==='activities'?'#activities-title':'#character-title');}
function showAction(id){selectedAction=id;tab='story';render();toTop('#decision-title');}
function options(container,choice,callback){
  container.replaceChildren();const group=node('div',null,'options');
  for(const o of choice.options){const button=node('button',null,'option');button.disabled=!o.enabled;button.append(node('strong',o.label),node('small',o.hint));
    if(o.reason)button.append(node('small',o.reason,'reason'));button.addEventListener('click',()=>command(()=>callback(o.id)));group.append(button);}
  container.append(group);
}
function render(){
  const v=e.view(s);
  if(v.pending&&v.pending.instance!==lastPending){tab='story';selectedAction=null;}
  $('#identity').textContent=`${v.age} anos · Ponteclara`;$('#coins').textContent=`${v.money} moedas`;
  for(const name of ['story','activities','character']){$(`#${name}-panel`).hidden=tab!==name;$(`#nav-${name}`).setAttribute('aria-current',tab===name?'page':'false');}
  const action=v.actions.find(a=>a.id===selectedAction);if(selectedAction&&!action)selectedAction=null;
  const choice=v.pending||action,choiceVisible=tab==='story'&&!!choice;
  $('#decision').hidden=!choiceVisible;$('#diary').hidden=choiceVisible;
  $('#choice-back').hidden=!!v.pending;
  if(choice){$('#decision-title').textContent=choice.title;$('#decision-date').textContent=v.pending?'Uma escolha na sua vida':'Sua iniciativa';$('#decision-copy').textContent=choice.text;
    options($('#choice-options'),choice,id=>v.pending?e.choose(s,{instance:v.pending.instance,option:id}):e.act(s,action.id,id));
  }else $('#choice-options').replaceChildren();
  // A apresentação mantém resultados; o motor conserva também as intenções para auditoria.
  const entries=v.diary.filter(h=>h.type!=='intention'),latest=entries.at(-1);
  $('#story-date').textContent=latest?`Dia ${latest.day}`:'Ponteclara · uma nova etapa';
  $('#story-title').textContent=latest?(latest.type==='activityComplete'?'Uma etapa concluída':latest.type==='actionInvalidated'?'Os planos mudaram':'Sua história continua'):'Um achado inesperado';
  $('#story-copy').textContent=latest?latest.text:'Você tem 16 anos e vive em Ponteclara. Entre materiais descartados, encontrou um livro cheio de diagramas. O destino dele ainda está nas suas mãos.';
  const lastDecision=[...s.history].reverse().find(h=>h.type==='decision');
  const context=v.actions.find(a=>a.id==='livro.destino');
  const showContext=!!context&&(!entries.length||lastDecision?.decision==='livro.destino'&&latest?.type==='decision');
  $('#context-action').hidden=!showContext;$('#context-action').textContent='Ver o livro';
  $('#context-action').onclick=()=>showAction('livro.destino');
  const older=entries.slice(0,-1).reverse(),history=$('#history');history.replaceChildren();
  for(const h of older){const entry=node('li');entry.append(node('small',`Dia ${h.day}`,'date'),node('p',h.text));history.append(entry);}
  $('#older').hidden=choiceVisible||!older.length;
  $('#time-note').textContent=v.canResume?`Avanço pausado. Restam ${v.remaining} dias; você decide quando continuar.`:'';
  $('#pause-controls').hidden=!!choice||(!v.canStop&&!v.canAbandon);$('#stop').hidden=!v.canStop;$('#abandon').hidden=!v.canAbandon;
  $('#advance-row').hidden=choiceVisible;
  $('#advance').disabled=!v.alive||choiceVisible;$('#advance').textContent=v.pending?'Voltar à escolha':v.canResume?'Retomar avanço':'Envelhecer · +1 ano';
  const actions=$('#actions');actions.replaceChildren();
  $('#activities-note').textContent=v.pending?'Há uma escolha esperando por você na história.':v.canResume?'Você pode encerrar o avanço para tomar outra iniciativa.':'Você pode tomar a iniciativa quando quiser.';
  if(v.pending){const button=node('button','Voltar à escolha');button.addEventListener('click',()=>navigate('story'));actions.append(button);}
  else if(v.canStop){const button=node('button','Encerrar avanço e ver atividades');button.addEventListener('click',()=>{command(()=>e.stop(s));navigate('activities');});actions.append(button);}
  else if(v.canAbandon){const button=node('button','Abandonar a ação em andamento');button.addEventListener('click',()=>command(()=>e.abandon(s)));actions.append(button);}
  for(const a of v.actions){const button=node('button',null,'action-card');button.append(node('strong',a.title));button.addEventListener('click',()=>showAction(a.id));actions.append(button);}
  if(!actions.childElementCount)actions.append(node('p','Nenhuma iniciativa disponível neste momento.','muted'));
  const stats=$('#stats');stats.replaceChildren();
  for(const [label,value] of [['Idade',`${v.age} anos`],['Moedas',v.money],['Saúde',v.health]]){const p=node('p');p.append(node('strong',label),node('span',String(value)));stats.append(p);}
  const activities=$('#activities');activities.replaceChildren();
  for(const a of v.activities){const row=node('div',null,'commitment'),button=node('button','Encerrar');button.disabled=!v.canAge;button.setAttribute('aria-label',`Encerrar ${a.label}`);button.addEventListener('click',()=>command(()=>e.cancel(s,a.id)));row.append(node('span',a.label),button);activities.append(row);}
  if(!v.activities.length)activities.append(node('p','Nenhum compromisso em andamento.','muted'));
  const skillNames={oficio:'Ofício',arcanismo:'Arcanismo'},itemNames={grimorio:'Livro de diagramas',notas:'Anotações copiadas',lanterna:'Lanterna rúnica'};
  const possessions=$('#possessions');possessions.replaceChildren();const list=node('ul',null,'summary-list');
  for(const [id,value] of Object.entries(v.skills))list.append(node('li',`${skillNames[id]||id}: ${value}`));
  for(const [id,value] of Object.entries(v.items).filter(([,n])=>n>0))list.append(node('li',`${itemNames[id]||id}: ${value}`));
  possessions.append(list);if(!list.childElementCount)possessions.append(node('p','Nenhuma posse ou habilidade registrada.','muted'));
  if(v.pending&&lastPending!==v.pending.instance)toTop('#decision-title');lastPending=v.pending?.instance||null;
}
$('#nav-story').addEventListener('click',()=>navigate('story'));
$('#nav-activities').addEventListener('click',()=>navigate('activities'));
$('#nav-character').addEventListener('click',()=>navigate('character'));
$('#choice-back').addEventListener('click',()=>{selectedAction=null;render();toTop('#story-title');});
$('#advance').addEventListener('click',()=>{if(s.pending){navigate('story');return;}command(()=>e.view(s).canResume?e.resume(s):e.age(s));});
$('#stop').addEventListener('click',()=>command(()=>e.stop(s)));
$('#abandon').addEventListener('click',()=>command(()=>e.abandon(s)));
$('#open-menu').addEventListener('click',()=>$('#menu-dialog').showModal());
$('#close-menu').addEventListener('click',()=>$('#menu-dialog').close());
$('#new').addEventListener('click',()=>command(()=>{const next=newLife(e,Number($('#seed').value));s=next;lastPending=null;$('#menu-dialog').close();}));
$('#export').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([e.save(s)],{type:'application/json'}));const link=node('a');link.href=url;link.download=`Fantasy_Life_vida_dia_${s.day}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('#import').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;try{const next=e.load(await file.text());s=next;selectedAction=null;tab='story';lastPending=null;message('');persist();$('#menu-dialog').close();render();toTop(s.pending?'#decision-title':'#story-title');}catch{message('A vida não foi importada: arquivo inválido ou de outra versão. Seu progresso atual foi preservado.');}event.target.value='';});
render();
