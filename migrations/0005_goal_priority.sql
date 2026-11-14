-- Prioridade de cada meta, preservando registros existentes como Média.
ALTER TABLE public_goals ADD COLUMN priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high','medium','low'));
