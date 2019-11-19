export class Latch {
  private latch: Promise<boolean>;
  // KAO: Replaced during initialization
  private resolve: (unlatched: boolean) => void = () => {
    return;
  };

  constructor(private required: number = 1) {
    const resolver = (resolve: () => void) => {
      this.resolve = resolve;
    };

    this.latch = new Promise<boolean>(resolver);
  }

  release = () => {
    if (this.required <= 0) {
      return;
    }

    this.required -= 1;
    if (this.required > 0) {
      return;
    }

    this.resolve(true);
  };

  wait = (timeout: number = 0): Promise<boolean> => {
    if (this.required <= 0) {
      return Promise.resolve(true);
    }

    if (timeout <= 0) {
      return this.latch;
    }

    const time = new Promise<boolean>(function(resolve) {
      const to = setTimeout(() => {
        clearTimeout(to);
        resolve(false);
      }, timeout);
    });

    return Promise.race([time, this.latch]);
  };
}
