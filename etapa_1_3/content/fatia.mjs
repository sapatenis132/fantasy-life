// Autoria em dados. Estes atalhos só constroem JSON; o motor não executa scripts de conteúdo.
const all=(...x)=>({all:x}), not=x=>({not:x});
const flag=(key,value=true)=>({flag:key,is:value});
const knows=fact=>({knows:{who:'player',fact}});
const stat=(key,value)=>({stat:key,op:'gte',value});
const item=id=>({item:id,min:1});
const local=id=>({id,alive:true,local:true});
const set=(id,value=true)=>({op:'flag',id,value});
const add=(stat,amount)=>({op:'add',stat,amount});
const learn=(who,fact)=>({op:'learn',who,fact});
const later=(consequence,after)=>({op:'schedule',consequence,after});
const result=(id,text,effects=[],weight=1,when)=>({id,text,effects,weight,...(when?{when}:{})});
const option=(id,label,intent,hint,{days=0,money=0,requires,visibleWhen,effects=[],outcomes,blockedReason='As condições para esta abordagem ainda não foram atendidas.'}={})=>({
  id,label,intent,hint,cost:{days,money},effects,outcomes:outcomes||[result('feito',intent)],blockedReason,...(requires?{requires}:{}),...(visibleWhen?{visibleWhen}:{})});
const decision=(id,kind,family,domain,title,text,options,extra={})=>({id,version:1,kind,family,domain,title,text,repeat:{max:1,cooldown:0},options,...extra});
const consequence=(id,text,effects,extra={})=>({id,version:1,visibility:'observed',text,effects,...extra});
const activity=(id,label,slot,duration,skill,rate,pay,costPerDay,onComplete,completionText,extra={})=>({id,version:1,label,slot,duration,skill,rate,pay,costPerDay,onComplete,completionText,...extra});
const sellEffects=[{op:'item',id:'grimorio',amount:-1},add('money',8),set('livro_vendido'),learn('mercador','comprou_livro'),later('comercio.retorno',10)];
const repairHome=[set('casa_reparada'),{op:'world',id:'quarto_interditado',value:false}];

export const catalog={schemaVersion:1,id:'fantasy_life.agencia',version:1,
  activities:[
    activity('oficina','Trabalho na oficina','occupation',60,'oficio',1,1,0,[add('trust:maira:player',1)],'Você encerrou a temporada na oficina com prática e algum dinheiro.',{participants:[local('maira')]}),
    activity('estudo','Estudo com materiais emprestados','project',28,'arcanismo',1,0,1,[learn('player','conducao_segura')],'Você aprendeu a conduzir luz sem aquecer o suporte.'),
    activity('bolsa','Aprendizagem com Maíra','occupation',90,'oficio',2,0,0,[learn('player','conducao_segura'),add('skill:arcanismo',12)],'A aprendizagem terminou. Você domina uma técnica de selos e conserva seu ofício.',{participants:[local('maira')]}),
    activity('telhado','Conserto do telhado','project',7,'oficio',1,0,0,repairHome,'O telhado está vedado. Sua família pode voltar a usar o quarto.'),
    activity('lanterna','Construção de uma lanterna rúnica','project',14,'oficio',1,0,0,[{op:'item',id:'lanterna',amount:1},set('lanterna_feita')],'A lanterna acende sem óleo. Você pode usá-la no conserto ou vender seu trabalho.'),
    activity('encomenda','Selos para iluminar a oficina','project',14,'oficio',1,0,0,[add('money',18)],'A oficina aceita seus selos e paga 18 moedas.',{participants:[local('maira')]})
  ],
  consequences:[
    consequence('mentor.convite','Maíra pede que você volte à oficina; ela tem uma proposta de aprendizagem.',[{op:'offer',decision:'mentor.proposta'}],{
      participants:[local('maira')],requires:{knows:{who:'maira',fact:'viu_grimorio'}}}),
    consequence('comercio.retorno','O comprador do livro oferece apresentar você a uma banca de artefatos.',[set('contato_comercial')],{
      participants:[local('mercador')],requires:all(flag('livro_vendido'),{knows:{who:'mercador',fact:'comprou_livro'}})}),
    consequence('familia.retorno','Sua irmã volta a perguntar sobre o conserto.',[{op:'offer',decision:'familia.retorno'}],{participants:[local('irma')],requires:not(flag('casa_reparada'))}),
    consequence('familia.chuva','A chuva encontrou as goteiras. Um quarto ficará inutilizável até alguém fazer o conserto.',[{op:'world',id:'quarto_interditado',value:true}],{
      requires:not(flag('casa_reparada'))}),
    consequence('magia.eco','', [{op:'world',id:'eco_no_poco',value:true}],{visibility:'private'}),
    consequence('magia.oficina','Com a luz do poço estabilizada, a oficina recebeu uma encomenda de selos. Maíra lembra do seu trabalho.',[set('encomenda_aberta')],{participants:[local('maira')],requires:flag('poco_estavel')})
  ],
  decisions:[
    decision('livro.destino','action','objeto_ambiguo','conhecimento','O livro sem título',
      'Você encontrou um livro de diagramas entre materiais descartados. Pode investigar, consultar alguém ou escolher outro destino para o volume.',[
      option('examinar','Examinar e copiar os diagramas','Estudar o livro antes de decidir seu destino.','2 dias. Você conserva o livro e suas anotações.',{
        days:2,requires:not(knows('diagramas')),blockedReason:'Você já copiou os diagramas que consegue entender.',
        effects:[learn('player','diagramas'),{op:'item',id:'notas',amount:1},later('magia.eco',5)],
        outcomes:[result('anotacoes','Você copia um circuito de luz. O selo da capa continua sem tradução.')]}),
      option('consultar','Mostrar o livro a Maíra','Pedir a opinião de uma gravadora de selos.','2 dias e 3 moedas. Maíra saberá que você possui o livro.',{
        days:2,money:3,requires:all({person:'maira',alive:true,local:true},not(knows('selo_proibido'))),blockedReason:'Maíra precisa estar disponível na vila; uma consulta já concluída não precisa ser repetida.',
        effects:[learn('player','selo_proibido'),learn('maira','viu_grimorio'),add('trust:maira:player',2),later('mentor.convite',7)],
        outcomes:[result('identificado','Maíra reconhece um selo de uma escola banida. Ela conhece os diagramas de luz, mas aconselha cuidado com as outras páginas.')]}),
      option('vender','Vender como livro antigo','Transformar o achado em dinheiro imediato.','1 dia. Receba 8 moedas e entregue o livro. Suas anotações ficam com você.',{
        days:1,effects:sellEffects,outcomes:[result('venda','O livreiro compra o volume. Ele sabe da venda; ninguém mais é informado por ela.')]}),
      option('revelar','Negociar explicando o selo','Vender o livro revelando o que aprendeu sobre sua origem.','3 dias. Receba 12 moedas; o comprador conhecerá o selo.',{
        days:3,visibleWhen:knows('selo_proibido'),requires:stat('trust:mercador:player',2),blockedReason:'O comprador só aceita a negociação longa de alguém em quem confia.',
        effects:[...sellEffects,add('money',4),learn('mercador','selo_proibido')],outcomes:[result('venda_informada','O comprador paga pela procedência e pelo risco que aceitou assumir.')]}),
      option('entregar','Confiar o livro a Maíra','Entregar o livro para conservação na oficina.','Você perde o livro e ganha a confiança de Maíra.',{
        requires:{person:'maira',alive:true,local:true},blockedReason:'Maíra precisa estar viva e na vila.',
        effects:[{op:'item',id:'grimorio',amount:-1},learn('maira','viu_grimorio'),add('trust:maira:player',3),set('livro_entregue'),later('mentor.convite',3)],
        outcomes:[result('arquivo','Maíra guarda o livro no armário seco da oficina. Ela não exige que você siga uma carreira mágica.')]}),
      option('experimentar','Testar um circuito nas anotações','Tentar produzir uma luz antes de dominar a técnica.','3 dias e 1 moeda. Pode funcionar ou causar uma queimadura.',{
        days:3,money:1,visibleWhen:knows('diagramas'),requires:not(flag('circuito_testado')),blockedReason:'Você já tentou este circuito; outro teste igual não trará aprendizado novo.',
        effects:[set('circuito_testado')],outcomes:[
          result('luz','Uma luz fraca se mantém. Você registra o que conseguiu reproduzir.',[add('skill:arcanismo',4)],3),
          result('queimadura','O suporte esquenta e queima seus dedos. As notas sobrevivem; você ainda pode procurar ensino.',[add('health',-8)],2)]})
    ],{repeat:{max:8,cooldown:0},requires:item('grimorio')}),
    decision('oficina.iniciativa','action','trabalho_aprendizado','ocupacao','Procurar a oficina',
      'Maíra grava placas e pequenos selos. Você pode pedir trabalho sem esperar por um convite.',[
      option('trabalhar','Pedir uma temporada de trabalho','Trabalhar por pagamento e aprender o ofício na prática.','60 dias de rotina automática: 1 moeda e prática por dia.',{
        requires:{freeSlot:'occupation'},blockedReason:'Encerre sua ocupação atual para assumir outra.',effects:[{op:'startActivity',activity:'oficina'}],
        outcomes:[result('contratado','Maíra precisa de ajuda com placas. Vocês combinam uma temporada paga, sem compromisso permanente.')]}),
      option('estudar','Pedir materiais de estudo','Aprender arcanismo por um projeto de estudo.','28 dias de rotina. Custa 1 moeda por dia; pode ser combinado com trabalho.',{
        requires:all({freeSlot:'project'},stat('money',1)),blockedReason:'Você precisa de um projeto livre e ao menos 1 moeda para os materiais.',effects:[{op:'startActivity',activity:'estudo'}],
        outcomes:[result('material','Maíra empresta exercícios simples. A compra de papel será descontada enquanto você estudar.')]})
    ],{repeat:{max:10,cooldown:0},participants:[local('maira')]}),
    decision('mentor.proposta','opportunity','trabalho_aprendizado','relacoes','Uma vaga, sem salário',
      'Maíra oferece três meses de aprendizagem. A oficina fornece materiais, mas a vaga não paga salário.',[
      option('aceitar','Aceitar a aprendizagem','Trocar renda imediata por ensino acompanhado.','90 dias de ocupação. Materiais incluídos.',{
        requires:{freeSlot:'occupation'},blockedReason:'Sua ocupação atual precisa terminar antes de aceitar.',effects:[{op:'startActivity',activity:'bolsa'}],
        outcomes:[result('aprendiz','Você aceita a vaga. O livro abriu uma relação; a decisão de seguir o ofício foi sua.')]}),
      option('negociar','Propor um estudo independente','Usar a experiência de oficina para estudar mantendo o trabalho.','Requer prática de ofício. Projeto de 28 dias, 1 moeda por dia.',{
        requires:all(stat('skill:oficio',7),{freeSlot:'project'},stat('money',1)),blockedReason:'Você precisa de sete dias de prática, um projeto livre e dinheiro para materiais.',effects:[{op:'startActivity',activity:'estudo'}],
        outcomes:[result('acordo','Maíra aceita emprestar os exercícios. Você mantém liberdade para continuar trabalhando.')]}),
      option('recusar','Recusar por enquanto','Manter seus compromissos e procurar outra formação quando quiser.','A recusa encerra esta oferta, preservando o contato.',{
        effects:[set('bolsa_recusada')],outcomes:[result('recusa','Maíra chama outro aprendiz. Você ainda pode procurar trabalho e materiais na oficina.')]})
    ],{participants:[local('maira')]}),
    ...['familia.telhado','familia.retorno'].map((key,index)=>decision(key,'opportunity','cuidado_compromisso','familia',
      index?'O conserto ficou para depois':'A chuva está chegando',
      'Sua irmã mostra as goteiras do quarto. O carpinteiro cobra 9 moedas; você também pode fazer o serviço.',[
      option('pagar','Pagar o carpinteiro','Usar suas economias para resolver o conserto.','9 moedas. Você conserva seu tempo de projeto.',{
        money:9,effects:repairHome,outcomes:[result('contratado','O carpinteiro troca as peças soltas. Você conservou seus outros compromissos.')]}),
      option('reparar','Fazer o conserto','Assumir o trabalho para poupar dinheiro.','Projeto automático de 7 dias. Usa o espaço de seu outro projeto.',{
        requires:{freeSlot:'project'},blockedReason:'Encerre seu outro projeto se quiser assumir este trabalho.',effects:[{op:'startActivity',activity:'telhado'}],outcomes:[result('assumido','Você separa ferramentas. O conserto tomará parte dos próximos dias.')]}),
      option('lanterna','Trocar a lanterna pelo serviço','Oferecer seu trabalho mágico ao carpinteiro.','Entrega uma lanterna rúnica e conserva seu dinheiro e projeto.',{
        visibleWhen:flag('lanterna_feita'),requires:item('lanterna'),blockedReason:'Você já não possui a lanterna.',effects:[{op:'item',id:'lanterna',amount:-1},...repairHome],
        outcomes:[result('troca','O carpinteiro aceita a lanterna para trabalhar à noite e assume o conserto.')]}),
      ...(index?[]:[option('adiar','Combinar uma resposta mais tarde','Pedir dez dias para organizar seus planos.','A conversa voltará em 10 dias. A chuva não vai esperar indefinidamente.',{
        effects:[later('familia.retorno',10)],outcomes:[result('prazo','Sua irmã concorda em esperar dez dias por sua resposta.')]})]),
      option('recusar','Não assumir o conserto','Deixar sua família buscar outra solução.','Você conserva os recursos; as goteiras continuam se ninguém agir.',{
        effects:[set('conserto_recusado')],outcomes:[result('recusa','Sua irmã diz que tentará encontrar ajuda. Você não assumiu o compromisso.')]})
    ],{participants:[local('irma')],requires:not(flag('casa_reparada'))})),
    decision('projeto.lanterna','action','criacao_utilidade','projeto','Criar uma lanterna rúnica',
      'Você pode reunir seus diagramas, prática manual e condução segura em um objeto útil.',[
      option('construir','Começar a construção','Transformar conhecimentos combinados em um projeto próprio.','4 moedas em materiais e 14 dias de projeto automático.',{
        money:4,requires:{freeSlot:'project'},blockedReason:'Encerre seu projeto atual para iniciar este.',effects:[{op:'startActivity',activity:'lanterna'}],
        outcomes:[result('iniciado','Você compra cobre e vidro e prepara sua bancada. A lanterna ficará pronta enquanto o tempo avança.')]})
    ],{requires:all(knows('diagramas'),knows('conducao_segura'),stat('skill:oficio',7),not(flag('lanterna_feita')))}),
    decision('lanterna.destino','action','troca_uso','posses','O destino da lanterna',
      'A luz está pronta. Uma ferramenta pode ser uma fonte de renda ou uma moeda de troca.',[
      option('vender','Vender sua criação','Receber dinheiro pelo projeto concluído.','1 dia. Receba 12 moedas e entregue a lanterna.',{
        days:1,effects:[{op:'item',id:'lanterna',amount:-1},add('money',12)],outcomes:[result('vendida','Uma costureira compra a lanterna para trabalhar depois do pôr do sol.')]})
    ],{requires:item('lanterna')}),
    decision('magia.poco','opportunity','risco_conhecimento','magia','Luz sob a água',
      'Um circuito de luz aparece nas pedras do poço. Você reconhece o desenho de suas anotações; não sabe quem o gravou.',[
      option('estabilizar','Aplicar a condução segura','Estabilizar o circuito com o que aprendeu.','Exige condução segura. A oficina pode encontrar utilidade no seu trabalho.',{
        requires:knows('conducao_segura'),blockedReason:'Você ainda não domina a condução segura.',effects:[set('poco_estavel'),set('poco_resolvido'),learn('maira','viu_reparo_poco'),later('magia.oficina',14)],
        outcomes:[result('estavel','Você ajusta o circuito diante de Maíra. O poço fica iluminado sem aquecer a água.')]}),
      option('conter','Conter com o suporte de cobre','Tentar apagar o circuito com uma ferramenta improvisada.','2 moedas. Risco de queimadura; a tentativa pode conter a luz.',{
        money:2,effects:[set('poco_resolvido')],outcomes:[
          result('contido','A luz se apaga. Sua ferramenta fica inutilizada.',[],2),
          result('ferido','A descarga queima sua mão antes de apagar. Você precisará se recuperar.',[add('health',-12)],1)]}),
      option('deixar','Continuar sua vida','Deixar o estudo do poço para outras pessoas.','Nenhum compromisso novo.',{
        effects:[set('poco_resolvido')],outcomes:[result('ignorado','Você segue seu caminho. A luz não obriga você a se tornar aventureiro.')]})
    ],{requires:all({world:'eco_no_poco',is:true},knows('diagramas'),not(flag('poco_resolvido'))),participants:[local('maira')],selection:{weight:1}}),
    decision('comercio.iniciativa','action','contato_oportunidade','comercio','Conhecer a banca de artefatos',
      'O livreiro pode apresentar você a compradores de pequenos objetos mágicos.',[
      option('visitar','Pedir a apresentação','Usar o contato criado pela venda do livro.','2 dias. Abre um contato comercial, sem obrigar você a mudar de profissão.',{
        days:2,effects:[set('banca_conhecida'),add('trust:mercador:player',2)],outcomes:[result('apresentado','Você conhece a banca e seus compradores. Eles passam a aceitar conversar sobre a procedência dos objetos.')]})
    ],{requires:all(flag('contato_comercial'),not(flag('banca_conhecida'))),participants:[local('mercador')]})
  ]
};

// Retomar situações por iniciativa própria evita que o sorteio seja o único portão.
const well=catalog.decisions.find(d=>d.id==='magia.poco');
catalog.decisions.push(decision('magia.investigar','action','risco_conhecimento','magia','Voltar ao poço',
  'Você deixou o circuito para depois. Agora pode voltar com outra preparação.',JSON.parse(JSON.stringify(well.options)),
  {participants:[local('maira')],requires:all(flag('poco_adiado'),not(flag('poco_resolvido')))}));
well.options.splice(2,0,option('adiar','Voltar quando estiver preparado','Reservar a investigação para outra ocasião.',
  'A investigação fica disponível nas suas iniciativas. Não é preciso esperar outro sorteio.',{
    effects:[set('poco_adiado')],outcomes:[result('reservado','Você anota o local do circuito e decide voltar quando tiver meios melhores.')]}));
catalog.decisions.push(decision('oficina.encomenda','action','criacao_utilidade','ocupacao','Assumir a encomenda de selos',
  'Depois do conserto no poço, Maíra quer iluminar a oficina com a mesma técnica.',[
    option('assumir','Preparar os selos','Usar o conhecimento demonstrado no poço para obter trabalho especializado.',
      '6 moedas de materiais. Projeto de 14 dias; pagamento de 18 moedas na entrega.',{
        money:6,requires:{freeSlot:'project'},blockedReason:'Seu projeto atual precisa terminar primeiro.',
        effects:[set('encomenda_assumida'),{op:'startActivity',activity:'encomenda'}],outcomes:[result('contrato','Vocês combinam o preço e o prazo. Agora o trabalho ocupa seu espaço de projeto.')]
      })
  ],{participants:[local('maira')],requires:all(flag('encomenda_aberta'),not(flag('encomenda_assumida')))}));
const home=catalog.decisions.find(d=>d.id==='familia.retorno');
catalog.decisions.push(decision('familia.iniciativa','action','cuidado_compromisso','familia','Retomar o conserto de casa',
  'O conserto continua necessário. Você pode propor outra solução mesmo depois de ter recusado.',
  JSON.parse(JSON.stringify(home.options.filter(o=>o.id!=='recusar'))),
  {participants:[local('irma')],requires:all(not(flag('casa_reparada')),{any:[flag('conserto_recusado'),{world:'quarto_interditado',is:true}]})}));

export function newLife(engine,seed=2026) {
  const s=engine.create(seed,{
    birthDay:-16*365,money:12,location:'vila',items:{grimorio:1},attributes:{intelecto:2},
    npcs:{maira:{alive:true,name:'Maíra',location:'vila'},mercador:{alive:true,name:'Livreiro',location:'vila'},irma:{alive:true,name:'Lia, sua irmã',location:'vila'}},
    relations:{'maira:player':0,'mercador:player':0},
    world:{origem_livro:'escola_banida'},knowledge:{player:{},maira:{selo_proibido:true},mercador:{},irma:{}}
  });
  engine.schedule(s,{type:'decision',decision:'familia.telhado',day:14});
  engine.schedule(s,{type:'consequence',consequence:'familia.chuva',day:30});
  return s;
}
