import {createLife,act,choose,travel,resume,stopRoute,abandon,save,load,migrateLegacy,view} from './life.mjs';
import {PLACES,EDGES,SKILLS,path,calendar} from './world.mjs';
const KEY='fantasy-life-vida-1.4',OLD='fantasy-life-agencia-1.3';
const $=id=>document.getElementById(id),clear=e=>e.replaceChildren(),text=(e,t)=>e.textContent=t;
function el(tag,content,cls){const e=document.createElement(tag);if(content!==undefined)e.textContent=content;if(cls)e.className=cls;return e;}
function button(label,fn,cls){const b=el('button',label,cls);b.type='button';b.addEventListener('click',fn);return b;}
let state=null,tab='story',composer=null,destination=null,oldRaw=null,unreadRaw=null;
function message(t=''){text($('message'),t);}
function store(){try{if(unreadRaw){localStorage.setItem(`${KEY}-recuperacao`,unreadRaw);unreadRaw=null;}localStorage.setItem(KEY,save(state));}catch{message('O navegador não conseguiu salvar. Exporte o personagem para guardar seu progresso.');}}
function run(fn){try{message();fn();composer=null;tab='story';store();render();window.scrollTo({top:0,behavior:'instant'});$('story-title').focus({preventScroll:true});}catch(e){message(e.message);}}
function showTab(name){tab=name;composer=null;render();window.scrollTo({top:0,behavior:'instant'});}
function duration(n){return n>=60?`${Math.floor(n/60)}h${n%60?` ${n%60}min`:''}`:`${n}min`;}
function cost(o){return [o.cost.days?duration(o.cost.days):'sem tempo',o.cost.money?`${o.cost.money} moedas`:null].filter(Boolean).join(' · ');}
function options(container,items,onSelect){clear(container);let locked;
 for(const o of items){const b=button('',()=>onSelect(o.id),'option');b.append(el('strong',o.label),el('small',cost(o)));if(o.enabled){container.append(b);continue;}
 b.append(el('small',o.reason));b.disabled=true;if(!locked){locked=el('details');locked.append(el('summary','Outras possibilidades'));container.append(locked);}locked.append(b);
 }}
function openAction(id){composer=id;tab='story';render();window.scrollTo({top:0,behavior:'instant'});}
function render(){
 const playing=!!state;$('creation').hidden=playing;$('game').hidden=!playing;$('dock').hidden=!playing;
 if(!playing)return;
 const v=view(state);text($('header-name'),`${v.identity.name} · ${v.place.name}`);text($('header-meta'),`${v.calendar.weekday}, ${v.calendar.date} · ${v.calendar.time} · ${v.money} moedas`);
 text($('warnings'),v.needs.filter(n=>n.value<20).map(n=>`${n.label} baixa`).join(' · '));
 for(const name of['story','map','character']){$(`${name}-panel`).hidden=tab!==name;$(`nav-${name}`).setAttribute('aria-current',tab===name?'page':'false');}
 const last=v.diary.filter(h=>['decision','arrival','migration','actionInvalidated','appointment','death'].includes(h.type)).at(-1);
 text($('story-kicker'),`${v.calendar.phase} em ${v.place.name}`);text($('story-title'),v.pending?.title||v.place.name);
 text($('story-copy'),v.pending?.text||last?.text||v.place.text);
 text($('people'),v.pending?'':`${v.place.text}\n${v.people.length?`Por aqui: ${v.people.map(p=>p.name).join(', ')}.`:''}`);
 options($('pending-options'),v.pending?.options||[],o=>run(()=>choose(state,o)));
 text($('route-status'),v.route.length?`Caminho para ${PLACES[v.route.at(-1).to].name} · ${v.route.reduce((n,l)=>n+l.minutes,0)} min em trechos previstos.`:v.canResume?`Uma ação está em andamento. Restam até ${duration(v.remaining)}.`:'');
 clear($('route-status'));if(v.canResume)$('route-status').append(el('p',`Ação em andamento · ${duration(v.remaining)} até o destino planejado.`));if(v.route.length){$('route-status').append(el('p',`Caminho para ${PLACES[v.route.at(-1).to].name}.`));if(!v.pending)$('route-status').append(button('Parar após este trecho',()=>run(()=>stopRoute(state))));}
 if(v.canAbandon)$('route-status').append(button('Abandonar a ação atual',()=>run(()=>abandon(state))));
 const main=$('main-action');main.disabled=!!v.pending||!v.alive;text(main,v.pending?'Há uma decisão no diário':v.canResume?'Retomar ação':v.route.length?'Continuar caminho':'O que fazer aqui');
 $('scene').hidden=!!composer;$('composer').hidden=!composer;
 if(composer){clear($('composer-options'));if(composer==='list'){text($('composer-title'),`O que fazer em ${v.place.name}?`);text($('composer-text'),'Escolha uma atividade para ver os caminhos possíveis. Abrir opções não passa o tempo.');for(const a of v.actions)$('composer-options').append(button(a.title,()=>openAction(a.id)));}
 else{const a=v.actions.find(a=>a.id===composer);if(a){text($('composer-title'),a.title);text($('composer-text'),a.text);options($('composer-options'),a.options,o=>run(()=>act(state,a.id,o)));}else composer=null;}}
 clear($('diary'));for(const h of v.diary.slice(-16).reverse()){const a=el('article',undefined,'diary-entry');a.append(el('small',`${h.calendar.weekday} · ${h.calendar.date} · ${h.calendar.time}`),el('p',h.text));$('diary').append(a);}
 renderMap(v);renderCharacter(v);
}
function renderMap(v){
 clear($('map-graphic'));const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 100 100');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');
 for(const[a,b]of EDGES){const l=document.createElementNS('http://www.w3.org/2000/svg','line');for(const[k,val]of Object.entries({x1:PLACES[a].x,y1:PLACES[a].y,x2:PLACES[b].x,y2:PLACES[b].y,stroke:'#536b56','stroke-width':1}))l.setAttribute(k,String(val));svg.append(l);}$('map-graphic').append(svg);
 for(const[id,p]of Object.entries(PLACES)){const b=button(p.name,()=>{destination=id;renderMap(view(state));},id===v.location?'here':'');b.style.left=`${p.x}%`;b.style.top=`${p.y}%`;if(id===v.location)b.setAttribute('aria-label',`${p.name}, você está aqui`);$('map-graphic').append(b);}
 const box=$('map-destination');clear(box);box.hidden=!destination;
 if(destination){const p=PLACES[destination],route=path(v.location,destination);box.append(el('h2',p.name),el('p',p.text,'muted'));if(destination===v.location)box.append(el('p','Você está aqui.'));else{box.append(el('p',`${route.minutes} min · ${route.legs.length} trecho(s)`));const b=button('Ir até lá',()=>run(()=>travel(state,destination)),'primary');b.disabled=!!v.pending||v.canResume||v.route.length>0;box.append(b);if(b.disabled)box.append(el('p','Resolva ou encerre a ação atual para escolher outro caminho.','muted'));}}
 clear($('calendar'));$('calendar').append(el('h2','Seu calendário'),el('p',`${v.calendar.weekday} · ${v.calendar.date} · ${v.calendar.time}`));
 const a=v.appointment;if(a){const c=calendar(a.at),status={scheduled:'Combinada',offered:'Sua aula está disponível',done:'Concluída',cancelled:'Cancelada com aviso',missed:'Horário perdido'}[a.status];$('calendar').append(el('p',`${status}: aula com Maíra, ${c.weekday} ${c.date}, 09:00–09:30, na oficina.`));}else $('calendar').append(el('p','Sem compromisso marcado. Horários conhecidos dos moradores aparecem em Personagem.','muted'));
}
const itemNames={grimorio:'Livro anotado',lanterna:'Lanterna',reagente:'Reagente prateado',tinta_runica:'Tinta rúnica',tinta:'Tinta comum',semente_luz:'Semente luminosa',fivela:'Fivela',ervas:'Ervas',flor_vidro:'Flor de vidro',encomenda:'Encomenda de Maíra'};
function renderCharacter(v){text($('character-name'),`${v.identity.name} · ${v.age} anos`);text($('identity'),v.traits.join(' · '));clear($('needs'));
 for(const n of v.needs){const row=el('div',undefined,'need'),bar=el('progress');bar.max=100;bar.value=n.value;bar.setAttribute('aria-label',n.label);row.append(el('span',n.label),bar,el('span',String(n.value)));$('needs').append(row);}
 text($('health'),`Saúde: ${v.health}/100. Alimentar-se, descansar, lavar-se e ter tempo livre ajudam a manter a rotina.`);clear($('skills'));for(const s of v.skills)$('skills').append(el('p',`${s.label}: ${s.value}${s.mastered?' · domínio alcançado':''}`,'facts'));
 clear($('contacts'));if(!v.contacts.length)$('contacts').append(el('p','Converse com alguém para conhecer seus hábitos.','muted'));for(const c of v.contacts){const box=el('div',undefined,'card');box.append(el('h3',`${c.name}${c.friend?' · amizade':''}`),el('p',`Sua confiança: ${c.trust}. Confiança em você: ${c.reciprocal}.`),el('p',c.routine||'Rotina ainda desconhecida.','muted'));$('contacts').append(box);}
 clear($('inventory'));for(const[id,n]of Object.entries(v.items))if(n)$('inventory').append(el('p',`${itemNames[id]||id}: ${n}`,'facts'));if(v.project)$('inventory').append(el('p',`Lanterna: ${v.project}/180 min de trabalho.`,'facts'));
}
$('creator').addEventListener('submit',e=>{e.preventDefault();try{const seed=Number($('seed').value);const next=createLife(seed,Object.fromEntries(['name','origin','race','trait','talent','gift'].map(k=>[k,$(k).value])));if(state)localStorage.setItem(`${KEY}-backup`,save(state));state=next;message();tab='story';store();render();window.scrollTo({top:0,behavior:'instant'});}catch(e){message(e.message);}});
$('main-action').addEventListener('click',()=>{const v=view(state);if(v.canResume||v.route.length)run(()=>resume(state));else openAction('list');});
$('back').addEventListener('click',()=>{composer=composer==='list'?null:'list';render();});
for(const n of['story','map','character'])$(`nav-${n}`).addEventListener('click',()=>showTab(n));
$('menu').addEventListener('click',()=>$('files').showModal());$('close-files').addEventListener('click',()=>$('files').close());
$('new-character').addEventListener('click',()=>{$('new-confirm').hidden=false;});
$('confirm-new').addEventListener('click',()=>{$('files').close();$('creation').hidden=false;$('game').hidden=true;$('dock').hidden=true;$('new-confirm').hidden=true;window.scrollTo({top:0,behavior:'instant'});});
$('export').addEventListener('click',()=>{if(!state){message('Crie ou importe um personagem primeiro.');return;}const a=el('a');const url=URL.createObjectURL(new Blob([save(state)],{type:'application/json'}));a.href=url;a.download='fantasy-life-personagem.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('import').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>8000000)throw Error('Arquivo grande demais.');const raw=await file.text();let next;try{next=load(raw);}catch{next=migrateLegacy(raw);}if(state)localStorage.setItem(`${KEY}-backup`,save(state));state=next;tab='story';composer=null;message('Personagem importado.');store();$('files').close();render();}catch(e){message(`O personagem não foi importado. ${e.message}`);}finally{e.target.value='';}});
$('migrate').addEventListener('click',()=>{try{state=migrateLegacy(oldRaw);store();message('Personagem transferido. O progresso anterior continua guardado.');render();}catch(e){message(e.message);}});
try{const raw=localStorage.getItem(KEY);unreadRaw=raw;if(raw)state=load(raw);unreadRaw=null;oldRaw=localStorage.getItem(OLD);$('legacy').hidden=!oldRaw;}catch(e){message(`Não foi possível abrir o personagem salvo. O arquivo foi preservado. ${e.message}`);}
render();
