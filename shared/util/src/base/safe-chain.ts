import { isPromiseLike } from './util'

type ChainModel<Params extends any[] = any[], Result = any> = {
  then<U>(handler: (value: Awaited<Result>) => U): ChainModel<Params, Result extends PromiseLike<any> ? Promise<U> : U>
  catch<U>(handler: (error: any) => U): ChainModel<Params, Result extends PromiseLike<any> ? Promise<U> : U | Result>
  finally(handler: () => void): ChainModel<Params, Result>
  unwrap(): (...args: Params) => Result
}

export const Chain = <Params extends any[] = any[], Result = any>(executor: (...args: Params) => Result): ChainModel<Params, Result> => {
  return {
    then<U>(handler: (value: Awaited<Result>) => U) {
      const wrap = (...args: Params) => {
        const result = executor(...args) as Awaited<Result>
        return isPromiseLike(result) ? result.then(result => handler(result as Awaited<Result>)) : handler(result)
      }
      return Chain(wrap) as ChainModel<Params, Result extends PromiseLike<any> ? Promise<U> : U>
    },
    catch<U>(handler: (error: any) => U) {
      const wrap = (...args: Params) => {
        try {
          const result = executor(...args)
          return isPromiseLike(result) ? result.then(v => v, handler) : result
        } catch (error) {
          return handler(error)
        }
      }
      return Chain(wrap) as ChainModel<Params, Result extends PromiseLike<any> ? Promise<U> : U | Result>
    },
    finally(handler: () => void): ChainModel<Params, Result> {
      const wrap = (...args: Params) => {
        let result: any
        try {
          result = executor(...args)
          if (isPromiseLike(result)) result = Promise.resolve(result).finally(handler.bind(null))
          return result
        } finally {
          if (!isPromiseLike(result)) handler()
        }
      }
      return Chain(wrap) as ChainModel<Params, Result>
    },
    unwrap() {
      return executor
    },
  }
}
