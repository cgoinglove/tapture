import { describe, test, expect } from 'vitest'
import { Chain } from '../src/base/safe-chain'

// 동기 및 비동기 체인, 에러 처리, finally 실행 등을 검증하는 테스트 모음
describe('Chain 유틸리티 테스트', () => {
  test('unwrap: 동기 executor가 올바른 값을 반환해야 함', () => {
    const chain = Chain((x: number) => x * 2)
    const executor = chain.unwrap()
    const result = executor(5)
    expect(result).toBe(10)
  })

  test('then: 동기 executor에 then 체인이 올바르게 작동해야 함', () => {
    // 원래 executor: x * 2
    // then 핸들러: 결과에 1을 더함
    const chain = Chain((x: number) => x * 2)
    const chained = chain.then(value => value + 1)
    const result = chained.unwrap()(5) // 5 * 2 = 10, 10 + 1 = 11
    expect(result).toBe(11)
  })

  test('then: 비동기 executor에 then 체인이 올바르게 작동해야 함', async () => {
    const chain = Chain(async (x: number) => {
      return x * 2
    })
    const chained = chain.then(value => value + 1)
    const result = await chained.unwrap()(5)
    expect(result).toBe(11)
  })

  test('catch: 동기 에러 발생 시 catch 체인이 에러를 복구해야 함', () => {
    const chain = Chain(() => {
      throw new Error('fail')
    })
    const chained = chain.catch(error => 'recovered')
    const result = chained.unwrap()()
    expect(result).toBe('recovered')
  })

  test('catch: 비동기 에러 발생 시 catch 체인이 에러를 복구해야 함', async () => {
    const chain = Chain(async () => {
      return Promise.reject(new Error('async fail'))
    })
    const chained = chain.catch(error => 'async recovered')
    const result = await chained.unwrap()()
    expect(result).toBe('async recovered')
  })

  test('finally: 동기 executor 실행 후 finally 핸들러가 호출되어야 함', () => {
    let flag = false
    const chain = Chain((x: number) => x * 2)
    const chained = chain.finally(() => {
      flag = true
    })
    const result = chained.unwrap()(5)
    expect(result).toBe(10)
    expect(flag).toBe(true)
  })

  test('finally: 비동기 executor 실행 후 finally 핸들러가 호출되어야 함', async () => {
    let flag = false
    const chain = Chain(async (x: number) => x * 2)
    const chained = chain.finally(() => {
      flag = true
    })
    const result = await chained.unwrap()(5)
    expect(result).toBe(10)
    expect(flag).toBe(true)
  })

  test('여러 then 체이닝: 동기 및 비동기 executor에서 여러 then 체인이 올바르게 작동해야 함', async () => {
    // 동기 체인 테스트
    const syncChain = Chain((x: number) => x)
      .then(x => x + 1)
      .then(x => x * 3)
    const syncResult = syncChain.unwrap()(5) // 5 -> 6 -> 18
    expect(syncResult).toBe(18)

    // 비동기 체인 테스트
    const asyncChain = Chain(async (x: number) => x)
      .then(x => x + 1)
      .then(x => x * 3)
    const asyncResult = await asyncChain.unwrap()(5)
    expect(asyncResult).toBe(18)
  })

  test('여러 catch 체이닝: 동기 에러 발생 시 catch 이후 then 체인이 올바르게 작동해야 함', () => {
    const chain = Chain(() => {
      throw new Error('error')
    })
    const chained = chain.catch(error => 10).then(x => x * 2)
    const result = chained.unwrap()() // catch 에서 10을 복구하고, then에서 10*2=20 반환
    expect(result).toBe(20)
  })

  test('then, catch, finally 혼합 체이닝: 동기/비동기 모두에서 체이닝이 올바르게 작동해야 함', async () => {
    let finallyCalled = false

    // 동기 체인: 5 * 2 = 10 → then에서 10 === 10 이면 에러 발생 → catch에서 0 복구 → finally → then에서 0+1
    const syncChain = Chain((x: number) => x * 2)
      .then(x => {
        if (x === 10) throw new Error('oops')
        return x
      })
      .catch(error => 0)
      .finally(() => {
        finallyCalled = true
      })
      .then(x => x + 1)
    const syncResult = syncChain.unwrap()(5)
    expect(syncResult).toBe(1)
    expect(finallyCalled).toBe(true)

    // 비동기 체인 동일 로직 적용
    finallyCalled = false
    const asyncChain = Chain(async (x: number) => x * 2)
      .then(x => {
        if (x === 10) throw new Error('oops')
        return x
      })
      .catch(error => 0)
      .finally(() => {
        finallyCalled = true
      })
      .then(x => x + 1)
    const asyncResult = await asyncChain.unwrap()(5)
    expect(asyncResult).toBe(1)
    expect(finallyCalled).toBe(true)
  })
})
