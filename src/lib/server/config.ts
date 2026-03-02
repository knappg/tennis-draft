import path from 'node:path';

export const config = {
	dataDir: process.env.DATA_DIR ?? path.resolve(process.cwd(), 'data'),
	dbFilename: process.env.DB_FILENAME ?? 'tennis-draft.db',
	get dbPath() {
		return path.join(this.dataDir, this.dbFilename);
	}
} as const;
