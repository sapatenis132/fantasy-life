# Fantasy Life — documento mestre de design

Versão jogável 0.6.0 · Direção revista em 26/11/2026. Nome de trabalho. Estado e decisões atuais prevalecem sobre GDDs históricos.

## Identidade e prioridades

RPG de fantasia medieval textual, com exploração, evolução do personagem, relações e liberdade de trajetória. O jogador acompanha as experiências de uma pessoa por situações e escolhas, decide quais objetivos perseguir e pode consultar suas lembranças no diário. Há espaço para aventura, magia, ofícios, vínculos e vida cotidiana, sem classe definitiva ou herói obrigatório.

**BitLife deixa de ser referência ativa de design.** Menções anteriores pertencem ao histórico do projeto. Course of Temptation passa a ser a referência estrutural principal para calendário, agendas, relações, necessidades, treino e deslocamento entre lugares, adaptados ao RPG de fantasia. Life in Adventure e 1 in 8 Billion podem continuar como referências secundárias de escolhas e diversidade de personagens.

1. **Liberdade e escolhas significativas.** Iniciativa, consequências e meios diferentes para perseguir objetivos. A simulação serve às escolhas.
2. **Variedade profunda.** Meta: mesmo após 50 horas, não sentir a mesma experiência. Variar conflitos, abordagens, relações, oportunidades e consequências; textos cosméticos e contagem de eventos não comprovam a meta.
3. **Interface simples no celular.** A história deve aparecer primeiro. Complexidade no motor, sistemas secundários sob demanda e nenhuma lista enorme de obrigações no primeiro instante.

Escolhas e liberdade > consequências/variedade > profundidade sistêmica > gerenciamento. Qualidade, criatividade e profundidade têm prioridade sobre volume ou velocidade.

## Fundação narrativa vigente — Terastera

O cenário passa a ter como base **Terastera**, o grande continente apresentado pelo autor, com regiões frias, desérticas e tropicais. Os cinco países-reinos fornecidos são Shasmoe, Lorick, InverséeMonte, Utopía de Ralph e RegalisFundios; outros podem ser desenvolvidos depois. Ler `mundo/TERASTERA.md` para os fatos estabelecidos, rumores e questões abertas, e `mundo/PREPARACAO_NARRATIVA.md` para a ordem do trabalho e possibilidades ainda não aprovadas.

**Prioridade atual: preparar a história e a região antes da próxima expansão mecânica.** A etapa 1.6 continua no planejamento, depois dessa preparação. O protótipo 0.6.0 permanece preservado. Ponteclara, o Moinho Afogado, seus parâmetros de calendário e as regras de personagem ainda precisam ser conciliados com Terastera; a localização da vila não está definida. Os reinos não estão implementados no jogo.

Fatos fornecidos pelo autor prevalecem sobre propostas do assistente. Rumores sobre demônios em RegalisFundios não confirmam sua presença. A versão lendária da Guerra dos 3 foi definida em 27/11/2026: Sol, Lua e Rei lutaram; a Tempestade venceu. A verdade histórica, as identidades e as causas dos demais mistérios permanecem abertas. Ler `mundo/LENDAS_E_MEMORIAS.md`. Documentar uma possibilidade não a torna cânone, nem autoriza expor informação secreta ao personagem.

## Direção atual: viver um RPG pelo diário

Criar um personagem → escolher um objetivo → explorar lugares e conhecer pessoas → agir com os recursos e capacidades disponíveis → lidar com resultados → acompanhar a evolução pelo diário. Ações, deslocamentos, descanso e treino movem um calendário. O tempo não passa durante leitura ou navegação.

Exploração, desafios, combate, aprendizado, equipamentos, magia e relações precisam alimentar uns aos outros. Rotina cria encontros, oportunidades e decisões de preparo; necessidades influenciam a forma de se aventurar e devem ter soluções acessíveis. Evitar que comer, dormir e treinar se tornem a atividade dominante por repetição. O diário registra a experiência do personagem.

Nascimento, infância, envelhecimento até a morte e sucessão deixam de ser requisitos centrais ou etapas obrigatórias de desenvolvimento. Idade, origem e família continuam disponíveis como contexto e possíveis relações quando enriquecerem o RPG. O início adulto atual é uma base válida para desenvolver a experiência principal.

Course of Temptation orienta as mecânicas de relações, agendas, calendário, necessidades, treino e navegação por lugares. Nenhum cenário ou conteúdo adulto dessa referência faz parte do projeto. Habilidades, traços, talentos, povos e dons singulares devem produzir soluções e trajetórias de fantasia, não apenas números.

Aleatoriedade é parte do gameplay: encontrar circunstâncias inesperadas, lidar com informação incompleta e avaliar risco. Preparo, capacidade, relações e decisões mudam as alternativas e seus resultados. Não sortear novamente ao abrir menus; não usar surpresa como desculpa para ignorar intenção ou consequências.

## Regras de escolhas, pessoas e continuidade

Situações modulares ligadas ao estado persistente. Separar fatos, propostas e iniciativas. Cada opção precisa de intenção compreensível, condições, custos e resultados plausíveis. Consequências podem mudar acesso, recursos, conhecimento, relações, saúde e oportunidades posteriores. Recusar, investigar, negociar, guardar para depois e não interferir devem existir quando fizerem sentido. Fracasso pode custar algo e ensinar ou mudar a situação; não precisa ser uma tela vazia nem uma recompensa garantida.

NPCs têm identidades estáveis, conhecimento individual e relações direcionais. Não sabem automaticamente o que o jogador fez. Uma pessoa que foi embora não pode concluir uma conversa como se ainda estivesse presente. Não automatizar amizade, romance, crimes ou compromissos importantes. O mundo deve progredir também sem o protagonista, com profundidade proporcional à relevância.

## Interface e tempo vigentes

- **Cena central e painel do personagem.** Lugar, pessoas, ações e saídas ficam na área de jogo. Hora, condições e atalhos ficam na lateral em telas largas e em um painel recolhível no celular.
- Criar nome e origem primeiro; personalização adicional recolhida.
- Iniciativas locais e saídas aparecem junto da descrição. Pessoas presentes abrem a interação correspondente. Opções bloqueadas ficam em “Outras possibilidades”, com requisitos explicados.
- No celular, quatro medidores compactos de necessidades permanecem no cabeçalho durante a gameplay. Tocar neles abre os cuidados do lugar, com condições e custo antes de agir. A faixa acompanha a rolagem e não ocupa a área da narrativa.
- O painel reúne barras compactas de necessidades; Ficha/Habilidades/Mochila, Pessoas, Mapa, Agenda, Diário e Arquivos abrem janelas próprias. O painel recolhido preserva a leitura no celular.
- A sala mostra a situação atual; o resultado do último comando ocupa uma passagem breve. O diário reúne lembranças em janela separada e nunca substitui automaticamente a descrição do lugar.
- O mapa mostra lugares conectados e duração do caminho antes de viajar. Uma decisão interrompe o trecho e preserva sua duração restante.
- Retomar ou abandonar exige iniciativa. Nunca simular offline por padrão ou escolher pelo jogador.
- O kernel suporta perfis temporais. O legado permanece em dias; Ponteclara opera em minutos. O botão anual e as rotinas passivas antigas não definem a direção atual.
- Rotinas repetidas e períodos longos precisarão de automação opcional e resumos. Não expandir o jogo como uma lista infinita de tarefas de manutenção.

## Estado implementado — 0.6.0

A arquitetura 1.3 foi preservada e estendida. A fatia 1.4 entrega criação de jovem adulto, identidade reutilizável, oito lugares em Ponteclara, calendário, três moradores com agendas, necessidades com recuperação, relações direcionais e amizade, cinco habilidades com técnicas aos 60 pontos, três traços, talentos por habilidade, três povos, dois dons despertos e um potencial latente que pode despertar.

Treino, trabalho e projetos ocupam tempo dedicado. Uma aula marcada tem horário e janela de chegada. Oportunidades são selecionadas em marcos fixos com contexto e intervalo; o resultado oculto do reagente é persistido. Exemplos conectados incluem livro, poço, passagem, lanterna, coleta noturna, descoberta compartilhada, encomenda especializada e devolução ou venda de um pacote encontrado. Resolver problemas com outro conhecimento ou dom muda o que o personagem aprende e faz depois.

O jogo está em [sapatenis132.github.io/fantasy-life](https://sapatenis132.github.io/fantasy-life/), no repositório separado [sapatenis132/fantasy-life](https://github.com/sapatenis132/fantasy-life). `docs/index.html` é o build autocontido atual. A versão 0.4.1 permanece em `/legado/`. A chave de save do laboratório 0.4.1 é separada; a transferência desse legado é explícita e recusa compromissos ainda ativos. A base original não foi alterada.

A etapa 1.5 amplia a região para doze lugares com a expedição opcional **O Moinho Afogado**. Três interesses podem ser acompanhados no diário sem contrato obrigatório. Origem fornece equipamentos iniciais diferentes; provisões e curativos tornam o preparo útil. A margem muda conforme a cheia; dois contatos possíveis são fixados pela seed e conservam identidade, agenda e memória individual. Um único contato está ativo por personagem.

O guardião aceita soluções por galeria, ferramentas/ofício, conhecimento mágico/dom, técnica de esgrima e confronto. Existe uma rota sem ouro e sem luta para todas as origens. A decisão na câmara tem quatro desfechos exclusivos: manter a roda e o vínculo, libertar a presença, extrair o núcleo ou preparar um novo pacto. Mudam trabalho, caminho curto, cuidados na margem, artefato utilizável e reação após relato. Maíra não sabe sua escolha até ouvi-la; o livreiro só conhece o núcleo quando o compra. Não há transmissão geral de rumores nesta versão.

Catálogo 2 com migração de 0.5 validada pelo catálogo anterior congelado. Preserva tempo, RNG, bens, compromissos, projetos, escolhas e trabalhos em andamento. Backup automático anterior à gravação, arquivo 0.5.2 independente em `/legado-0-5/`, legado 0.4.1 mantido em `/legado/`. A chave principal continua `fantasy-life-vida-1.4`; o backup usa o sufixo `-antes-0.6`.

Verificação: **194 casos do conjunto atual** (71 de arquitetura, 43 de vida, 28 de HUD, 41 do capítulo e 11 da interface nova), outros 71 da fundação 0.5.2 e 14 históricos. As regressões das duas versões têm casos equivalentes; não somar como funcionalidades distintas. Inclui 100 expedições e comparação de 200 confrontos, quatro trajetórias jogadas sem inserção de recursos e inspeção de três viewports CSS. Não comprovam diversão, equilíbrio ou 50 horas. Evidências em `etapa_1_5/evidencias/`; HUD anterior preservada em `etapa_1_4/docs/REVISAO_HUD_0_5_2.md`.

## Limites e próximos blocos

A primeira aventura conecta a vila aos arredores; o volume de conteúdo continua pequeno. Combate completo, equipamentos aprofundados, magia variada, explorações extensas, facções e mundo amplo ainda precisam ser desenvolvidos. NPCs têm uma base de agenda e vínculo; objetivos, personalidade reativa e desenvolvimento autônomo ainda precisam de profundidade. Economia, curva de aprendizado e raridade de dons são provisórias. Contexto familiar e origens variadas podem ser ampliados conforme a utilidade para o RPG; nascimento e simulação geracional ficam como possibilidades sem prioridade definida.

A direção permanece: ampliar combinações e consequências antes de despejar centenas de eventos. Trabalho imediato: **fundação narrativa de Terastera e revisão da região inicial**. Depois, retomar a **1.6 — aprofundar a primeira região e o risco**, com combate de decisões táticas, equipamento, magia e consequências tardias. O roadmap deve aprofundar o que o personagem pode viver e fazer. Veja `PLANO_DE_CONTINUIDADE.md` e `etapa_1_5/docs/DESIGN_E_IMPLEMENTACAO.md`.
