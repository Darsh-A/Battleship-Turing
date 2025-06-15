import { Board } from "./board";
import {
  Component,
  GameState,
  GameStatus,
  Position,
  PowerUpEffect,
  TeamName,
  Tile,
  Winner,
} from "./types";

export class GameSession {
  readonly boards: Record<TeamName, Board>;
  readonly powerUps: Record<TeamName, PowerUpEffect[]>;
  status: GameStatus = GameStatus.Waiting;
  winner: Winner = "ongoing";
  history: Tile[] = [];

  constructor(size: number, components: Record<TeamName, Component[]>) {
    this.boards = {
      overclockers: new Board(size, components.overclockers),
      undervolters: new Board(size, components.undervolters),
    };
    this.powerUps = { overclockers: [], undervolters: [] };
  }

  attack(team: TeamName, pos: Position) {
    const target = team === "overclockers" ? "undervolters" : "overclockers";
    const tile = this.boards[target].attack(pos);
    if (tile) this.history.push(tile);
    this.updateStatus();
    return tile;
  }

  private updateStatus() {
    const overLeft = this.boards.overclockers.state.activeComponents.length;
    const underLeft = this.boards.undervolters.state.activeComponents.length;
    if (overLeft === 0 || underLeft === 0) {
      this.status = GameStatus.Completed;
      this.winner = overLeft === 0 ? "undervolters" : "overclockers";
    } else {
      this.status = GameStatus.Ongoing;
    }
  }

  get state(): GameState {
    return {
      boardStates: {
        overclockers: this.boards.overclockers.state,
        undervolters: this.boards.undervolters.state,
      },
      powerUps: this.powerUps,
      status: this.status,
      winner: this.winner,
      history: this.history,
    };
  }
}
