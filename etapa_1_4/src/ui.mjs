import {createLife,act,choose,travel,resume,stopRoute,abandon,save,load,migrateLegacy,view} from './life.mjs';
import {PLACES,EDGES,SKILLS,path,calendar} from './world.mjs';
const KEY='fantasy-life-vida-1.4',OLD='fantasy-life-agencia-1.3';
const $=id=>document.getElementById(id),clear=e=>e.replaceChildren(),text=(e,t)=>e.textContent=t;
function el(tag,content,cls){const e=document.createElement(tag);if(content!==undefined)e.textContent=content;if(cls)e.className=cls;return e;}
function button(label,fn,cls='link-button'){const b=el('button',label,cls);b.type='button';b.addEventListener('click',fn);return b;}
let state=null,composer=null,destination=null,oldRaw=null,unreadRaw=null,passage=null,characterTab='summary',selectedNeed='food';
const dialogs=['needs','status','map','character','people','calendar','diary','files'];
const dialog=id=>$(id==='files'?'files':`${id}-panel`);
function closePanels(){for(const id of dialogs)if(dialog(id).open)dialog(id).close();}
function showPanel(id){closePanels();if(state&&id==='character')renderCharacter(view(state));if(state&&id==='needs')renderNeed(view(state));dialog(id).showModal();}
function message(t=''){text($('message'),t);}
function store(){try{if(unreadRaw){localStorage.setItem(`${KEY}-recuperacao`,unreadRaw);unreadRaw=null;}localStorage.setItem(KEY,save(state));}catch{message('O navegador não conseguiu salvar. Exporte o personagem para guardar seu progresso.');}}
function focusScene(){window.scrollTo({top:0,behavior:'instant'});$(composer?'composer-title':'story-title').focus({preventScroll:true});}
function run(fn,title){
 try{
  const before=state.history.length,from=state.location;message();fn();
  // Só a resposta deste comando vira uma passagem. O histórico nunca alimenta a sala.
  const outcome=state.history.slice(before).filter(h=>h.type==='decision'||h.type==='actionInvalidated').at(-1);
  passage=!state.pending&&state.location===from&&outcome?{title:title||PLACES[state.location].name,text:outcome.text}:null;
  composer=null;closePanels();store();render();focusScene();
 }catch(e){message(e.message);}
}
function duration(n){return n>=60?`${Math.floor(n/60)}h${n%60?` ${n%60}min`:''}`:`${n}min`;}
function cost(o){return [o.cost.days?duration(o.cost.days):'sem tempo',o.cost.money?`${o.cost.money} moedas`:null].filter(Boolean).join(' · ');}
function options(container,items,onSelect){
 clear(container);const unavailable=[];
 for(const o of items){const b=button('',()=>onSelect(o.id),'option');b.append(el('strong',o.label),el('small',cost(o)));
  if(o.enabled)container.append(b);else{b.append(el('small',o.reason));b.disabled=true;unavailable.push(b);}}
 if(unavailable.length){const details=el('details');details.append(el('summary',`Outras possibilidades (${unavailable.length})`),...unavailable);container.append(details);}
}
function openAction(id){
 const a=view(state).actions.find(a=>a.id===id);if(!a)return;
 composer=id;passage=null;closePanels();render();focusScene();
}
function returnToPlace(){composer=null;passage=null;render();focusScene();}
function nav(label,fn,id){const b=button(label,fn,'hud-button');b.id=id;return b;}
function renderHud(container,prefix,v){
 clear(container);container.append(el('div','Fantasy Life','brand'));
 if(!v){container.append(el('p','Ponteclara','muted'),button('Arquivos e opções',()=>showPanel('files')));return;}
 container.append(el('p',v.identity.name,'hud-date'),el('div',v.place.name,'hud-place'),el('div',v.calendar.time,'hud-clock'),el('p',`${v.calendar.weekday} · ${v.calendar.date}`,'hud-date'),el('p',`${v.money} moedas`,'hud-money'));
 const bars=el('div',undefined,'hud-needs');
 for(const n of v.needs){const row=button('',()=>openNeed(n.id),`hud-need${n.value<20?' low':''}`),label=el('span',undefined,'need-label');row.setAttribute('aria-label',`${n.label}: ${n.value} de 100. Ver cuidados.`);label.append(el('span',n.label),el('span',String(n.value)));const bar=el('progress');bar.max=100;bar.value=n.value;bar.setAttribute('aria-hidden','true');row.append(label,bar);bars.append(row);}container.append(bars);
 const low=v.needs.filter(n=>n.value<20);if(low.length)container.append(el('p',low.map(n=>`${n.label} baixa`).join(' · '),'hud-alert'));
 const a=v.appointment;if(a&&['scheduled','offered'].includes(a.status)){const c=calendar(a.at);container.append(button(`Aula com Maíra · ${c.weekday} 09:00`,()=>showPanel('calendar')));}
 const controls=el('nav',undefined,'hud-nav');controls.setAttribute('aria-label','Menu do personagem');
 for(const [key,label,fn]of[
  ['character','Personagem',()=>{characterTab='summary';showPanel('character');}],
  ['skills','Habilidades',()=>{characterTab='skills';showPanel('character');}],
  ['people','Pessoas',()=>showPanel('people')],
  ['inventory','Mochila',()=>{characterTab='inventory';showPanel('character');}],
  ['map','Mapa',()=>showPanel('map')],['calendar','Agenda',()=>showPanel('calendar')],
  ['diary','Diário',()=>showPanel('diary')],['files','Arquivos',()=>showPanel('files')]
 ])controls.append(nav(label,fn,`${prefix}-nav-${key}`));
 container.append(controls,el('p','Ponteclara · 0.5.2','hud-footer'));
}
const compactNames={food:'Comida',energy:'Energia',hygiene:'Higiene',mood:'Ânimo'};
const careOptions={food:['comer','ajudar'],energy:['descansar','dormir'],hygiene:['lavar'],mood:['lazer','descansar']};
function openNeed(id){selectedNeed=id;showPanel('needs');}
function renderCompactNeeds(v){
 const box=$('quick-needs');clear(box);box.hidden=!v;if(!v)return;
 for(const n of v.needs){const b=button('',()=>openNeed(n.id),`compact-need${n.value<20?' low':''}`);b.id=`quick-need-${n.id}`;b.setAttribute('aria-label',`${n.label}: ${n.value} de 100${n.value<20?'. Baixa':''}. Ver cuidados.`);b.title=`${n.label}: ${n.value}/100`;
  const label=el('span',compactNames[n.id],'compact-label');if(n.value<20){const warning=el('span','!','need-warning');warning.setAttribute('aria-hidden','true');label.append(warning);}const bar=el('progress');bar.max=100;bar.value=n.value;bar.setAttribute('aria-hidden','true');b.append(label,bar);box.append(b);
 }
}
function renderNeed(v){
 const n=v.needs.find(n=>n.id===selectedNeed);if(!n)return;
 text($('need-title'),n.label);clear($('need-summary'));$('need-summary').append(el('p',`${n.value}/100${n.value<20?' · baixa':''}`,'need-reading'));const bar=el('progress');bar.max=100;bar.value=n.value;bar.setAttribute('aria-label',`${n.label}: ${n.value} de 100`);$('need-summary').append(bar);
 const hints={food:'Uma refeição recupera a saciedade. Você pode comer em casa ou na taverna; na taverna também pode ajudar em troca de comida.',energy:'Uma pausa recupera energia. No seu quarto, você também pode dormir.',hygiene:'Você pode se lavar no seu quarto ou no poço antigo.',mood:'Tempo livre e descanso ajudam a recuperar o ânimo. Conversar com as pessoas também pode fazer bem.'};
 const routine=v.actions.find(a=>a.id==='rotina');text($('need-hint'),!v.alive?'Sua jornada chegou ao fim.':v.pending?'Resolva a decisão atual antes de fazer uma pausa.':v.canResume||v.route.length?'Você pode consultar suas condições agora. Retome ou encerre a ação em andamento antes de escolher outra pausa.':hints[n.id]);
 const list=(routine?.options||[]).filter(o=>careOptions[n.id].includes(o.id));options($('need-options'),list,id=>run(()=>act(state,'rotina',id),'Uma pausa'));
}
function render(){
 $('creation').hidden=!!state;$('game').hidden=!state;
 const v=state?view(state):null;renderHud($('desktop-hud'),'desktop',v);renderHud($('mobile-hud'),'mobile',v);
 $('quick-map').disabled=!v;renderCompactNeeds(v);
 if(!v)return;
 text($('header-name'),v.place.name);text($('header-meta'),`${v.calendar.time} · ${v.calendar.weekday} · ${v.money} moedas`);
 $('scene').hidden=!!composer;$('composer').hidden=!composer;
 renderScene(v);renderMap(v);renderCharacter(v);renderPeople(v);renderCalendar(v);renderDiary(v);renderNeed(v);
 if(composer){const a=v.actions.find(a=>a.id===composer);if(!a){composer=null;$('scene').hidden=false;$('composer').hidden=true;return;}
  text($('composer-title'),a.title);text($('composer-text'),a.text);options($('composer-options'),a.options,o=>run(()=>act(state,a.id,o),a.title));}
}
function renderScene(v){
 const pending=v.pending,room=!pending&&!passage&&!v.canResume&&!v.route.length;
 text($('story-kicker'),`Ponteclara · ${v.calendar.phase.toLowerCase()}`);
 text($('story-title'),pending?.title||passage?.title||v.place.name);
 text($('story-copy'),pending?.text||passage?.text||v.place.text);
 $('people-area').hidden=!room;$('room-actions').hidden=!room;$('room-exits').hidden=!room;
 options($('pending-options'),pending?.options||[],o=>run(()=>choose(state,o),pending.title));
 text($('people'),v.people.length?'Por aqui':'');clear($('nearby-people'));
 for(const p of v.people)$('nearby-people').append(button(p.name,()=>{const a=v.actions.find(a=>a.id===`conversar_${p.id}`);if(a)openAction(a.id);else showPanel('people');}));
 clear($('local-actions'));for(const a of v.actions.filter(a=>!a.id.startsWith('conversar_')))$('local-actions').append(button(a.title,()=>openAction(a.id),'link-button action-link'));
 if(room&&!v.actions.length)$('local-actions').append(el('p','Você pode seguir para outro lugar.','empty'));
 clear($('exit-actions'));for(const[a,b,n]of EDGES){const to=a===v.location?b:b===v.location?a:null;if(!to)continue;const link=button('',()=>run(()=>travel(state,to)),'link-button action-link');link.append(el('span',PLACES[to].name),el('small',duration(n)));$('exit-actions').append(link);}
 clear($('passage-controls'));clear($('route-status'));
 if(!pending){
  if(v.canResume||v.route.length){$('passage-controls').append(button(v.canResume?'Retomar ação':'Continuar caminho',()=>run(()=>resume(state))));}
  else if(passage)$('passage-controls').append(button('Continuar',returnToPlace));
  if(v.route.length){$('route-status').append(el('p',`Você está a caminho de ${PLACES[v.route.at(-1).to].name}.`),button('Parar após este trecho',()=>run(()=>stopRoute(state))));}
  if(v.canResume)$('route-status').append(el('p',`Restam até ${duration(v.remaining)} para concluir o que você estava fazendo.`));
  if(v.canAbandon)$('route-status').append(button('Abandonar a ação atual',()=>run(()=>abandon(state))));
 }
 if(!v.alive){$('room-actions').hidden=true;$('room-exits').hidden=true;text($('story-title'),'O fim da jornada');text($('story-copy'),'Sua jornada chegou ao fim. As lembranças continuam guardadas no diário.');}
}
function renderMap(v){
 clear($('map-graphic'));const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 100 100');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');
 for(const[a,b]of EDGES){const line=document.createElementNS('http://www.w3.org/2000/svg','line');for(const[k,val]of Object.entries({x1:PLACES[a].x,y1:PLACES[a].y,x2:PLACES[b].x,y2:PLACES[b].y,stroke:'#44566b','stroke-width':.7}))line.setAttribute(k,String(val));svg.append(line);}$('map-graphic').append(svg);
 for(const[id,p]of Object.entries(PLACES)){const b=button(p.name,()=>{destination=id;renderMap(view(state));},id===v.location?'here':'');b.style.left=`${p.x}%`;b.style.top=`${p.y}%`;if(id===v.location)b.setAttribute('aria-label',`${p.name}, você está aqui`);$('map-graphic').append(b);}
 const box=$('map-destination');clear(box);box.hidden=!destination;
 if(destination){const p=PLACES[destination],route=path(v.location,destination);box.append(el('h3',p.name),el('p',p.text,'muted'));
  if(destination===v.location)box.append(el('p','Você está aqui.'));else{box.append(el('p',`${duration(route.minutes)} · ${route.legs.length} trecho(s)`));const b=button('Ir até lá',()=>run(()=>travel(state,destination)));b.disabled=!!v.pending||v.canResume||v.route.length>0;box.append(b);if(b.disabled)box.append(el('p','Resolva ou encerre a ação atual para escolher outro caminho.','muted'));}}
}
function renderCalendar(v){
 clear($('calendar'));$('calendar').append(el('p',`${v.calendar.weekday} · ${v.calendar.date} · ${v.calendar.time}`));
 const a=v.appointment;if(a){const c=calendar(a.at),status={scheduled:'Combinada',offered:'Sua aula está disponível',done:'Concluída',cancelled:'Cancelada com aviso',missed:'Horário perdido'}[a.status];$('calendar').append(el('p',`${status}: aula com Maíra, ${c.weekday} ${c.date}, 09:00–09:30, na oficina.`));}else $('calendar').append(el('p','Sem compromisso marcado. Converse com as pessoas para conhecer seus hábitos e combinar encontros.','muted'));
}
const itemNames={grimorio:'Livro anotado',lanterna:'Lanterna',reagente:'Reagente prateado',tinta_runica:'Tinta rúnica',tinta:'Tinta comum',semente_luz:'Semente luminosa',fivela:'Fivela',ervas:'Ervas',flor_vidro:'Flor de vidro',encomenda:'Encomenda de Maíra'};
function renderCharacter(v){
 text($('character-name'),`${v.identity.name} · ${v.age} anos`);text($('identity'),v.traits.join(' · '));clear($('needs'));
 for(const n of v.needs){const row=el('div',undefined,'need'),bar=el('progress');bar.max=100;bar.value=n.value;bar.setAttribute('aria-label',n.label);row.append(el('span',n.label),bar,el('span',String(n.value)));$('needs').append(row);}
 text($('health'),`Saúde: ${v.health}/100.`);clear($('skills'));for(const s of v.skills)$('skills').append(el('p',`${s.label}: ${s.value}${s.mastered?' · domínio alcançado':''}`,'facts'));
 clear($('inventory'));let count=0;for(const[id,n]of Object.entries(v.items))if(n){count++;$('inventory').append(el('p',`${itemNames[id]||id}: ${n}`,'facts'));}if(!count)$('inventory').append(el('p','Sua mochila está vazia.','empty'));if(v.project)$('inventory').append(el('p',`Lanterna: ${v.project}/180 min de trabalho.`,'facts'));
 for(const id of ['summary','skills','inventory']){$(`character-${id}`).hidden=characterTab!==id;$(`tab-${id}`).setAttribute('aria-selected',String(characterTab===id));$(`tab-${id}`).tabIndex=characterTab===id?0:-1;}
}
function renderPeople(v){
 clear($('people-here'));if(!v.people.length)$('people-here').append(el('p','Ninguém por perto agora.','empty'));
 for(const p of v.people){const a=v.actions.find(a=>a.id===`conversar_${p.id}`);$('people-here').append(a?button(`Conversar com ${p.name}`,()=>openAction(a.id)):el('p',p.name,'facts'));}
 clear($('contacts'));if(!v.contacts.length)$('contacts').append(el('p','Você ainda está conhecendo as pessoas de Ponteclara.','empty'));
 for(const c of v.contacts){const box=el('article',undefined,'contact');box.append(el('h3',`${c.name}${c.friend?' · amizade':''}`),el('p',`Sua confiança: ${c.trust}. Confiança em você: ${c.reciprocal}.`),el('p',c.routine||'Rotina ainda desconhecida.','muted'));$('contacts').append(box);}
}
function renderDiary(v){
 clear($('diary'));
 const memory=v.diary.filter(h=>['decision','arrival','migration','witness','consequence','appointment','milestone'].includes(h.type)&&!h.text.startsWith('Você chegou a '));
 for(const h of memory.slice(-24).reverse()){const a=el('article',undefined,'diary-entry');a.append(el('small',`${h.calendar.weekday} · ${h.calendar.date}`),el('p',h.text));$('diary').append(a);}
}
$('creator').addEventListener('submit',e=>{
 e.preventDefault();try{const seed=Number($('seed').value),next=createLife(seed,Object.fromEntries(['name','origin','race','trait','talent','gift'].map(k=>[k,$(k).value])));if(state)localStorage.setItem(`${KEY}-backup`,save(state));state=next;composer=null;passage=null;closePanels();message();store();render();focusScene();}catch(e){message(e.message);}
});
$('back').addEventListener('click',returnToPlace);
$('menu').addEventListener('click',()=>showPanel('status'));
$('quick-map').addEventListener('click',()=>showPanel('map'));
for(const id of dialogs)$(`close-${id==='files'?'files':id}`).addEventListener('click',()=>dialog(id).close());
const characterTabs=['summary','skills','inventory'];
for(const [index,id]of characterTabs.entries()){
 const tab=$(`tab-${id}`);tab.setAttribute('aria-controls',`character-${id}`);
 tab.addEventListener('click',()=>{characterTab=id;renderCharacter(view(state));});
 tab.addEventListener('keydown',e=>{const next=e.key==='ArrowRight'?(index+1)%3:e.key==='ArrowLeft'?(index+2)%3:e.key==='Home'?0:e.key==='End'?2:null;if(next===null)return;e.preventDefault();characterTab=characterTabs[next];renderCharacter(view(state));$(`tab-${characterTab}`).focus();});
}
$('new-character').addEventListener('click',()=>{$('new-confirm').hidden=false;});
$('confirm-new').addEventListener('click',()=>{closePanels();$('creation').hidden=false;$('game').hidden=true;$('new-confirm').hidden=true;window.scrollTo({top:0,behavior:'instant'});$('name').focus();});
$('export').addEventListener('click',()=>{if(!state){message('Crie ou importe um personagem primeiro.');return;}const a=el('a'),url=URL.createObjectURL(new Blob([save(state)],{type:'application/json'}));a.href=url;a.download='fantasy-life-personagem.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('import').addEventListener('change',async e=>{
 const file=e.target.files?.[0];if(!file)return;try{if(file.size>8000000)throw Error('Arquivo grande demais.');const raw=await file.text();let next;try{next=load(raw);}catch{next=migrateLegacy(raw);}if(state)localStorage.setItem(`${KEY}-backup`,save(state));state=next;composer=null;passage=null;message('Personagem importado.');store();closePanels();render();focusScene();}catch(e){message(`O personagem não foi importado. ${e.message}`);}finally{e.target.value='';}
});
$('migrate').addEventListener('click',()=>{try{state=migrateLegacy(oldRaw);composer=null;passage=null;store();message('Personagem transferido. O progresso anterior continua guardado.');render();}catch(e){message(e.message);}});
try{const raw=localStorage.getItem(KEY);unreadRaw=raw;if(raw)state=load(raw);unreadRaw=null;oldRaw=localStorage.getItem(OLD);$('legacy').hidden=!oldRaw;}catch(e){message(`Não foi possível abrir o personagem salvo. O arquivo foi preservado. ${e.message}`);}
render();
