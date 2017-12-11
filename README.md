# @weegigs/concurrent

Utilities for dealing with concurrency in Typescript (and Javascript).

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![Greenkeeper badge](https://badges.greenkeeper.io/kevinoneill/wee-concurrent.svg)](https://greenkeeper.io/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Maintainability](https://api.codeclimate.com/v1/badges/3ab8d078d6ff3f6d0ba9/maintainability)](https://codeclimate.com/github/kevinoneill/wee-concurrent/maintainability)

## Overview

Concurrent provides two handy classes when you want to limit the amount of concurrent work being executed in
`Promise`s, `Semaphore` and `Mutex`.

`Semaphore` and `Mutex` share a common interface `Gate`. The `Gate` interface provides two functions `acquire`
and `execute`.

#### `acquire(timeout?: number): Promise<Release>`

If a timeout greater than zero is passed then a `TimeoutError` will be triggered if the duration in milliseconds
is exceeded.

```typescript
try {
  const release = await gate.acquire(10);
  // ... do some work ...
  release();
} catch (error) {
  release();
}
```

#### `execute<T>(worker: Worker<T>, timeout?: number): Promise<T>;`

`execute` allows you to avoid managing the `Release` function by using a `Worker`. A `Worker` is a function from
`void` to `T` or `Promise<T>`.

As with `acquire`, if a timeout greater than zero is passed then a `TimeoutError` will be triggered if the
duration in milliseconds is exceeded.

```typescript
try {
  const result = await gate.execute(() => {
    // ... do some work ...
    return value;
  }, 10);

  // ...do something with the value...
} catch (error) {
  // ... do something with the error ...
}
```

## Todo

* [x] Semaphore
* [x] Mutex
* [ ] Example Usage
* [ ] Documentation
