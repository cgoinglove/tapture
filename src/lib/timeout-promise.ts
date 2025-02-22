export function timeoutPromise<T>(timeout: number, promise: Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Promise timed out'))
    }, timeout)

    promise
      .then(resolve)
      .catch(reject)
      .finally(() => {
        clearTimeout(timer)
      })
  })
}
