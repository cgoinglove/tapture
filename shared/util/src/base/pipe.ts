type Map = <T = any, U = any>(v: T) => U

function pipe<A, B>(a: (a: A) => B): (a: A) => B
function pipe<A, B, C>(a: (a: A) => B, b: (b: B) => C): (a: A) => C
function pipe<A, B, C, D>(a: (a: A) => B, b: (b: B) => C, c: (c: C) => D): (a: A) => D
function pipe<A, B, C, D, E>(a: (a: A) => B, b: (b: B) => C, c: (c: C) => D, d: (d: D) => E): (a: A) => E
function pipe<A, B, C, D, E, F>(a: (a: A) => B, b: (b: B) => C, c: (c: C) => D, d: (d: D) => E, e: (e: E) => F): (a: A) => F
function pipe<A, B, C, D, E, F, G>(
  a: (a: A) => B,
  b: (b: B) => C,
  c: (c: C) => D,
  d: (d: D) => E,
  e: (e: E) => F,
  f: (f: F) => G,
): (a: A) => G
function pipe(...fns: Map[]) {
  return (arg: any): any => fns.reduce((prev, callback) => callback(prev), arg)
}

export { pipe }
