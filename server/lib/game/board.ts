import { BoardState, Component, Position, Tile } from "./types";

function emptyGrid(size: number): Tile[][] {
  return Array.from({ length: size }, (_, x) =>
    Array.from({ length: size }, (_, y) => ({
      position: [x, y] as Position,
      content: "empty" as const,
      attacked: false,
    }))
  );
}

function key([x, y]: Position) {
  return `${x}:${y}`;
}

export class Board {
  readonly size: number;
  private readonly grid: Tile[][];
  private readonly original: Component[];
  private active = new Map<string, Component>();
  private damaged = new Map<string, Component>();
  turn = 0;

  constructor(size: number, components: Component[]) {
    this.size = size;
    this.grid = emptyGrid(size);
    this.original = components.map((c) => ({ ...c, status: "active" }));
    this.original.forEach((c) => this.place(c));
  }

  private place(component: Component) {
    const [x, y] = component.position;
    this.grid[x][y].content = "component";
    this.active.set(key(component.position), component);
  }

  attack(pos: Position) {
    const [x, y] = pos;
    const tile = this.grid[x]?.[y];
    if (!tile || tile.attacked) return;
    tile.attacked = true;
    const hit = this.active.get(key(pos));
    if (hit) {
      hit.status = "damaged";
      this.active.delete(key(pos));
      this.damaged.set(key(pos), hit);
    }
    this.turn += 1;
    return tile;
  }

  get state(): BoardState {
    return {
      startingComponents: this.original,
      damagedComponents: Array.from(this.damaged.values()),
      activeComponents: Array.from(this.active.values()),
      tiles: this.grid,
      size: this.size,
      turn: this.turn,
    };
  }
}
