export interface Participant {
	id: string;
	name: string;
	teamName: string;
	icon: string; // url or emoji or icon name
	picks: string[]; // IDs of drafted tennis players
}

export interface TennisPlayer {
	id: string;
	name: string;
	seed: number | null;
	currentRanking: number | null;
	country: string;
	image: string;
	tour?: 'atp' | 'wta';
	atpPlayerId?: string; // 4-char ATP Tour headshot ID
	apiId?: string; // RapidAPI player ID
	tournamentId?: string;
}

export interface DraftState {
	currentRound: number; // 1-6
	currentPickIndex: number; // Index in the snake order
	snakeOrder: string[]; // Array of participant IDs in order
	isComplete: boolean;
	status: 'setup' | 'draft' | 'results';
	tournamentId: string | null;
	wtaTournamentId: string | null;
}

export interface Tournament {
	id: string;
	name: string;
	year: number;
	gender: 'atp' | 'wta';
	tourType: 'slam' | 'masters1000';
	startDate: string | null;
	endDate: string | null;
	status: 'upcoming' | 'active' | 'complete';
	apiId: string | null;
	lastSyncedAt: string | null;
}

export type TournamentRound = 'R128' | 'R64' | 'R32' | 'R16' | 'QF' | 'SF' | 'F' | 'W';

export interface TournamentMatch {
	id: number;
	tournamentId: string;
	round: TournamentRound;
	matchNumber: number | null;
	player1Id: string;
	player2Id: string;
	winnerId: string | null;
	score: string | null;
	playedAt: string | null;
}

export interface PlayerTournamentPoints {
	playerId: string;
	tournamentId: string;
	roundReached: TournamentRound;
	wins: number;
	bonusPoints: number;
	pointsEarned: number;
}
