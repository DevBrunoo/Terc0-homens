-- CUIÚDO: metas diárias públicas e universais, sem login/código.
-- AVISO: qualquer visitante do site pode ler, adicionar, editar e excluir as metas.
CREATE TABLE IF NOT EXISTS public_goals (
  id TEXT PRIMARY KEY,
  day TEXT NOT NULL,
  text TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending','done','missed','deleted')),
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_public_goals_day ON public_goals(day);
