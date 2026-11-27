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
node etapa_1_4/verificar.mjs
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
