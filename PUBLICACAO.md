# Publicação da amostra

Destino autorizado pelo usuário em 26/11/2026: repositório separado **sapatenis132/fantasy-life**, com GitHub Pages para testes pelo celular.

## Publicação confirmada

Repositório público: [sapatenis132/fantasy-life](https://github.com/sapatenis132/fantasy-life).

**Jogo: https://sapatenis132.github.io/fantasy-life/**

Primeira publicação concluída em 26/11/2026: [execução do GitHub Pages](https://github.com/sapatenis132/fantasy-life/actions/runs/45891525212), commit `6af6392c53c445189bd9e6087a16037ca426af26`. O fluxo básico foi testado no Chrome remoto: escolha, interrupção do avanço, save/reload, adiamento e retorno às iniciativas. Veja `etapa_1_3/evidencias/VALIDACAO_PUBLICACAO.md`.

## Configuração ativa

- Repositório público próprio do Fantasy Life.
- Código-fonte completo e documentos preservados.
- Branch: `main`.
- GitHub Pages: **Deploy from a branch**, pasta **/docs**.
- Entrada do site: `docs/index.html`, com `.nojekyll`.

## Atualizar

```sh
node etapa_1_5/verificar.mjs
node scripts/preparar-pages.mjs
```

Commitar o código e a versão gerada de `docs/` juntos. Após o envio, confirmar o deployment do Pages e verificar no endereço publicado uma iniciativa, uma decisão, a pausa do tempo e a recuperação do save.

O jogo é estático e não envia os saves para o GitHub: eles ficam no armazenamento do navegador usado para jogar. Exportação/importação permite transferir uma vida entre arquivo local, versão online e outro aparelho.

## Interface 0.4.1

Revisão da hierarquia mobile, com história em primeiro plano e opções secundárias em áreas próprias. Motor e chave dos saves continuam compatíveis. Fontes e resultados em `etapa_1_3/docs/REVISAO_UX_0_4_1.md`. A página `/ux/` é um ambiente de comparação, com saves próprios; ela não faz parte do fluxo principal do jogador.

## Ponteclara 0.5.0

A entrada principal passa à etapa 1.4, com tempo por ações em minutos, criação, diário, mapa, necessidades, relações e habilidades. O HTML 0.4.1 anterior foi preservado em `docs/legado/index.html`, usando sua chave original.

```sh
node etapa_1_4/verificar.mjs
node scripts/preparar-pages.mjs
node scripts/preparar-revisao-vida.mjs
```

A revisão isolada fica em `/vida-preview/`; seus personagens não afetam o jogo principal. Resultados e limites em `etapa_1_4/evidencias/VALIDACAO_MOBILE.md`. A bateria atual tem 126 casos aprovados e os 14 históricos verificados separadamente. A publicação 0.5.0 foi observada no endereço principal, com título “Fantasy Life — Ponteclara”, depois do commit `520dfee527871778324babd8ab20ce8d5db15417`. A criação e o aviso de personagem anterior estavam disponíveis. A revisão isolada confirmou criação, deslocamento, conversa, prática/projeto e recuperação do save após reload; o legado também abriu com sua interface anterior. Medidas finais: narrativa acima do dock, sem rolagem horizontal e oito botões de mapa sem sobreposição nas três dimensões verificadas.

## HUD 0.5.1

Revisão da apresentação por solicitação do usuário: cena/lugar e ações no centro, painel lateral em telas largas, painel recolhível no celular e diário em janela própria. O resultado do comando ocupa uma passagem breve; o histórico não preenche mais a descrição do lugar.

Mesma entrada `docs/index.html` e mesma chave de save 0.5.0. Catálogo e regras não foram alterados; não exige criar outro personagem. Testes: 135 casos atuais aprovados e os 14 históricos separados. Verificação de layout e interação no Chrome remoto em preview gerenciado, incluindo três viewports CSS. Evidências em `etapa_1_4/docs/REVISAO_HUD_0_5_1.md` e `etapa_1_4/evidencias/HUD_0_5_1_MEDIDAS.json`.

Publicação 0.5.1 confirmada no endereço principal após o commit `4b4c0717f2e3ac70d6fc1380150a50b7cd8bf1a6`. [Execução do Pages concluída com sucesso](https://github.com/sapatenis132/fantasy-life/actions/runs/45921614893). O fluxo público isolado de estudo → Continuar → Diário confirmou a separação entre a descrição do lugar e a lembrança da ação. Na primeira abertura havia conteúdo anterior em cache; recarregar a entrada principal carregou a nova HUD.

## HUD 0.5.2

Necessidades sempre presentes na gameplay móvel, em faixa compacta, e atalhos para os cuidados disponíveis no lugar. Mesmo endereço, catálogo e chave de save. Verificação: 142 casos atuais e 14 históricos separados; medidas em `etapa_1_4/evidencias/HUD_0_5_2_MEDIDAS.json` e relatório em `etapa_1_4/docs/REVISAO_HUD_0_5_2.md`.

Publicação 0.5.2 confirmada: commit `d67b8edd1fbadfa48c8206c579f2774fc34a8cc2`, [Pages concluído com sucesso](https://github.com/sapatenis132/fantasy-life/actions/runs/45923794019). A versão foi conferida na entrada principal e no ambiente público isolado: tocar em Energia, escolher descanso e continuar manteve a faixa visível e atualizou o estado às 09:00.

## O Moinho Afogado 0.6.0

Etapa 1.5 em `etapa_1_5/`; entrada principal gerada pelo mesmo comando `node scripts/preparar-pages.mjs`. Verificar com `node etapa_1_5/verificar.mjs`. Revisão isolada em `/vida-preview/`, chave `fantasy-life-preview-1.5-moinho`.

Catálogo 2: migração automática da chave principal, backup antes de gravar em `fantasy-life-vida-1.4-antes-0.6`, cópia 0.5.2 em `/legado-0-5/` usando apenas esse backup. Não criar novo personagem para receber o capítulo. O legado 0.4.1 permanece independente. Evidência local e limites em `etapa_1_5/docs/VALIDACAO_INTERFACE.md`. A confirmação pública é registrada após observar o deployment.

Publicação 0.6.0 confirmada: commit `698348550a927f461645da3690f6c921f20b5d6a`, [Pages concluído com sucesso](https://github.com/sapatenis132/fantasy-life/actions/runs/45926622755), duração observada de 29 s. A entrada principal exibiu 0.6.0 em Arquivos; a revisão pública isolada confirmou criação → rumores → ferramentas → reload → objetivo acompanhado. A cópia `/legado-0-5/` abriu a 0.5.2. Nenhum personagem foi criado ou alterado na chave principal durante essa conferência.
