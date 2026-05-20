# NYX Cell Counter Pro v5.22 — PWA GitHub Pages

Pacote pronto para publicação como PWA no GitHub Pages.

## Arquivos principais

- `index.html` — aplicativo singlefile.
- `manifest.webmanifest` — manifesto PWA com caminhos relativos.
- `sw.js` — service worker com cache offline e atualização de versão.
- `icons/` — ícones PNG e SVG.

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie todos os arquivos deste pacote para a raiz do repositório.
3. Abra **Settings → Pages**.
4. Em **Build and deployment**, selecione **Deploy from a branch**.
5. Em **Branch**, escolha `main` e `/root`.
6. Salve.
7. Abra a URL gerada pelo GitHub Pages.
8. No Chrome Android, use **Adicionar à tela inicial** ou **Instalar app**.

## Observações técnicas

- Os caminhos usam `./` para funcionar em subpasta de repositório.
- O service worker só funciona em HTTPS ou localhost; GitHub Pages usa HTTPS.
- Ao atualizar o app, troque o nome do cache em `sw.js` para forçar atualização limpa.
- Se o celular continuar abrindo versão antiga, limpe os dados do site/PWA ou desinstale e instale novamente.
