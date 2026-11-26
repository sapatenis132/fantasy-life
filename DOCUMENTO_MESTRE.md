# Fantasy Life — documento mestre de design
Versão de consolidação 0.4.1 | 26/11/2026 | Nome de trabalho, não título comercial definitivo.

## 1. Identidade
Simulador de vida textual em um mundo medieval fantástico, inspirado na acessibilidade de BitLife, nas escolhas e RPG de Life in Adventure e na diversidade inicial de 1 in 8 Billion. O jogador vive como um indivíduo, do nascimento à morte, não como herói predestinado. Vida comum e vida extraordinária são igualmente legítimas. Sem história principal, classe permanente ou objetivo universal obrigatório. Sucessão e dinastias são propostas futuras, não implementação existente.

## 2. Prioridades confirmadas pelo usuário
1. **O jogo é sobre as escolhas do jogador.** Agência, iniciativa, consequências e caminhos diferentes são prioritários. A simulação serve às escolhas, não o contrário.
2. **Liberdade e variedade muito altas.** Meta de experiência: mesmo depois de 50 horas, não sentir que se fez a mesma coisa repetidamente. Não confundir a meta com garantia literal de que nenhuma rotina se repete. Variar conflitos, estratégias, oportunidades, relações e trajetórias, não apenas texto e nomes.
3. **HUD simples.** O usuário considerou excessiva a proposta de seis opções temporais e agenda detalhada. O design revisado adota um botão principal de envelhecer, rotinas automáticas e detalhes em menus quando relevantes. A complexidade é interna.

Hierarquia: escolhas e liberdade > consequências e variedade > narrativa e profundidade sistêmica > gerenciamento. Não sacrificar as primeiras para adicionar estatísticas ou sistemas.

## 3. Experiência do jogador
Nascer em contexto coerente → conhecer situação → escolher ações e atividades ou envelhecer → resolver decisões emergentes → observar consequências → repetir. O tempo avança por ações e envelhecimento; acontecimentos importantes podem interrompê-lo. Permitir iniciativa sem esperar eventos aleatórios: visitar pessoas, mudar de profissão, buscar mentor, viajar, investigar, criar projetos, assumir ou recusar compromissos. Não automatizar casamento, crimes, ingresso em facções, juramentos ou outras decisões importantes do jogador sem autorização. Resultados podem ser incertos, mas a intenção deve ser clara.

## 4. Arquitetura de escolhas (etapa 1.3 implementada em laboratório)
Um evento não deve ser uma lista rígida de finais. Construir unidades narrativas modulares ligadas ao estado persistente. Diferenciar fatos que já aconteceram, propostas que requerem decisão e ações iniciadas pelo jogador. Cada escolha deve ter uma intenção, condições plausíveis, custos, possíveis resultados e efeitos sobre o estado. Identificadores estáveis para pessoas, locais, objetos, eventos e decisões. Opções genéricas podem conviver com opções específicas desbloqueadas por conhecimento, recursos, reputação, vínculos, idade, origem e experiências passadas. Restrições explicadas quando conhecidas pelo personagem. Não revelar consequências secretas nem dar conhecimento onisciente a NPCs.

Consequências podem alterar relações, recursos, reputação, saúde, habilidades, acesso, compromissos, localização e estado do mundo; criar oportunidades ou encerrar caminhos; ser imediatas ou tardias. Não exigir que cada escolha produza uma história inteiramente separada, mas evitar convergência que apague efeitos significativos. Fracassos podem ter efeitos variados e abrir caminhos, sem premiar toda falha. Não impor binários bem/mal nem uma estratégia dominante. Recusar, adiar, negociar ou ignorar devem existir quando plausíveis, não como obrigação de todo evento.

Exemplo: achar um grimório pode permitir estudar, vender, entregar ao clero, guardar, investigar; estudo pode revelar magia proibida; venda pode criar contato comercial; entrega pode gerar relação com instituição. As opções podem ser combinadas conforme estado (estudar antes de vender). Outro exemplo: ajudar um cavaleiro amaldiçoado com recursos diferentes de acordo com conhecimentos e relações. A amostra 1.3 implementa o livro, estudo, venda, consulta à mentora e criação de uma lanterna, com retornos por iniciativa. O cavaleiro amaldiçoado permanece um exemplo não implementado.

## 5. Tempo e interface — revisão que substitui GDD 0.1/0.2 onde houver conflito
- Um controle principal de envelhecer, em vez de seis períodos obrigatórios. Avanço anual é hipótese inicial de UI, não contrato definitivo para toda raça e situação.
- Relógio interno em dias; viagens, formações e outras atividades consomem tempo conforme regras. Não mostrar agenda de horas na HUD nem exigir distribuição manual de carga horária.
- Atividades contínuas progridem automaticamente enquanto o tempo passa; escolha de ocupação, mentor, método, especialidade e compromisso, não repetição de botões de treino.
- Decisões relevantes interrompem avanço no momento correto; rotina resumida no diário. O jogador pode retomar ou encerrar o restante, sem perder efeitos anteriores.
- Não simular offline por padrão. Não gerar eventos extras apenas por clicar mais frequentemente. Não avançar tempo silenciosamente além de uma decisão urgente.
- HUD inicial candidata: identidade, idade, situação atual, poucas condições relevantes, diário, botão de envelhecer, menus contextuais de relações, ocupação, posses e atividades. Número e nome de barras são provisórios. Interface vertical mobile-first; divulgação progressiva de sistemas. Sem artifícios de gerenciamento que não gerem decisões interessantes.

## 6. Diversidade e mundo
Nascimento ponderado por contexto fictício: região, povo/raça, domicílio, família, condição econômica, aptidões e traços. Origem influencia possibilidades, não determina destino. NPCs têm identidade persistente, conhecimento limitado, objetivos, vínculos, mudanças de estado e autonomia. Personagens próximos recebem simulação mais detalhada que populações distantes. Fatos sistêmicos, eventos contextuais, cadeias de eventos e projetos de iniciativa própria interagem. Mundo pode mudar independentemente do jogador.

Antirrepetição: controlar ID, família narrativa, contexto, intervalo, frequência, exposição e variedade de decisões. Evitar textos cosméticos como substituto da variedade. Rotinas naturais podem repetir sem interação obrigatória. Eventos relevantes podem reaparecer em outro contexto se as escolhas e consequências justificarem. Memória entre vidas é hipótese opcional, nunca suprimir fatos necessários apenas porque já foram vistos. Medir variedade de trajetórias, famílias de dilemas, oportunidades, efeitos, estratégias e satisfação em sessões humanas. Não declarar a meta de 50h alcançada com testes sintéticos.

## 7. Sistemas planejados (não implementados)
Personagem, nascimento, famílias, relações, educação, habilidades, profissões, economia, magia, aventura, combate, exploração, organizações, justiça, política, propriedade, envelhecimento, legado. Implementar em fatias jogáveis interligadas, não todos simultaneamente. Atributos devem ter usos em escolhas; sem dezenas de números ornamentais. Habilidades não devem ser apenas bônus percentuais. Mundo e fantasia devem gerar oportunidades distintas; não aprofundar lore sem utilidade para o jogo. Respeitar preferências de RPG narrativo: NPCs não oniscientes, consequências reais, descrições concisas e coerência.

## 8. Base técnica e estado real atualizado
JavaScript ES modules, separado da apresentação, com seed determinística e save JSON versionado. A etapa 1.3 evolui o motor 1.2 em `etapa_1_3/src/motor.mjs`, com contrato declarativo em `src/contrato.mjs`. A implementação histórica permanece intacta em `base_original/`.

Implementado: escolhas com condições, opções reveladas por conhecimento, resultados condicionais/ponderados, efeitos validados, iniciativas, participantes persistentes, relações direcionais mínimas, conhecimento por indivíduo, consequências futuras, invalidações, transações, prevenção de aplicação dupla, rotinas automáticas por categoria e marcos semanais de seleção. Save v2 preserva ações interrompidas e fila; saves v1 de laboratório migram. O custo temporal pode ser interrompido por decisões e retomado ou abandonado sem apagar o tempo/gasto anterior. Uma vida nova mistura a seed antes do PRNG existente para reduzir correlação inicial; balanceamento probabilístico não está concluído.

Amostra: 12 decisões/34 opções, 6 atividades e 6 consequências em um começo fixo aos 16 anos. Inclui retornos ao poço e ao telhado, criação útil e uma encomenda decorrente de ação anterior. Algumas entradas reutilizam abordagens; não representam 12 dilemas independentes. O HTML autocontido `etapa_1_3/Fantasy_Life_Laboratorio_1_3.html` oferece interface de revisão vertical com envelhecer, retomada, iniciativas, diário, tentativa de save no navegador e exportação/importação. A lógica do bundle foi verificada em VM/DOM mínimo; a validação visual em navegador e Android físico ficou pendente por indisponibilidade de Chromium utilizável neste ambiente. Não confundir com UI completa, nascimento procedural ou ciclo integral de vida.

A base original passou seus 14 testes novamente. No motor atual passaram os mesmos 14 de regressão, 47 testes de agência e 6 testes de integração do bundle: 67 casos atuais. Incluem 500 percursos novos e quatro trajetórias controladas a partir da mesma origem e seed. Esses testes verificam consistência e divergência de estado; não comprovam diversão, balanceamento ou a meta de 50 horas.

Repositório oficial criado em 26/11/2026: [sapatenis132/fantasy-life](https://github.com/sapatenis132/fantasy-life), público e separado do RPG isométrico. A amostra está publicada em [https://sapatenis132.github.io/fantasy-life/](https://sapatenis132.github.io/fantasy-life/) a partir de `docs/index.html`. O fluxo básico de escolhas, pausa e save/reload foi confirmado no Chrome remoto; testes de viewports e Android físico continuam pendentes. Detalhes em `PUBLICACAO.md`. Android como aplicativo continua uma proposta. Código, testes e histórico da etapa 1.3 estão preservados.

## 9. Próximo ponto de continuidade
Etapa 1.3 concluída como fatia de arquitetura, com validação visual pendente. Próximo bloco funcional: **1.4 — estrutura de personagens**, conforme `PLANO_DE_CONTINUIDADE.md`. O modelo mínimo atual não substitui personagem, nascimento, mundo ou simulação social completos. Aumentar quantidade de eventos antes de ampliar a capacidade combinatória e validar o uso seria prematuro.

## 10. Princípio final
O mundo oferece circunstâncias. O jogador toma decisões. Os sistemas transformam essas decisões em uma história.

## Revisão da HUD — 0.4.1
A crítica do usuário no celular estabeleceu a prioridade de apresentação: a história precisa aparecer primeiro, com a decisão junto do texto. A versão 0.4.1 aplica cabeçalho compacto, navegação História/Atividades/Personagem, envelhecer na parte inferior e arquivos em menu separado. O primeiro contato não expõe todos os sistemas. Há 71 testes locais e comparação responsiva real em iframes de 320×568, 360×640 e 412×915, com a narrativa inicial inteira acima dos controles. O motor e os saves foram preservados. Detalhes e limites em `etapa_1_3/docs/REVISAO_UX_0_4_1.md`; Android físico continua pendente.
