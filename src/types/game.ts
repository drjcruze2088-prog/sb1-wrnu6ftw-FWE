export interface Player {
  id: string;
  name: string;
  score: number;
  isReady: boolean;
}

export interface GameRoom {
  id: string;
  name: string;
  players: Player[];
  currentPuzzle: Puzzle | null;
  maxPlayers: number;
  isActive: boolean;
  round: number;
  maxRounds: number;
}

export interface Puzzle {
  id: string;
  category: 'movie' | 'song' | 'book' | 'tv' | 'game';
  emojis: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  hints: string[];
}

export interface GameMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: number;
  type: 'chat' | 'guess' | 'system';
}

export interface GameState {
  currentRoom: GameRoom | null;
  currentPlayer: Player | null;
  availableRooms: GameRoom[];
  messages: GameMessage[];
  isConnected: boolean;
}