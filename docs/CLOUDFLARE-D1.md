# CUIÚDO — Metas universais no Cloudflare D1

## Como funciona agora

- **Metas de hoje são globais e públicas:** todos os visitantes do mesmo site leem,
  adicionam, concluem, reabrem e excluem metas sem login, cadastro, senha ou código.
- Ao abrir o site, metas são carregadas automaticamente do D1. Mudanças são gravadas
  pela rota `/api/goals` e verificadas em outros aparelhos periodicamente.
- Dados antigos de metas do navegador são importados ao banco uma única vez.
- **Atenção à privacidade:** não escreva dados pessoais, sigilosos ou sensíveis nas
  metas. Qualquer pessoa com o endereço do site pode visualizá-las e alterá-las.
- Diário, intenções, acompanhamento do terço e preferências **permanecem apenas
  naquele navegador**. Não fazem parte da lista global, para não divulgar dados
  privados de quem visita o site.
- A API pública limita tamanho e frequência de escrita, mas não identifica usuários
  e não impede que outra pessoa modifique metas.

## Cloudflare Pages

- Framework preset: `None`
- Build command: `npm run build:cloudflare`
- Output directory: `dist`
- Branch: `main`
- Root directory: vazio.

O binding D1 de produção é `DB`, associado ao banco `cuiudo-dados`.

Depois de criar as tabelas originais, execute
[`migrations/0003_public_goals.sql`](../migrations/0003_public_goals.sql)
no console do D1. Esse arquivo cria `public_goals` e seu índice.

A rota pública de metas é `/api/goals` (GET e POST).
As rotas antigas `/api/auth`, `/api/solo` e `/api/sync` ficam disponíveis
por compatibilidade, mas a interface não pede cadastro ou conexão.

## Cronômetros das metas

- Duração em minutos escolhida no formulário de nova meta; se for maior que zero, inicia imediatamente.
- Cada cartão possui contador, **Pausar**, **Continuar**, **Iniciar/Reiniciar**.
- O D1 armazena `duration_sec`, `remaining_sec`, `timer_started_at` e `timer_state`; o tempo restante deriva do relógio, não de requisições a cada segundo.
- Execute `migrations/0004_goal_timers.sql` uma vez em bancos existentes.
- Os cronômetros seguem a mesma natureza pública das metas; qualquer visitante do site pode editá-los.
