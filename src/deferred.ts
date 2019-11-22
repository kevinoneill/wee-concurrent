export class Deferred<T> implements PromiseLike<T> {
  private promise: Promise<T>;

  private resolver: (value?: T | PromiseLike<T>) => void = () => {
    throw new Error("why wasn't i replaced");
  };
  private rejector: (reason?: any) => void = () => {
    throw new Error("why wasn't i replaced");
  };

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolver = resolve;
      this.rejector = reject;
    });
  }

  get then() {
    return this.promise.then.bind(this.promise);
  }

  get catch() {
    return this.promise.catch.bind(this.promise);
  }

  get finally() {
    return this.promise.finally.bind(this.promise);
  }

  resolve(value: T) {
    this.resolver(value);
  }

  reject(reason: any) {
    this.rejector(reason);
  }
}
