export interface Repository<T> {
  get(id: string): Promise<T | undefined>;
  all(): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
}
