import Database from 'better-sqlite3';
import fs from 'node:fs';
import { config } from './config';

// Ensure the data directory exists
fs.mkdirSync(config.dataDir, { recursive: true });

const db = new Database(config.dbPath);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Schema init
db.exec(`
	CREATE TABLE IF NOT EXISTS draft_state (
		id               INTEGER PRIMARY KEY CHECK (id = 1),
		current_round    INTEGER  NOT NULL DEFAULT 1,
		current_pick_idx INTEGER  NOT NULL DEFAULT 0,
		snake_order      TEXT     NOT NULL DEFAULT '[]',
		is_complete      INTEGER  NOT NULL DEFAULT 0,
		status           TEXT     NOT NULL DEFAULT 'setup'
		                          CHECK (status IN ('setup','draft','results'))
	);

	CREATE TABLE IF NOT EXISTS participants (
		id         TEXT    PRIMARY KEY,
		name       TEXT    NOT NULL,
		team_name  TEXT    NOT NULL,
		icon       TEXT    NOT NULL,
		sort_order INTEGER NOT NULL DEFAULT 0
	);

	CREATE TABLE IF NOT EXISTS picks (
		tennis_player_id TEXT    NOT NULL,
		participant_id   TEXT    NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
		pick_index       INTEGER NOT NULL,
		PRIMARY KEY (tennis_player_id)
	);

	INSERT OR IGNORE INTO draft_state (id) VALUES (1);
`);

export { db };
