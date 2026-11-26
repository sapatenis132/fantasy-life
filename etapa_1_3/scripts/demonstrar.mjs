import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {createEngine} from '../src/motor.mjs';
import {catalog,newLife} from '../content/fatia.mjs';
const e=createEngine(catalog),rows=[],root=new URL('../evidencias/',import.meta.url);
await mkdir(new URL('vidas/',root),{recursive:true});
function finish(s,policy={}) {
  for(let n=0;n<50&&(s.pending||s.target!==null);n++) {
    if(s.pending)e.choose(s,{instance:s.pending.id,option:policy[s.pending.decision]||'recusar'});
    else e.resume(s);
  }
  assert.equal(s.target,null);assert.equal(s.pending,null);
}
function to(s,day,policy={}){e.advance(s,day-s.day);finish(s,policy);}
async function record(key,name,s,description){
  assert.equal(s.day,365);
  const row={key,name,description,day:s.day,money:s.money,oficio:s.skills.oficio||0,arcanismo:s.skills.arcanismo||0,
    casaReparada:!!s.flags.casa_reparada,livro:s.items.grimorio||0,anotacoes:s.items.notas||0,
    confiancaMaira:s.relations['maira:player']||0,banca:!!s.flags.banca_conhecida,pocoEstavel:!!s.flags.poco_estavel,
    encomenda:!!s.flags.encomenda_assumida,opportunities:e.view(s).actions.map(a=>a.id),
    intentions:s.history.filter(h=>h.type==='intention').map(h=>({day:h.day,decision:h.decision,choice:h.choice}))};
  rows.push(row);await writeFile(new URL(`vidas/${key}.json`,root),e.save(s));
}
{
  const s=newLife(e,2026);to(s,365,{'familia.telhado':'reparar'});
  await record('tranquila','Cuidar de casa',s,'Consertar o telhado com trabalho próprio; conservar o livro e o dinheiro. Nenhuma aventura imposta.');
}
{
  const s=newLife(e,2026);e.act(s,'livro.destino','vender');e.act(s,'oficina.iniciativa','trabalhar');
  to(s,14,{'familia.telhado':'pagar'});e.act(s,'comercio.iniciativa','visitar');to(s,365);
  await record('comercio','Trabalho e comércio',s,'Vender o livro sem estudá-lo, trabalhar, pagar o conserto e pedir apresentação à banca.');
}
{
  const s=newLife(e,2026);e.act(s,'livro.destino','entregar');to(s,365,{'mentor.proposta':'aceitar','familia.telhado':'reparar'});
  await record('aprendiz','Aprendizagem acompanhada',s,'Entregar o volume, aceitar três meses de aprendizagem sem salário e fazer o conserto.');
}
{
  const s=newLife(e,2026);e.act(s,'livro.destino','examinar');e.act(s,'oficina.iniciativa','trabalhar');e.act(s,'oficina.iniciativa','estudar');
  to(s,42,{'magia.poco':'adiar','familia.telhado':'recusar'});e.act(s,'livro.destino','vender');
  e.act(s,'projeto.lanterna','construir');to(s,57);e.act(s,'familia.iniciativa','lanterna');e.act(s,'magia.investigar','estabilizar');
  to(s,71);e.act(s,'oficina.encomenda','assumir');to(s,365);
  await record('criacao','Conhecimento, criação e retorno',s,'Copiar antes de vender; trabalhar e estudar; adiar o poço; voltar ao telhado com uma lanterna e assumir uma encomenda após demonstrar a técnica.');
}
// Assinatura estrutural usa recursos, capacidades, vínculos, moradia e acesso, não IDs de texto.
const signatures=new Set(rows.map(r=>JSON.stringify([r.money,r.oficio,r.arcanismo,r.casaReparada,r.livro,r.anotacoes,r.confiancaMaira,r.banca,r.pocoEstavel,r.encomenda])));
assert.equal(signatures.size,4);
await writeFile(new URL('trajetorias.json',root),JSON.stringify({seed:2026,days:365,structurallyDifferent:signatures.size,rows},null,2));
let md='# Quatro trajetórias a partir do mesmo começo\n\nSeed 2026; 365 dias simulados; mesma pessoa, recursos, família e mundo inicial. Números são de laboratório, sem balanceamento de produção.\n\n';
md+='| Caminho | Moedas | Ofício | Arcanismo | Livro / notas | Confiança de Maíra | Banca | Poço / encomenda |\n|---|---:|---:|---:|---|---:|---|---|\n';
for(const r of rows)md+=`| ${r.name} | ${r.money} | ${r.oficio} | ${r.arcanismo} | ${r.livro} / ${r.anotacoes} | ${r.confiancaMaira} | ${r.banca?'Conhecida':'Não'} | ${r.pocoEstavel?'Estável':'Não'} / ${r.encomenda?'Concluída':'Não'} |\n`;
md+='\nTodas as quatro casas terminam reparadas, por meios e custos diferentes. A convergência na moradia conserva as diferenças em conhecimento, recursos, relações e acesso.\n\n';
for(const r of rows)md+=`## ${r.name}\n\n${r.description}\n\n`+r.intentions.map(i=>`- Dia ${i.day}: ${i.decision} → ${i.choice}`).join('\n')+'\n\n';
md+='## Alcance da evidência\n\nQuatro perfis controlados comprovam divergência de estado na fatia; não medem diversão, balanceamento, ausência de estratégia dominante ou cinquenta horas de novidade. Os saves em `vidas/` podem ser importados no HTML desta versão.\n';
await writeFile(new URL('TRAJETORIAS.md',root),md);
console.log(md);
