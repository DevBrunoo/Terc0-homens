# CUIÚDO — Sincronização Cloudflare D1

O projeto funciona offline/local mesmo sem banco. Para sincronizar notebook e celular
é necessário acessar a **mesma URL do Cloudflare Pages**. Sem cadastro: o primeiro aparelho gera um código secreto de sincronização e o segundo utiliza esse mesmo código.

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
5. Execute também [`migrations/0002_cuiudo_solo.sql`](../migrations/0002_cuiudo_solo.sql) no D1 se o banco já existia.
6. No notebook, abra **Conta → Primeiro aparelho → Ativar sincronização** e copie o código privado.
7. No celular, abra **Conta → Outro aparelho**, cole o código e conecte.
   Não é necessário cadastro, email ou senha.

## Como funciona
- `/api/solo` cria ou conecta um dispositivo com código privado aleatório de 256 bits; somente o hash SHA-256 fica no D1.
- As sessões usam cookie HTTP-only Secure e SameSite=Lax.
- `/api/auth` é mantido para compatibilidade com contas anteriores, mas não aparece mais na interface.
- `/api/sync` salva o estado por usuário com revisão; conflitos retornam 409
  para o navegador consolidar dados.
- Sincroniza o terço, orações contadas, metas, diário, reflexões salvas,
  intenções, preferências e progresso. **O diário e as intenções também são
  enviados ao seu D1**. Não use esse recurso para anotações extremamente sensíveis.
- Dados continuam em `localStorage` em cada aparelho para uso sem conexão.
- Não há cadastro nem recuperação de código: guarde uma cópia privada em local seguro.
- Quem tiver esse código consegue acessar os dados. Não publique nem compartilhe o segredo.
- Não use a URL do GitHub Pages para sincronizar: as funções somente existem
  na hospedagem Cloudflare Pages com o banco D1 ligado.
- O código não possui credenciais nem `database_id`: o binding privado do
  Cloudflare dá ao servidor acesso ao banco.

## Cuidados de produção
- Para disponibilizar a terceiros, implemente autenticação tradicional, recuperação de conta,
  monitoramento e limites Cloudflare WAF.
- Faça backups do D1. Sessões duram 30 dias.
- Não torne o D1 nem endpoints administrativos públicos.
