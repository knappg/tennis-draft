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
    points: number;
}

export interface DraftState {
    currentRound: number; // 1-6
    currentPickIndex: number; // Index in the snake order
    snakeOrder: string[]; // Array of participant IDs in order
    isComplete: boolean;
    status: 'setup' | 'draft' | 'results';
}
