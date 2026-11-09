-- Sincronização pessoal CUIÚDO sem conta.
CREATE TABLE IF NOT EXISTS solo_keys (
 code_hash TEXT PRIMARY KEY,
 user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
 created_at INTEGER NOT NULL
);
