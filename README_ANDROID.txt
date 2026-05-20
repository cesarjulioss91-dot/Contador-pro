NYX Cell Counter Pro v5.28 — Modular PWA para Android

IMPORTANTE
- Não abra o index.html pelo gerenciador de arquivos usando content:// ou file://.
- Apps modulares precisam ser servidos por HTTP/HTTPS para carregar CSS, JS, JSON e para ativar o modo PWA/offline.

OPÇÃO A — Rodar no próprio Android com Termux
1. Instale o Termux.
2. Extraia este ZIP para uma pasta do celular.
3. No Termux, acesse a pasta onde está o index.html.
4. Rode:
   python -m http.server 8080
5. Abra no Chrome:
   http://127.0.0.1:8080
6. No Chrome, toque no menu ⋮ e escolha "Adicionar à tela inicial" ou "Instalar app".
7. Depois do primeiro carregamento completo, o service worker mantém o app em cache para uso offline.

OPÇÃO B — Rodar no Android com app servidor
Use um app como Simple HTTP Server, KSWEB, Acode ou Spck Editor.
Aponte a pasta raiz para esta pasta, onde está o index.html.
Abra pelo endereço HTTP mostrado pelo app, de preferência localhost/127.0.0.1.

OPÇÃO C — Hospedar online
Hospede a pasta no GitHub Pages, Netlify, Vercel, Firebase Hosting ou Cloudflare Pages.
Acesse por HTTPS no celular e instale como PWA.

NOTA
- Service worker/PWA só funciona em HTTPS ou localhost/127.0.0.1.
- Em endereço local de rede tipo http://192.168.x.x, o app pode abrir, mas o PWA/offline pode não ativar.
