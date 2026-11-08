# CUIÚDO — Sincronização Cloudflare D1

O projeto funciona offline/local mesmo sem banco. Para sincronizar notebook e celular
é necessário acessar a **mesma URL do Cloudflare Pages**, criar uma conta e entrar em ambos.

## Configuração de build do Cloudflare Pages
- **Framework preset:** `None`
- **Build command:** `npm run build:cloudflare`
- **Build output directory:** `dist`
- **Root directory:** vazio (raiz do repositório)
- **Production branch:** `main`

O script copia somente HTML, CSS, JavaScript e imagens para `dist`.
As funções de backend continuam na pasta `/functions` da raiz do repositório
e não são publicadas como arquivos estáticos. Use integração GitHub → Cloudflare
Pages, não upload manual do ZIP: Functions exigem Git ou Wrangler.

## Instalação (uma vez)
1. Cloudflare Dashboard → **Storage & databases → D1 SQL Database → Create**.
   Nome recomendado: `cuiudo-dados`.
2. Abra o banco criado → **Console** e execute todo o arquivo
   [`migrations/0001_cuiudo_d1.sql`](../migrations/0001_cuiudo_d1.sql).
   Alternativa com Wrangler (no diretório do projeto):
   `npx wrangler d1 execute cuiudo-dados --remote --file=migrations/0001_cuiudo_d1.sql`
3. Cloudflare Dashboard → **Workers & Pages** → projeto Pages →
   **Settings → Bindings → Add → D1 database binding**.
   **Variable name:** `DB` (exatamente). Selecione `cuiudo-dados`.
   Configure production e preview separadamente, se desejar.
4. **Redeploy** do projeto Pages após criar o binding.
5. Em **https://SEU-SITE.pages.dev**, clique em **Conta** → **Criar conta**
   (email e senha de pelo menos 12 caracteres) ou **Entrar**.
   Entre com a mesma conta no celular/notebook.

## Como funciona
- `/api/auth` registra contas ou inicia sessão via cookie HTTP-only Secure e SameSite=Lax.
- Senhas protegidas por PBKDF2-SHA256 (210 mil iterações com sal aleatório).
- `/api/sync` salva o estado por usuário com revisão; conflitos retornam 409
  para o navegador consolidar dados.
- Sincroniza o terço, orações contadas, metas, diário, reflexões salvas,
  intenções, preferências e progresso. **O diário e as intenções também são
  enviados ao seu D1**. Não use esse recurso para anotações extremamente sensíveis.
- Dados continuam em `localStorage` em cada aparelho para uso sem conexão.
- Sem confirmação por email ou recuperação de senha automatizada nesta versão:
  escolha uma senha exclusiva, guarde-a com segurança.
- Não use a URL do GitHub Pages para sincronizar: as funções somente existem
  na hospedagem Cloudflare Pages com o banco D1 ligado.
- O código não possui credenciais nem `database_id`: o binding privado do
  Cloudflare dá ao servidor acesso ao banco.

## Cuidados de produção
- Reforce autenticação com verificação de email, recuperação de conta,
  monitoramento e limites Cloudflare WAF antes de disponibilizar a terceiros.
- Faça backups do D1. Sessões duram 30 dias.
- Não torne o D1 nem endpoints administrativos públicos.
