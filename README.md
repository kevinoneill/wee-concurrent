# @weegigs/concurrent

Utilities for dealing with concurrency in Typescript (and Javascript).

## Overview

Concurrent provides two handy classes when you want to limit the amount of concurrent work being executed in
`Promise`s, `Semaphore` and `Mutex`.

`Semaphore` and `Mutex` share a common interface `Gate`. The `Gate` interface provides two functions `acquire`
and `execute`.

### `acquire(timeout?: number): Promise<Release>`

If a timeout greater than zero is passed then a `TimeoutError` will be triggered if the duration in milliseconds
is exceeded

```typescript
...
try {
  const release = await lock.acquire(10);
  ... do some work ...
  release();
} catch (error) {
  release();
}
```

## Todo

* [x] Semaphore
* [x] Mutex
* [] Example Usage
* [] Documentation
