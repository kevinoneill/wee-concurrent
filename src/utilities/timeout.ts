/** Thrown when a Timeout occurs */
export class TimeoutError extends Error {
  /**
   * Creates a `TimeoutError` with a message containing the duration
   *
   * @param duration length of the Timeout
   */
  constructor(duration: number) {
    super(`Timeout after ${duration} milliseconds`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Checks to see if an error is a `TimeoutError`
 *
 * @param error The error to check
 */
export function isTimeout(error: Error): error is TimeoutError {
  return error instanceof TimeoutError;
}

/**
 * Creates a promise that rejects with a `TimeoutError` after
 * the specified duration
 *
 * @param milliseconds how long to wait before timing out
 */
export const timeoutAfter = <T>(milliseconds: number) =>
  new Promise<T>((resolve, reject) => {
    const to = setTimeout(() => {
      clearTimeout(to);
      reject(new TimeoutError(milliseconds));
    }, milliseconds);
  });
