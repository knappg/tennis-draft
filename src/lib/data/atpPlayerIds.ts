/**
 * Mapping of lowercase player name → 4-char ATP Tour player ID.
 * Used to build headshot URLs: https://www.atptour.com/content/dam/atptour/en/players/headshots/{id}/{id}-headshot_atp.png
 * Keys use full lowercase names (as returned by the RapidAPI), with abbreviated aliases for static data.
 */
export const ATP_PLAYER_IDS: Record<string, string> = {
	// Top 100 ATP — March 2026 rankings
	'carlos alcaraz': 'a0e2',
	'jannik sinner': 's0ag',
	'novak djokovic': 'd643',
	'alexander zverev': 'z355',
	'lorenzo musetti': 'm0ej',
	'alex de minaur': 'dh58',
	'taylor fritz': 'fb98',
	'ben shelton': 's0s1',
	'felix auger aliassime': 'ag37',
	'alexander bublik': 'bk92',
	'daniil medvedev': 'mm58',
	'jakub mensik': 'm0ni',
	'casper ruud': 'rh16',
	'jack draper': 'd0co',
	'flavio cobolli': 'c0e9',
	'karen khachanov': 'ke29',
	'andrey rublev': 're44',
	'holger rune': 'r0dg',
	'alejandro davidovich fokina': 'dh50',
	'francisco cerundolo': 'c0au',
	'luciano darderi': 'd0fj',
	'frances tiafoe': 'td51',
	'jiri lehecka': 'l0bv',
	'tommy paul': 'pl56',
	'tallon griekspoor': 'gj37',
	'learner tien': 't0ha',
	'arthur rinderknech': 'rc91',
	'cameron norrie': 'n771',
	'brandon nakashima': 'n0ae',
	'tomas martin etcheverry': 'ea24',
	'arthur fils': 'f0f1',
	'corentin moutet': 'mw02',
	'ugo humbert': 'hh26',
	'joao fonseca': 'f0fv',
	'jaume munar': 'mu94',
	'sebastian korda': 'k0ah',
	'gabriel diallo': 'd0f6',
	'denis shapovalov': 'su55',
	'alejandro tabilo': 'te30',
	'grigor dimitrov': 'd875',
	'stefanos tsitsipas': 'te51',
	'alex michelsen': 'm0qi',
	'alexei popyrin': 'p09z',
	'fabian marozsan': 'm0ci',
	'zizou bergs': 'bu13',
	'adrian mannarino': 'me82',
	'nuno borges': 'bt72',
	'tomas machac': 'm0fh',
	'marin cilic': 'c977',
	'sebastian baez': 'b0bi',
	'giovanni mpetshi perricard': 'm0gz',
	'miomir kecmanovic': 'ki95',
	'botic van de zandschulp': 'v812',
	'lorenzo sonego': 'su87',
	'matteo berrettini': 'bk40',
	'hubert hurkacz': 'hb71',
	'arthur cazaux': 'c0h0',
	'mariano navone': 'n0bs',
	'jan-lennard struff': 'sl28',
	'matteo arnaldi': 'a0fc',
	'stan wawrinka': 'w367',
	'roberto bautista agut': 'bd06',
	'mattia bellucci': 'b0gg',
	'rafael nadal': 'n409',
	'roger federer': 'f324',
	// Abbreviated aliases (for static players.ts data)
	'n. djokovic': 'd643',
	'r. nadal': 'n409',
	'c. alcaraz': 'a0e2',
	'j. sinner': 's0ag',
	'a. zverev': 'z355',
	'd. medvedev': 'mm58',
	'c. ruud': 'rh16',
	's. tsitsipas': 'te51',
	'h. rune': 'r0dg',
	'a. rublev': 're44',
	'b. shelton': 's0s1',
	'f. tiafoe': 'td51',
	'j. fritz': 'fb98',
	'f. auger-aliassime': 'ag37',
	'l. musetti': 'm0ej',
	'g. dimitrov': 'd875',
	't. paul': 'pl56',
	'u. humbert': 'hh26',
	'a. de minaur': 'dh58',
	'k. khachanov': 'ke29',
	'j. draper': 'd0co',
	'h. hurkacz': 'hb71',
	'j. mensik': 'm0ni',
	'a. fils': 'f0f1',
	's. korda': 'k0ah',
	'j. fonseca': 'f0fv',
	'j. lehecka': 'l0bv',
	't. machac': 'm0fh',
	'a. bublik': 'bk92',
};

/**
 * Mapping of lowercase WTA player name → wtatennis.com numeric player ID.
 * Used to build headshot URLs: https://wtafiles.blob.core.windows.net/images/headshots/{id}.jpg
 */
export const WTA_PLAYER_IDS: Record<string, number> = {
	// Top 30 WTA — March 2026 rankings
	'aryna sabalenka': 320760,
	'iga swiatek': 326408,
	'elena rybakina': 324166,
	'coco gauff': 328560,
	'cori gauff': 328560, // API uses "Cori"
	'jessica pegula': 316956,
	'amanda anisimova': 326384,
	'jasmine paolini': 319280,
	'mirra andreeva': 331809,
	'elina svitolina': 316738,
	'victoria mboko': 331006,
	'ekaterina alexandrova': 319007,
	'belinda bencic': 319001,
	'karolina muchova': 322191,
	'linda noskova': 329668,
	'madison keys': 316959,
	'naomi osaka': 319998,
	'clara tauson': 327793,
	'iva jovic': 332285,
	'liudmila samsonova': 322222,
	'diana shnaider': 330482,
	'elise mertens': 317964,
	'anna kalinskaya': 323942,
	'qinwen zheng': 328120,
	'emma raducanu': 328366,
	'emma navarro': 325410,
	'jelena ostapenko': 319939,
	'leylah fernandez': 326735,
	'marta kostyuk': 326482,
	'xinyu wang': 326376,
};

/** Build the ATP Tour headshot URL for a given player ID. */
export function atpHeadshotUrl(atpPlayerId: string): string {
	return `https://www.atptour.com/-/media/alias/player-gladiator-headshot/${atpPlayerId}`;
}

/** Build the WTA headshot URL for a given wtatennis.com numeric player ID. */
export function wtaHeadshotUrl(wtaPlayerId: number): string {
	return `https://wtafiles.blob.core.windows.net/images/headshots/${wtaPlayerId}.jpg`;
}

/** Look up a player's ATP ID by their display name (case-insensitive). */
export function lookupAtpPlayerId(name: string): string | undefined {
	return ATP_PLAYER_IDS[name.toLowerCase()];
}

/** Look up a player's WTA numeric ID by their display name (case-insensitive). */
export function lookupWtaPlayerId(name: string): number | undefined {
	return WTA_PLAYER_IDS[name.toLowerCase()];
}

/** Return the best available image URL for a player. */
export function getPlayerImageUrl(name: string, tour: 'atp' | 'wta' = 'atp', atpPlayerId?: string): string {
	if (tour === 'wta') {
		const wtaId = lookupWtaPlayerId(name);
		if (wtaId) return wtaHeadshotUrl(wtaId);
	} else {
		const id = atpPlayerId ?? lookupAtpPlayerId(name);
		if (id) return atpHeadshotUrl(id);
	}
	const initials = name
		.split(/[\s.]+/)
		.filter(Boolean)
		.map(w => w[0].toUpperCase())
		.slice(0, 2)
		.join('');
	return `https://placehold.co/150?text=${initials}`;
}
