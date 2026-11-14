-- Histórico verdadeiro de mudanças de metas públicas.
-- Não retroagir conclusões antigas sem data verificável.
-- Somente IDs, tipo de evento, prioridade e data; nenhum diário ou intenção privada.
CREATE TABLE IF NOT EXISTS goal_events (
  event_id INTEGER PRIMARY KEY AUTOINCREMENT,
  goal_id TEXT NOT NULL,
  goal_day TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('created','completed','missed','reopened','deleted','restored','priority')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high','medium','low')),
  occurred_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_goal_events_time ON goal_events(occurred_at DESC,event_id DESC);
CREATE INDEX IF NOT EXISTS idx_goal_events_goal ON goal_events(goal_id,event_id);
