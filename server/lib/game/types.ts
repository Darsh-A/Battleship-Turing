export enum GameStatus {
  Waiting = "waiting",
  Ongoing = "ongoing",
  Completed = "completed",
}

export type TeamName = "overclockers" | "undervolters";
export type Winner = TeamName | "ongoing";
export type Position = [number, number];

export interface PlayerConnection {
  id: string;
  socketId: string;
}

export interface PlayerTeam {
  name: TeamName;
  members: PlayerConnection[];
}

export interface PowerUp {
  name: string;
  description: string;
}

export interface Tile {
  position: Position;
  content: "mine" | "component" | "empty";
  attacked: boolean;
}

export interface Component {
  name: string;
  position: Position;
  status: "active" | "damaged";
  sprite: string;
}

export interface BoardState {
  startingComponents: Component[];
  damagedComponents: Component[];
  activeComponents: Component[];
  tiles: Tile[][];
  size: number;
  turn: number;
}

export interface GameState {
  boardStates: {
    overclockers: BoardState;
    undervolters: BoardState;
  };
  powerUps: {
    overclockers: PowerUp[];
    undervolters: PowerUp[];
  };
  status: GameStatus;
  winner: Winner;
  history: Tile[];
}

export interface Lobby {
  id: string;
  teams: {
    overclockers: PlayerTeam;
    undervolters: PlayerTeam;
  };
  game: GameState;
}

export interface PowerUpEffect extends PowerUp {
  activate(game: GameSession, team: TeamName): void;
}

import type { GameSession } from "./session";
