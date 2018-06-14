export type Release = () => void;
export type Worker<T> = () => Promise<T> | T;

/**
 * A `Gate` limits concurrent access.
 */
export interface Gate {
  /**
   * Acquires access through the gate.
   *
   * @param timeout how long (in milliseconds) to wait before timing out.
   *    An undefined timeout or a timeout of 0 or less disables the timeout function.
   *
   * @returns the `Promise` containing the `Release` function which should be called when
   *    work has completed.
   */
  acquire(timeout?: number): Promise<Release>;
  execute<T>(worker: Worker<T>, timeout?: number): Promise<T>;
}
