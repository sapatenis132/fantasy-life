// Smoke do bundle real em VM com uma superfície DOM mínima, sem navegador.
// Detecta falhas de empacotamento e integração de comandos; não mede CSS/layout.
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../Fantasy_Life_Laboratorio_1_3.html',import.meta.url),'utf8');
const code=html.match(/<script>([\s\S]*)<\/script>/)[1];
function boot({raw,saveFails=false}={}){
  const ids=new Map(),storage=new Map(raw?[['fantasy-life-agencia-1.3',raw]]:[]);let document;
  class Element{
    constructor(tag){this.tagName=tag;this.children=[];this.events={};this.hidden=false;this.disabled=false;this.text='';this.value='';this.files=[];}
    set id(value){ids.set(value,this);this._id=value;}get id(){return this._id;}
    set textContent(value){this.text=value;this.children=[];}get textContent(){return this.text+this.children.map(x=>x.textContent).join('');}
    get firstChild(){return this.children[0];}get childElementCount(){return this.children.length;}
    append(...nodes){this.children.push(...nodes);}replaceChildren(...nodes){this.text='';this.children=nodes;}
    setAttribute(k,v){this[k]=v;}addEventListener(k,f){this.events[k]=f;}focus(){document.activeElement=this;}scrollIntoView(){}
    click(){if(!this.disabled)return this.events.click?.({target:this});}
  }
  document={createElement:tag=>new Element(tag),querySelector:selector=>ids.get(selector.slice(1)),activeElement:null};
  for(const match of html.matchAll(/<(\w+)[^>]*\bid="([^"]+)"/g)){const el=new Element(match[1]);el.id=match[2];}
  ids.get('seed').value='2026';
  const context=vm.createContext({document,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>{if(saveFails)throw new Error('sem espaço');storage.set(k,v);}},Blob,URL,setTimeout});
  new vm.Script(code,{filename:'Fantasy_Life_Laboratorio_1_3.html'}).runInContext(context);
  const walk=el=>[el,...el.children.flatMap(walk)];
  const button=label=>[...ids.values()].flatMap(walk).find(el=>el.tagName==='button'&&el.textContent.startsWith(label));
  return {get:key=>ids.get(key),button,raw:()=>storage.get('fantasy-life-agencia-1.3')};
}
test('HTML autocontido empacota sem imports e inicializa a apresentação',()=>{
  const b=boot();assert.match(b.get('stats').textContent,/16 anos/);assert.ok(b.button('Examinar e copiar'));assert.ok(!/^import /m.test(code));
});
test('HTML executa escolha e recarrega progresso salvo sem repetir efeitos',()=>{
  const b=boot();b.button('Examinar e copiar').click();assert.equal(JSON.parse(b.raw()).day,2);
  const restored=boot({raw:b.raw()});assert.match(restored.get('diary').textContent,/Você copia um circuito/);assert.equal(restored.raw(),b.raw());
});
test('HTML apresenta decisão, bloqueia avanço e retoma só por comando',()=>{
  const b=boot();b.get('advance').click();assert.equal(JSON.parse(b.raw()).day,14);assert.ok(b.get('advance').disabled);
  b.button('Pagar o carpinteiro').click();assert.equal(JSON.parse(b.raw()).day,14);assert.equal(b.get('advance').textContent,'Retomar avanço');
  b.get('advance').click();assert.equal(JSON.parse(b.raw()).day,365);assert.equal(JSON.parse(b.raw()).money,3);
});
test('HTML preserva vida anterior após importar arquivo inválido',async()=>{
  const b=boot();b.button('Examinar e copiar').click();const before=b.raw();
  b.get('import').files=[{text:async()=>'{"version":2}'}];await b.get('import').events.change({target:b.get('import')});
  assert.equal(b.raw(),before);assert.match(b.get('message').textContent,/não foi importada/);
});
test('HTML importa uma decisão pendente e mantém a pausa',async()=>{
  const b=boot();b.get('advance').click();const raw=b.raw(),other=boot();
  other.get('import').files=[{text:async()=>raw}];await other.get('import').events.change({target:other.get('import')});
  assert.equal(other.get('decision-title').textContent,'A chuva está chegando');assert.ok(other.get('advance').disabled);assert.equal(other.raw(),raw);
});
test('HTML comunica falha ao salvar sem perder a decisão na memória',()=>{
  const b=boot({saveFails:true});b.button('Examinar e copiar').click();assert.match(b.get('message').textContent,/não conseguiu salvar/);assert.match(b.get('diary').textContent,/Você copia um circuito/);
});
