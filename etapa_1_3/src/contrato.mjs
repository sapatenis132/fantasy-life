// Conteúdo declarativo: sem eval, funções ou caminhos de escrita arbitrários.
export const copy = x => JSON.parse(JSON.stringify(x));
export const integer = (x, min = 0) => Number.isSafeInteger(x) && x >= min;
export const check = (condition, message) => { if (!condition) throw new Error(message); };
export const id = x => typeof x === 'string' && /^[a-z][a-z0-9_.-]{0,95}$/.test(x)
  && !['__proto__', 'prototype', 'constructor'].includes(x);
const token = x => typeof x === 'string' && /^[a-z][a-z0-9_]{0,63}$/.test(x)
  && !['__proto__', 'prototype', 'constructor'].includes(x);
const text = x => typeof x === 'string' && x.trim().length > 0;
const record = x => x && typeof x === 'object' && !Array.isArray(x);
const scalar = x => typeof x === 'string' || typeof x === 'boolean' || Number.isSafeInteger(x);
const only=(object,keys)=>check(Object.keys(object).every(k=>keys.includes(k)), 'Campo desconhecido no contrato');
export function jsonData(x, depth = 0) {
  check(depth < 40, 'Dados excessivamente profundos');
  if (x === null || ['string', 'boolean'].includes(typeof x)) return;
  if (typeof x === 'number') { check(Number.isFinite(x), 'Número inválido'); return; }
  check(typeof x === 'object' && x !== undefined, 'Somente dados JSON são aceitos');
  for (const [key, value] of Object.entries(x)) {
    check(!['__proto__', 'prototype', 'constructor'].includes(key), 'Chave reservada');
    jsonData(value, depth + 1);
  }
}
export function statKey(key) {
  return ['money', 'health', 'age'].includes(key) || typeof key === 'string' && (
    /^(skill|aptitude):[a-z][a-z0-9_]*$/.test(key) && token(key.split(':')[1]) ||
    /^trust:[a-z][a-z0-9_]*:[a-z][a-z0-9_]*$/.test(key) && key.split(':').slice(1).every(token));
}
export function condition(c) {
  check(record(c), 'Condição inválida');
  const types = ['all', 'any', 'not', 'stat', 'flag', 'world', 'item', 'knows', 'person', 'freeSlot'];
  check(types.filter(k => Object.hasOwn(c, k)).length === 1, 'Condição deve ter um operador');
  const operator=types.find(k=>Object.hasOwn(c,k));
  only(c,{stat:['stat','op','value'],flag:['flag','is'],world:['world','is'],item:['item','min'],person:['person','alive','local']}[operator]||[operator]);
  if (c.all || c.any) {
    const list = c.all || c.any;
    check(Array.isArray(list) && list.length > 0, 'Grupo de condições vazio'); list.forEach(condition);
  } else if (c.not) condition(c.not);
  else if (c.stat) check(statKey(c.stat) && ['eq', 'gte', 'lte'].includes(c.op) && Number.isSafeInteger(c.value), 'Comparação inválida');
  else if (c.flag) check(token(c.flag) && typeof c.is === 'boolean', 'Flag inválida');
  else if (c.world) check(token(c.world) && scalar(c.is), 'Fato de mundo inválido');
  else if (c.item) check(token(c.item) && integer(c.min, 1), 'Requisito de item inválido');
  else if (c.knows) check(token(c.knows.who) && token(c.knows.fact), 'Conhecimento inválido');
  else if (c.freeSlot) check(['occupation','project'].includes(c.freeSlot), 'Categoria de compromisso inválida');
  else if (c.person) check(token(c.person) && (c.alive === undefined || typeof c.alive === 'boolean') &&
    (c.local === undefined || typeof c.local === 'boolean'), 'Pessoa inválida');
  else check(false, 'Operador de condição inválido');
}
function effects(list, refs) {
  check(Array.isArray(list), 'Efeitos devem ser uma lista');
  for (const e of list) {
    check(record(e), 'Efeito inválido');
    const fields={add:['stat','amount'],flag:['id','value'],world:['id','value'],item:['id','amount'],learn:['who','fact'],move:['who','to'],kill:['who'],schedule:['consequence','after'],offer:['decision'],startActivity:['activity'],cancelActivity:['activity']}[e.op];
    check(!!fields, `Operação de efeito desconhecida: ${e.op}`);only(e,['op',...fields]);
    switch (e.op) {
      case 'add': check(statKey(e.stat) && !['age'].includes(e.stat) && !e.stat.startsWith('aptitude:') && Number.isSafeInteger(e.amount), 'Alteração numérica inválida'); break;
      case 'flag': check(token(e.id) && typeof e.value === 'boolean', 'Efeito flag inválido'); break;
      case 'world': check(token(e.id) && scalar(e.value), 'Efeito mundo inválido'); break;
      case 'item': check(token(e.id) && Number.isSafeInteger(e.amount), 'Efeito item inválido'); break;
      case 'learn': check(token(e.who) && token(e.fact), 'Aprendizado inválido'); break;
      case 'move': check(token(e.who) && token(e.to), 'Deslocamento inválido'); break;
      case 'kill': check(token(e.who), 'Morte inválida'); break;
      case 'schedule': check(refs.consequences.has(e.consequence) && integer(e.after, 1), 'Consequência desconhecida ou prazo inválido'); break;
      case 'offer': check(refs.decisions.get(e.decision)?.kind === 'opportunity', 'Decisão futura desconhecida'); break;
      case 'startActivity': case 'cancelActivity': check(refs.activities.has(e.activity), 'Atividade desconhecida'); break;
      default: check(false, `Operação de efeito desconhecida: ${e.op}`);
    }
  }
}
function participants(list = []) {
  check(Array.isArray(list), 'Participantes inválidos');
  for (const p of list) {
    check(token(p.id) && typeof p.alive === 'boolean' && typeof p.local === 'boolean', 'Contrato de participante inválido');
  }
  check(new Set(list.map(p => p.id)).size === list.length, 'Participante duplicado');
}
function base(x) {
  check(id(x.id) && integer(x.version, 1), 'ID ou versão de conteúdo inválidos');
  if (x.requires) condition(x.requires);
  participants(x.participants);
}
export function compile(input) {
  jsonData(input);
  const c = copy(input);
  check(c.schemaVersion === 1 && id(c.id) && integer(c.version, 1), 'Schema de catálogo incompatível');
  for (const key of ['decisions', 'consequences', 'activities']) {
    check(Array.isArray(c[key]), `Catálogo sem ${key}`);
    check(new Set(c[key].map(x => x.id)).size === c[key].length, `IDs duplicados em ${key}`);
  }
  const refs = Object.fromEntries(['decisions', 'consequences', 'activities'].map(k => [k, new Map(c[k].map(x => [x.id, x]))]));
  for (const d of c.decisions) {
    base(d);
    check(['action', 'opportunity'].includes(d.kind) && id(d.family) && text(d.domain) && text(d.title) && text(d.text), 'Decisão incompleta');
    check(integer(d.repeat?.max, 1) && integer(d.repeat?.cooldown), 'Repetição sem limite explícito');
    if (d.selection) check(d.kind === 'opportunity' && Number.isFinite(d.selection.weight) && d.selection.weight > 0, 'Seleção inválida');
    check(Array.isArray(d.options) && d.options.length > 0, 'Decisão sem opções');
    check(new Set(d.options.map(x => x.id)).size === d.options.length, 'Opção duplicada');
    for (const o of d.options) {
      check(id(o.id) && text(o.label) && text(o.intent) && text(o.hint) && text(o.blockedReason), 'Opção incompleta');
      if (o.requires) condition(o.requires);
      if (o.visibleWhen) condition(o.visibleWhen);
      check(integer(o.cost?.money) && integer(o.cost?.days) && o.cost.days <= 36500, 'Custo inválido');
      effects(o.effects, refs);
      check(Array.isArray(o.outcomes) && o.outcomes.length > 0, 'Opção sem resultados');
      check(new Set(o.outcomes.map(x => x.id)).size === o.outcomes.length, 'Resultado duplicado');
      // Um fallback evita sorteio sem resultados após mudança de contexto.
      check(o.outcomes.some(r => !r.when && Number.isFinite(r.weight) && r.weight > 0), 'Resultado sem fallback');
      for (const r of o.outcomes) {
        check(id(r.id) && text(r.text) && Number.isFinite(r.weight) && r.weight > 0, 'Resultado inválido');
        if (r.when) condition(r.when);
        effects(r.effects, refs);
      }
    }
  }
  for (const e of c.consequences) {
    base(e); effects(e.effects, refs);
    check(['observed', 'private'].includes(e.visibility) && (e.visibility === 'private' || text(e.text)), 'Visibilidade de consequência inválida');
  }
  for (const a of c.activities) {
    base(a);
    check(text(a.label) && ['occupation', 'project'].includes(a.slot) && integer(a.duration, 1) &&
      token(a.skill) && integer(a.rate) && integer(a.pay) && integer(a.costPerDay), 'Atividade inválida');
    effects(a.onComplete, refs); check(text(a.completionText), 'Conclusão sem texto');
  }
  return { catalog: c, ...refs };
}
export function readStat(s, key) {
  const [type, a, b] = key.split(':');
  if (type === 'money' || type === 'health') return s[type];
  if (type === 'age') return Math.floor((s.day - s.birthDay) / 365);
  if (type === 'skill') return s.skills[a] || 0;
  if (type === 'aptitude') return s.attributes[a] || 0;
  if (type === 'trust') return s.relations[`${a}:${b}`] || 0;
  throw new Error('Estatística desconhecida');
}
export const person = (s, who) => who === 'player' ? { alive: s.alive, location: s.location } : s.npcs[who];
export function eligible(s, c) {
  if (!c) return true;
  if (c.all) return c.all.every(x => eligible(s, x));
  if (c.any) return c.any.some(x => eligible(s, x));
  if (c.not) return !eligible(s, c.not);
  if (c.stat) { const v = readStat(s, c.stat); return c.op === 'eq' ? v === c.value : c.op === 'gte' ? v >= c.value : v <= c.value; }
  if (c.flag) return (s.flags[c.flag] || false) === c.is;
  if (c.world) return s.world[c.world] === c.is;
  if (c.item) return (s.items[c.item] || 0) >= c.min;
  if (c.knows) return !!s.knowledge[c.knows.who]?.[c.knows.fact];
  if (c.freeSlot) return !s.activities.some(a=>a.slot===c.freeSlot);
  if (c.person) {
    const p = person(s, c.person);
    return !!p && (c.alive === undefined || p.alive === c.alive) && (c.local === undefined || (p.location === s.location) === c.local);
  }
  return false;
}
export const availableParticipants = (s, list = []) => list.every(p => eligible(s, {person: p.id, alive: p.alive, local: p.local ? true : undefined}));
