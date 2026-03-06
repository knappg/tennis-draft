import path from 'node:path';
import { env } from '$env/dynamic/private';

export const config = {
	dataDir: env.DATA_DIR ?? path.resolve(process.cwd(), 'data'),
	dbFilename: env.DB_FILENAME ?? 'tennis-draft.db',
	syncPassword: env.SYNC_PASSWORD ?? '',
	get dbPath() {
		return path.join(this.dataDir, this.dbFilename);
	}
} as const;
