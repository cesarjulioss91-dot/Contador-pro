NYX Cell Counter Pro v5.28 — Modular PWA

Esta versão abandonou o single-file pesado e usa arquitetura modular:
- index.html leve
- CSS em assets/css
- JS em assets/js
- PWA com manifest.webmanifest e sw.js
- cache offline após primeiro carregamento por HTTP/HTTPS compatível

Como abrir corretamente:
1. Extraia o ZIP inteiro.
2. Entre na pasta extraída.
3. Sirva a pasta por HTTP:
   python -m http.server 8080
4. Abra:
   http://127.0.0.1:8080

No Android, leia README_ANDROID.txt.
Não abra por content://, file:// ou direto no gerenciador de arquivos.
