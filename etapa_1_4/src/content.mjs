import {EDGES,PLACES,SKILLS} from './world.mjs';
const all=(...c)=>({all:c}),flag=(id,is=true)=>({flag:id,is}),stat=(key,value)=>({stat:key,op:'gte',value}),at=id=>flag(`at_${id}`),add=(stat,amount)=>({op:'add',stat,amount}),mark=(id,value=true)=>({op:'flag',id,value}),item=(id,amount)=>({op:'item',id,amount}),learn=(fact,who='player')=>({op:'learn',who,fact}),move=to=>({op:'move',who:'player',to});
const fit=all(stat('need:food',15),stat('need:energy',15));
const result=(id,text,effects=[],when)=>({id,text,effects,weight:1,...(when?{when}:{})});
function option(id,label,minutes,text,effects=[],extra={}){return {id,label,intent:label,hint:minutes?`${minutes} min; o tempo passa apenas ao agir.`:'Sem passagem de tempo.',blockedReason:'Falta preparo, disposição ou alguma condição indicada.',cost:{money:0,days:minutes},effects:[],outcomes:[result('feito',text,effects)],...extra};}
function action(id,title,text,options,requires,extra={}){return {id,version:1,kind:'action',family:id,domain:'vida',title,text,repeat:{max:100000,cooldown:0},options,...(requires?{requires}:{}),...extra};}
const decisions=[];
for(const[a,b,n]of EDGES)for(const[from,to]of[[a,b],[b,a]])decisions.push(action(`ir_${from}_${to}`,`Ir a ${PLACES[to].name}`,'Percorrer um trecho da vila.',[option('andar','Seguir pelo caminho',n,`Você chegou a ${PLACES[to].name}.`,[move(to)],{travel:true})],at(from)));
decisions.push(action('rotina','Cuidar de si','Uma pausa também faz parte da aventura.',[
 option('comer','Comer pão e caldo',20,'O pão ainda está quente. Você termina a refeição com mais disposição.',[add('need:food',65),add('need:mood',8)],{cost:{money:2,days:20},requires:{any:[at('casa'),at('taverna')]}}),
 option('ajudar','Ajudar na taverna em troca de uma refeição',30,'Você ajuda a servir as mesas. Em troca, recebe uma refeição simples.',[add('need:food',45),add('need:energy',-3)],{requires:at('taverna'),completionRequires:at('taverna')}),
 option('lavar','Lavar-se',20,'A água leva embora o pó da estrada.',[add('need:hygiene',70)],{requires:{any:[at('casa'),at('poco')]}}),
 option('descansar','Descansar uma hora',60,'Você desacelera e recupera o fôlego.',[add('need:energy',22),add('need:mood',12)],{rest:true}),
 option('dormir','Dormir oito horas',480,'Você acorda e escuta a vila retomando seu próprio ritmo.',[add('need:energy',90),add('need:mood',15)],{sleep:true,requires:at('casa'),completionRequires:at('casa')}),
 option('esperar','Observar o lugar por meia hora',30,'Você acompanha o movimento ao redor. O mundo continua enquanto você espera.'),
 option('lazer','Aproveitar uma hora livre',60,'Sem uma tarefa para cumprir, você encontra espaço para respirar.',[add('need:mood',30)],{requires:{any:[at('taverna'),at('bosque'),at('casa')]}})
]));
for(const[npc,name]of[['maira','Maíra'],['mercador','Livreiro'],['breno','Breno']]){
 const participant=[{id:npc,alive:true,local:true}];
 decisions.push(action(`conversar_${npc}`,`Conversar com ${name}`,'Ouvir alguém é o começo de uma relação, não uma promessa de intimidade.',[
 option('ouvir','Ouvir e contar um pouco de si',20,`${name} compartilha um pouco de sua rotina. Vocês passam a se reconhecer melhor.`,[learn(`rotina_${npc}`),learn(`contato_${npc}`),add(`trust:player:${npc}`,5),add(`trust:${npc}:player`,5),add('need:mood',9)],{social:npc}),
 option('amizade','Propor uma amizade',15,`${name} aceita cultivar uma amizade com você. Isso não apaga diferenças nem garante favores.`,[mark(`amizade_${npc}`),add(`trust:${npc}:player`,4)],{requires:all(stat(`trust:${npc}:player`,25),{not:flag(`amizade_${npc}`)})})
 ],{person:npc,alive:true,local:true},{participants:participant,repeat:{max:100000,cooldown:120}}));
}
for(const[skill,name]of Object.entries(SKILLS)){
 const place={oficio:'oficina',alquimia:'bosque',arcanismo:'poco',esgrima:'patio',exploracao:'bosque'}[skill];
 decisions.push(action(`treinar_${skill}`,`Praticar ${name.toLowerCase()}`,'A prática ocupa tempo e disposição. A habilidade cresce ao concluir o exercício.',[
 option('praticar','Praticar durante uma hora',60,`Você termina uma sessão de ${name.toLowerCase()}, percebendo melhor onde pode melhorar.`,[add('need:energy',-6)],{requires:fit,completionRequires:at(place),practice:{skill,base:6}}),
 ...(skill==='esgrima'?[option('breno','Treinar com Breno',60,'Breno corrige sua base e põe seu controle à prova.',[add('need:energy',-9),add('trust:breno:player',2)],{requires:all(fit,{person:'breno',alive:true,local:true}),completionRequires:{person:'breno',alive:true,local:true},practice:{skill,base:9},cost:{money:2,days:60}})]:[])
 ],at(place)));
}
decisions.push(action('oficina','Trabalhar e criar','Um trabalho paga pelo serviço concluído. A lanterna é um projeto que você pode retomar.',[
 option('servico','Cumprir um serviço de duas horas',120,'Você entrega as peças revisadas e recebe seis moedas.',[add('money',6),add('need:energy',-10)],{requires:all(fit,flag('oficina_aberta')),completionRequires:at('oficina'),practice:{skill:'oficio',base:3}}),
 option('lanterna','Trabalhar uma hora na lanterna',60,'Mais uma parte da lanterna se encaixa. A peça guarda a marca do seu trabalho.',[add('need:energy',-6)],{requires:all(fit,stat('skill:oficio',25),{not:flag('lanterna_pronta')}),completionRequires:at('oficina'),project:true,practice:{skill:'oficio',base:4}}),
 option('vender','Vender a lanterna concluída',10,'Maíra examina sua lanterna e compra a peça por dezoito moedas.',[item('lanterna',-1),add('money',18)],{requires:all({item:'lanterna',min:1},{person:'maira',alive:true,local:true})}),
 option('aula','Combinar uma aula amanhã às 09:00',10,'Maíra reserva um horário amanhã, às nove. Você combina encontrá-la na oficina até 09:30.',[],{requires:all({person:'maira',alive:true,local:true},{not:flag('aula_marcada')}),appointment:true})
],at('oficina')));
decisions.push(action('livro','O livro que veio na mochila','As páginas marcadas podem ser uma fonte de conhecimento, uma mercadoria ou um risco calculado.',[
 option('examinar','Estudar as anotações',45,'Entre as margens você encontra uma sequência de runas incompleta. Guarda a descoberta para si.',[learn('runas_livro'),mark('livro_estudado')],{requires:all(fit,{not:flag('livro_estudado')}),completionRequires:{item:'grimorio',min:1},practice:{skill:'arcanismo',base:8}}),
 option('consultar','Pedir a opinião do livreiro',20,'O livreiro identifica uma cópia rara. Agora ele também sabe o que você carrega.',[learn('livro_raro'),learn('livro_raro','mercador'),mark('livro_avaliado')],{requires:all({person:'mercador',alive:true,local:true},{not:flag('livro_avaliado')})}),
 option('vender','Vender por doze moedas',10,'Você entrega o livro ao livreiro. As anotações que já aprendeu continuam com você.',[item('grimorio',-1),add('money',12)],{requires:{person:'mercador',alive:true,local:true}}),
 option('negociar','Negociar o valor da cópia rara',15,'Você apresenta os detalhes da edição. O livreiro paga vinte e quatro moedas.',[item('grimorio',-1),add('money',24)],{requires:all({person:'mercador',alive:true,local:true},{knows:{who:'player',fact:'livro_raro'}})})
],{item:'grimorio',min:1}));
decisions.push(action('poco','Investigar o poço','A água responde de maneiras diferentes a quem se aproxima.',[
 option('runa','Conduzir a vibração das runas',40,'Você estabiliza o pulso da água. Aprende um padrão que antes não reconhecia.',[learn('pulso_poco'),mark('poco_resolvido')],{requires:all(fit,stat('skill:arcanismo',30)),completionRequires:at('poco'),practice:{skill:'arcanismo',base:10}}),
 option('eco','Ouvir com seu Eco espiritual',25,'Uma presença responde ao seu dom. Ela indica uma passagem esquecida entre as raízes.',[learn('passagem_raizes'),mark('poco_resolvido'),add('need:energy',-8)],{requires:flag('dom_eco')}),
 option('observar','Investigar marcas na pedra',30,'Você encontra marcas de manutenção e descobre como aliviar a pressão da água sem magia.',[learn('mecanismo_poco'),mark('poco_resolvido')],{requires:{any:[flag('traco_observador'),stat('skill:oficio',30)]}})
],all(at('poco'),{not:flag('poco_resolvido')})));
decisions.push(action('dom','Usar seu dom','O Pulso vital restaura o corpo, mas consome sua disposição.',[option('curar','Canalizar o Pulso vital',15,'O calor percorre seus braços e fecha pequenas feridas.',[add('health',15),add('need:energy',-18)],{requires:stat('need:energy',30),completionRequires:flag('dom_pulso')})],flag('dom_pulso'),{repeat:{max:100000,cooldown:240}}));
decisions.push(action('despertar','Investigar seu potencial latente','A experiência reunida ao explorar e estudar começa a ganhar forma.',[option('tentar','Tentar despertar o dom',60,'Seu potencial desperta como Eco espiritual. A água devolve um som que só você percebe.',[mark('dom_eco'),mark('dom_latente',false),add('need:energy',-15)],{requires:all(fit,stat('skill:arcanismo',30),stat('skill:exploracao',35)),completionRequires:at('poco')})],all(at('poco'),flag('dom_latente'))));
const lesson=action('aula_agendada','A aula combinada','Maíra separou ferramentas e um problema real: reparar uma dobradiça sem partir o metal.',[
 option('aprender','Participar da aula',60,'Maíra acompanha suas tentativas e explica as tensões do metal. O compromisso foi cumprido.',[add('trust:maira:player',8)],{cost:{money:3,days:60},requires:fit,completionRequires:{person:'maira',alive:true,local:true},practice:{skill:'oficio',base:14},lesson:true}),
 option('cancelar','Explicar que não poderá ficar',0,'Você avisa Maíra antes de ir. Ela libera o horário, sem transformar isso em uma dívida.',[],{lesson:true})
],at('oficina'),{kind:'opportunity',participants:[{id:'maira',alive:true,local:true}],repeat:{max:100000,cooldown:0}});decisions.push(lesson);
const market=action('reagente','Uma caixa fora da banca','Uma vendedora de passagem oferece um reagente de brilho prateado. Ela pede quatro moedas e admite não conhecer sua origem.',[
 option('comprar','Comprar sem examinar',5,'Você guarda o reagente. Seu valor real ainda precisa ser descoberto.',[item('reagente',1),mark('reagente_comprado')],{cost:{money:4,days:5},purchase:true}),
 option('examinar','Examinar antes de decidir',15,'Você analisa o pó e o modo como ele reage à luz.',[],{resolution:'first',outcomes:[result('perito','Seu conhecimento identifica um reagente autêntico.',[mark('qualidade_conhecida'),{op:'offer',decision:'reagente_retorno'}],all(stat('skill:alquimia',30),{world:'reagente_real',is:true})),result('falso','A cor parece boa, mas a mistura é comum. Você percebe a diferença.',[mark('qualidade_conhecida'),{op:'offer',decision:'reagente_retorno'}],stat('skill:alquimia',30)),result('incerto','Você não tem certeza. Aprendeu algo ao observar, mas não o suficiente para garantir a origem.',[{op:'offer',decision:'reagente_retorno'}])],practice:{skill:'alquimia',base:2}}),
 option('deixar','Seguir sem comprar',0,'Você agradece e segue. Uma oportunidade recusada também é uma escolha.')
],all(at('mercado'),flag('mercado_aberto'),{not:flag('reagente_comprado')}),{kind:'opportunity',selection:{weight:1},repeat:{max:3,cooldown:2880}});decisions.push(market);
decisions.push(action('reagente_retorno','Decidir sobre o reagente','A mesma vendedora espera sua decisão. A mercadoria continua sendo a que você examinou.',[market.options[0],market.options[2]],at('mercado'),{kind:'opportunity'}));
decisions.push(action('usar_reagente','Preparar uma tinta rúnica','Você pode transformar o reagente em um material útil. O processo revela sua qualidade.',[option('misturar','Preparar a mistura',45,'A mistura termina.',[item('reagente',-1)],{requires:all(fit,stat('skill:alquimia',25)),completionRequires:at('casa'),resolution:'first',outcomes:[result('real','A tinta prateada conduz energia. Você criou um material valioso.',[item('tinta_runica',1)],{world:'reagente_real',is:true}),result('comum','O brilho se desfaz. Resta uma tinta comum; a experiência ensina como reconhecer a mistura.',[item('tinta',1)])],practice:{skill:'alquimia',base:8}})],all(at('casa'),{item:'reagente',min:1})));
decisions.push(action('bosque_encontro','Um fio de luz entre raízes','Uma criatura pequena prendeu a pata em uma fivela abandonada. Ela se debate quando você se aproxima.',[
 option('ferramenta','Soltar a fivela com cuidado',25,'Suas mãos destravam a peça. A criatura deixa uma semente luminosa antes de desaparecer.',[item('semente_luz',1)],{requires:{any:[stat('skill:oficio',25),flag('traco_observador')]}}),
 option('eco','Acalmá-la com seu Eco espiritual',15,'Seu dom transforma o medo em uma breve aproximação. Ela entrega uma semente à sua mão.',[item('semente_luz',1),learn('espirito_bosque')],{requires:flag('dom_eco')}),
 option('tentar','Tentar soltar a criatura',30,'Você tenta abrir a fivela.',[],{outcomes:[{...result('livre','A fivela cede. A criatura foge, deixando uma semente luminosa.',[item('semente_luz',1)]),weight:3},result('falha','A criatura se assusta e arranha sua mão antes de escapar. Você recupera a fivela e aprende com a tentativa.',[add('health',-5),item('fivela',1)])],practice:{skill:'exploracao',base:4}}),
 option('recuar','Recuar e não interferir',0,'Você se afasta. A criatura procura outra saída entre as raízes.')
],at('bosque'),{kind:'opportunity',selection:{weight:1},repeat:{max:2,cooldown:4320}}));
decisions.push(action('colher','Procurar ingredientes no bosque','A luz, seu equipamento e sua experiência mudam os caminhos disponíveis.',[
 option('ervas','Coletar ervas pela trilha',45,'Você volta com ervas úteis para misturas.',[item('ervas',2)],{requires:all(fit,{any:[flag('luz_dia'),flag('raca_elfo'),{item:'lanterna',min:1}]}),completionRequires:at('bosque'),practice:{skill:'exploracao',base:4}}),
 option('raro','Seguir rastros de uma planta rara',45,'Sua leitura do terreno leva a uma flor de vidro, escondida acima da trilha.',[item('flor_vidro',1)],{requires:all(fit,flag('dominio_exploracao')),completionRequires:at('bosque'),practice:{skill:'exploracao',base:5}})
],at('bosque'),{repeat:{max:100000,cooldown:180}}));
decisions.push(action('tecnicas','Aplicar uma técnica aprendida','O domínio de uma habilidade libera usos que a prática inicial não oferecia.',[
 option('guarda','Praticar a Guarda firme',45,'Você sustenta a base sob pressão e transforma esforço em controle.',[add('need:energy',-8)],{requires:all(at('patio'),fit,flag('dominio_esgrima')),completionRequires:at('patio'),practice:{skill:'esgrima',base:10}}),
 option('reparo','Fazer um reparo delicado',60,'O mecanismo volta a funcionar. Você recebe oito moedas pelo reparo especializado.',[add('money',8)],{requires:all(at('oficina'),fit,flag('dominio_oficio'),flag('oficina_aberta')),completionRequires:at('oficina'),practice:{skill:'oficio',base:4}}),
 option('tintura','Preparar uma tintura medicinal',40,'Você prepara uma tintura e trata as feridas que carregava.',[item('ervas',-2),add('health',12)],{requires:all(at('casa'),fit,flag('dominio_alquimia'),{item:'ervas',min:2}),completionRequires:at('casa'),practice:{skill:'alquimia',base:4}}),
 option('foco','Conduzir energia sem desperdiçá-la',30,'A condução segura reduz sua tensão. Você recupera parte da disposição.',[add('need:energy',12)],{requires:all(at('poco'),flag('dominio_arcanismo')),completionRequires:at('poco')})
],{any:[flag('dominio_esgrima'),flag('dominio_oficio'),flag('dominio_alquimia'),flag('dominio_arcanismo')]}));
decisions.push(action('encomenda','Uma encomenda esquecida','Na mureta da praça, uma pequena encomenda traz o nome de Maíra. O lacre continua inteiro.',[
 option('levar','Guardar para devolver',5,'Você guarda a encomenda sem romper o lacre. Entregá-la será uma escolha sua.',[item('encomenda',1),learn('encomenda_maira')]),
 option('deixar','Deixar onde está',0,'Você deixa a encomenda sobre a mureta e segue seu caminho.')
],at('praca'),{kind:'opportunity',selection:{weight:1},repeat:{max:1,cooldown:0}}));
decisions.push(action('entrega','A encomenda de Maíra','O que você faz com algo que encontrou também constrói sua história.',[
 option('devolver','Devolver a Maíra',10,'Maíra reconhece o lacre intacto. Ela agradece e passa a confiar mais em você.',[item('encomenda',-1),add('trust:maira:player',12),learn('encomenda_devolvida','maira')],{requires:{person:'maira',alive:true,local:true}}),
 option('vender','Vender o pacote fechado no mercado',10,'Você recebe dez moedas. Maíra não sabe quem ficou com a encomenda.',[item('encomenda',-1),add('money',10)],{requires:all(at('mercado'),flag('mercado_aberto'))})
],{item:'encomenda',min:1}));
decisions.push(action('poco_retorno','Levar a descoberta à oficina','Maíra só saberá do que você encontrou se você decidir contar.',[
 option('contar','Compartilhar sua descoberta',20,'Maíra relaciona sua descoberta a um selo usado na oficina. Ela propõe uma encomenda, sem exigir que você aceite.',[learn('poco_resolvido','maira'),mark('poco_compartilhado'),add('trust:maira:player',5)],{requires:{not:flag('poco_compartilhado')}}),
 option('encomenda','Aceitar a encomenda de um selo',120,'Seu selo funciona. Maíra paga dezoito moedas pelo serviço especializado.',[add('money',18),mark('selo_entregue')],{cost:{money:4,days:120},requires:all(fit,flag('poco_compartilhado'),{not:flag('selo_entregue')},{any:[stat('skill:oficio',40),stat('skill:arcanismo',40)]}),completionRequires:{person:'maira',alive:true,local:true},practice:{skill:'oficio',base:6}})
],all(at('oficina'),flag('poco_resolvido')),{participants:[{id:'maira',alive:true,local:true}]}));
decisions.push(action('passagem_raizes','A passagem indicada pelo espírito','Você reconhece a direção que a presença do poço mostrou.',[
 option('buscar','Procurar a passagem entre as raízes',45,'Entre raízes entrelaçadas, você encontra uma flor de vidro e a marca de um antigo caminho.',[item('flor_vidro',1),learn('caminho_antigo'),mark('passagem_visitada')],{requires:fit,completionRequires:at('bosque'),practice:{skill:'exploracao',base:7}})
],all(at('bosque'),{knows:{who:'player',fact:'passagem_raizes'}},{not:flag('passagem_visitada')}),{repeat:{max:1,cooldown:0}}));
export const catalog={schemaVersion:1,id:'ponteclara',version:1,clock:{unit:'minute',ticksPerDay:1440,pulseEvery:60,pulseChance:0.25},decisions,activities:[],consequences:[]};
