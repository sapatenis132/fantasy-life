# Design e implementação — Moinho Afogado

## Ciclo jogável

Escolher um interesse → preparar-se ou partir → descobrir caminhos e informações → resolver o acesso → decidir o destino da roda → retornar, compartilhar ou guardar a descoberta → aproveitar consequências. Nenhum interesse cria contrato obrigatório. Trocar o marcador no diário não consome tempo, RNG nem recursos. O jogador pode explorar sem marcador, ou ignorar a expedição.

Um lugar concentra três interesses compatíveis entre si. O objetivo escolhido orienta a atenção, sem bloquear os outros. A bifurcação importante está em como chegar, passar pelo guardião e lidar com a presença. Não há uma escolha obrigatória de herói ou profissão.

## Preparação e capacidades

| Recurso/capacidade | Efeito na expedição |
|---|---|
| Corda | Fica na travessia ou é consumida no reparo do atalho; empréstimo tem devolução alternativa |
| Kit + Ofício 25 + junta conhecida | Despressuriza o guardião intacto |
| Exploração 25 ou Observador | Lê a rota alta em menos tempo e encontra pista sobre outro pacto |
| Exploração sem habilidade especial | Investir mais tempo encontra a galeria, sem custo em moedas |
| Arcanismo 30 ou Eco + livro estudado | Sinaliza manutenção ao guardião |
| Esgrima 60 | Usa a Guarda firme para desativá-lo sem ferimentos |
| Lâmina e Esgrima 25 | Melhoram a chance no confronto; cheia aumenta o risco |
| Ofício 35 / Alquimia 35 / Arcanismo 30, pista e fonte | Permitem o pacto voluntário, consumindo um recurso mágico |
| Provisão / curativo | Recuperam necessidades/saúde fora da vila, com item e tempo reais |
| Conselho de Breno / confiança no contato | Abrem uma forma de conseguir corda sem comprá-la |

A origem fornece kit, provisões/ervas ou corda/provisão em personagens novos. Saves anteriores não recebem recursos retroativos. Todas as origens, mesmo sem dom, dinheiro, itens ou traço especial, podem seguir o mirante com calma e contornar o guardião. A recuperação por esforço na taverna e descanso continua disponível.

O novo pacto tem preparo real acessível pelo poço → passagem das raízes → flor de vidro, ou pelas outras fontes existentes. Não é opção secreta sorteada no último momento. Sua vantagem tem custo em tempo, conhecimento e recurso; ainda precisa de avaliação humana de equilíbrio. Guardar ou vender o núcleo também é uma trajetória legítima, sem punição social onisciente.

## Consequências distintas

| Decisão | Estado e oportunidade posterior | Reação de Maíra ao ouvir |
|---|---|---|
| Reparar e manter vínculo | Moinho funciona; manutenção de 2h rende 9 moedas; presença continua vinculada | Valoriza o retorno e questiona a obrigação: +4 confiança |
| Libertar | Roda para; atalho e emplastro na margem | Entende, precisa adaptar trabalho: +1 |
| Extrair | Roda para; núcleo dá energia com custo de saúde ou vale 30 moedas | Discorda do custo para a oficina: −3 |
| Renovar | Moinho funciona, atalho e descanso junto da presença; consome uma fonte | Considera outra forma de trabalhar: +6 |

Recuperar/devolver ferramentas e compartilhar notas são ações independentes da decisão. Pagamentos e relatos são únicos. As habilidades evoluem pelo que foi praticado, mesmo quando a abordagem não envolveu combate. Um fracasso no confronto fere e preserva o guardião; o jogador decide insistir, preparar-se, buscar outra passagem ou recuar. Com pouca saúde pode morrer: o risco está escrito antes de agir.

## Aleatoriedade e pessoas

A seed fixa cheia/névoa/calmaria e Iria/Nilo sem consumir o PRNG de eventos. A cheia altera a travessia e o risco; névoa e calmaria diferem só na ambientação neste recorte. Eventos cotidianos continuam usando o PRNG persistido. Abrir mapa, consultar alternativas e recarregar não sorteiam de novo o contexto.

Iria quer impedir perdas nas galerias; Nilo se preocupa com a antiga equipe e a rota. Só um contato está ativo, com ID estável e presença na margem das 08 às 19h. Não substituir um participante morto. Conselho, corda e retorno exigem a pessoa presente, inclusive na conclusão. Conhecer seu horário não permite conversar fora dele.

Conselho só ensina uma vez; empréstimo e devolução têm marcas persistentes. Maíra aprende sobre ferramentas/decisão quando o jogador entrega/relata. O livreiro conhece notas quando as recebe e núcleo quando o compra. Não há sistema de boatos nem detecção de mentira nesta versão. Os contatos têm pautas e memórias, mas ainda não personalidades autônomas completas; parte da estrutura de diálogo é compartilhada.

## Interface e arquitetura

Manter cena e passagem atual no centro, diário separado, necessidades compactas sempre presentes na gameplay móvel. Objetivos aparecem em aba do diário e no painel recolhível/lateral, sem nova lista sobre a narrativa. Mapa usa Vila/Arredores para manter os alvos legíveis. Consulta explica rotas bloqueadas e não permite teleporte. Custos, requisitos e detalhes dos riscos aparecem antes de agir.

Treinos de duas horas equivalem a duas sessões em ganho, esforço e bônus de talento. Decisões importantes podem interromper o bloco, com restante persistido. Não há rotina automática ou calendário programável ainda.

O catálogo anterior é clonado e ampliado; opções/IDs publicados da 0.5 permanecem intactos. O build inclui o validador antigo para migrar com segurança, sem afrouxar o fingerprint. Regras adicionais ficam nos ganchos do motor existente: cenário fixo, gasto de uma fonte alternativa, memória do relato e acompanhamento de objetivo. Estado inválido não substitui o arquivo atual.

## Validação e limites

194 casos atuais: 71 arquitetura + 43 vida + 28 HUD + 41 capítulo + 11 interface nova. Outros 71 casos verificam a 0.5 congelada; 14 executam a base original. Existem casos equivalentes, reexecutados para detectar diferenças entre versões. A bateria atual inclui 100 percursos cotidianos, 100 expedições com save/load e comparação de 200 confrontos preparados/despreparados. A comparação de quatro trajetórias usa mesma seed/identidade, sem injetar recursos; o pacto exige preparo jogado.

O resultado é uma primeira expedição curta, com consequências conectadas. Não comprova 50h, curva de progressão, ausência de estratégia dominante ou diversão. Combate com várias decisões, slots de equipamento, armadura, magia variada, economia regional e consequências sociais tardias continuam na 1.6 e etapas seguintes. Android físico, leitor de tela e testes humanos prolongados pendentes.
