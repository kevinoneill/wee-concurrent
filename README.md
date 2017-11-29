# @weegigs/concurrent

[![Greenkeeper badge](https://badges.greenkeeper.io/kevinoneill/wee-concurrent.svg)](https://greenkeeper.io/)

Utilities for dealing with concurrency in Typescript (and Javascript).

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

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
