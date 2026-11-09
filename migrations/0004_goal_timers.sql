-- Migração aditiva: temporizador de cada meta compartilhada.
ALTER TABLE public_goals ADD COLUMN duration_sec INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public_goals ADD COLUMN remaining_sec INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public_goals ADD COLUMN timer_started_at INTEGER;
ALTER TABLE public_goals ADD COLUMN timer_state TEXT NOT NULL DEFAULT 'none';
