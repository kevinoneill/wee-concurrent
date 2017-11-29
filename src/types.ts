export type Release = () => void;
export type Worker<T> = () => Promise<T> | T;

export interface Gate {
  acquire(timeout?: number): Promise<Release>;
  execute<T>(worker: Worker<T>, timeout?: number): Promise<T>;
}
