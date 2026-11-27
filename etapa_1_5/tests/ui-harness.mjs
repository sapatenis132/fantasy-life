import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {createLife,save,engine,travel,wait,act} from '../src/life.mjs';
import {PLACES} from '../src/world.mjs';
const html=readFileSync(new URL('../Fantasy_Life_Moinho.html',import.meta.url),'utf8'),code=html.match(/<script>([\s\S]*)<\/script>/)[1],KEY='fantasy-life-vida-1.4';
function boot(initial={},fail=false){const ids=new Map(),storage=new Map(Object.entries(initial));let active;
 class Element{
  constructor(tag){this.tagName=tag;this.children=[];this.events={};this.style={};this.hidden=false;this.open=false;this.disabled=false;this.value='';this.files=[];this.text='';}
  set id(v){this._id=v;ids.set(v,this);}get id(){return this._id;}
  set textContent(v){this.text=v;this.children=[];}get textContent(){return this.text+this.children.map(n=>n.textContent).join('');}
  append(...n){this.children.push(...n);}replaceChildren(...n){this.text='';this.children=n;}setAttribute(k,v){this[k]=v;}addEventListener(k,f){this.events[k]=f;}
  click(){if(!this.disabled)return this.events.click?.({target:this,preventDefault(){}});}focus(){active=this;}showModal(){this.open=true;}close(){this.open=false;}
 }
 const doc={getElementById:id=>ids.get(id),createElement:t=>new Element(t),createElementNS:(ns,t)=>new Element(t)};
 for(const m of html.matchAll(/<(\w+)[^>]*\bid="([^"]+)"[^>]*>/g)){const e=new Element(m[1]);e.id=m[2];e.hidden=/\shidden(?:\s|>)/.test(m[0]);}
 for(const[k,v]of Object.entries({name:'Ari',origin:'artesao',race:'humano',trait:'observador',talent:'oficio',gift:'eco',seed:'2026'}))ids.get(k).value=v;
 new vm.Script(code).runInNewContext({document:doc,window:{scrollTo(){}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>{if(fail)throw Error('sem espaço');storage.set(k,v);}},Blob,URL,setTimeout});
 const walk=e=>[e,...e.children.flatMap(walk)];
 const find=(label,scope)=>{const b=(scope?walk(ids.get(scope)):[...ids.values()].flatMap(walk)).find(e=>e.tagName==='button'&&e.textContent.startsWith(label));assert.ok(b,`Botão ${label}`);return b;};
 return {get:id=>ids.get(id),start:()=>ids.get('creator').events.submit({preventDefault(){}}),click:(label,scope)=>find(label,scope).click(),find,raw:()=>storage.get(KEY),storage,active:()=>active};
}

export {boot,KEY,html,code};
