import Database from 'better-sqlite3';
import fs from 'node:fs';
import { config } from './config';

// Ensure the data directory exists
fs.mkdirSync(config.dataDir, { recursive: true });

const db = new Database(config.dbPath);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Schema init (idempotent — safe to run on every startup)
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

	CREATE TABLE IF NOT EXISTS tournaments (
		id             TEXT PRIMARY KEY,
		name           TEXT NOT NULL,
		year           INTEGER NOT NULL,
		gender         TEXT NOT NULL CHECK (gender IN ('atp','wta')),
		tour_type      TEXT NOT NULL CHECK (tour_type IN ('slam','masters1000')),
		start_date     TEXT,
		end_date       TEXT,
		status         TEXT NOT NULL DEFAULT 'upcoming'
		                    CHECK (status IN ('upcoming','active','complete')),
		api_id         TEXT,
		last_synced_at TEXT
	);

	CREATE TABLE IF NOT EXISTS tournament_players (
		id              TEXT NOT NULL,
		tournament_id   TEXT NOT NULL REFERENCES tournaments(id),
		tour            TEXT NOT NULL DEFAULT 'atp' CHECK (tour IN ('atp','wta')),
		name            TEXT NOT NULL,
		seed            INTEGER,
		country         TEXT NOT NULL DEFAULT '',
		image_url       TEXT NOT NULL DEFAULT '',
		ranking_pts     INTEGER NOT NULL DEFAULT 0,
		current_ranking INTEGER,
		atp_player_id   TEXT,
		api_id          TEXT,
		PRIMARY KEY (id, tournament_id)
	);

	CREATE TABLE IF NOT EXISTS tournament_results (
		id             INTEGER PRIMARY KEY AUTOINCREMENT,
		tournament_id  TEXT NOT NULL REFERENCES tournaments(id),
		round          TEXT NOT NULL,
		match_number   INTEGER,
		player1_id     TEXT NOT NULL,
		player2_id     TEXT NOT NULL,
		winner_id      TEXT,
		score          TEXT,
		api_match_id   TEXT UNIQUE,
		played_at      TEXT
	);

	CREATE TABLE IF NOT EXISTS player_tournament_points (
		player_id      TEXT NOT NULL,
		tournament_id  TEXT NOT NULL,
		round_reached  TEXT NOT NULL DEFAULT 'R128',
		wins           INTEGER NOT NULL DEFAULT 0,
		bonus_points   INTEGER NOT NULL DEFAULT 0,
		points_earned  INTEGER NOT NULL DEFAULT 0,
		PRIMARY KEY (player_id, tournament_id)
	);
`);

// Migration v1: add tournament tracking columns to existing tables
const dbVersion = db.pragma('user_version', { simple: true }) as number;
if (dbVersion < 1) {
	db.transaction(() => {
		db.exec(`
			ALTER TABLE draft_state  ADD COLUMN tournament_id     TEXT;
			ALTER TABLE draft_state  ADD COLUMN wta_tournament_id TEXT;
			ALTER TABLE participants ADD COLUMN tournament_id TEXT;
			ALTER TABLE picks        ADD COLUMN tournament_id TEXT;
			ALTER TABLE picks        ADD COLUMN draft_round   INTEGER NOT NULL DEFAULT 0;

			INSERT OR IGNORE INTO tournaments (id, name, year, gender, tour_type, status)
			VALUES ('ausopen-2026-atp', 'Australian Open', 2026, 'atp', 'slam', 'complete');

			INSERT OR IGNORE INTO tournaments (id, name, year, gender, tour_type, status)
			VALUES ('ausopen-2026-wta', 'Australian Open', 2026, 'wta', 'slam', 'complete');

			UPDATE draft_state
			SET tournament_id = 'ausopen-2026-atp', wta_tournament_id = 'ausopen-2026-wta'
			WHERE tournament_id IS NULL;

			UPDATE participants SET tournament_id = 'ausopen-2026-atp' WHERE tournament_id IS NULL;
			UPDATE picks        SET tournament_id = 'ausopen-2026-atp' WHERE tournament_id IS NULL;
		`);
	})();
	db.pragma('user_version = 1');
}

// Migration v2: rename sportdevs_* columns to api_* equivalents
if (dbVersion < 2) {
	db.transaction(() => {
		db.exec(`
			ALTER TABLE tournaments         RENAME COLUMN sportdevs_id    TO api_id;
			ALTER TABLE tournament_players  RENAME COLUMN sportdevs_id    TO api_id;
			ALTER TABLE tournament_results  RENAME COLUMN sportdevs_match_id TO api_match_id;
		`);
	})();
	db.pragma('user_version = 2');
}

export { db };
