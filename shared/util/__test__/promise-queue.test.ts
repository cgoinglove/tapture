import { describe, test, expect } from 'vitest'
import { PromiseQueue, LimitedTaskExecutor } from '../src/base/promise-queue'

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

describe('PromiseQueue 테스트', () => {
  test('비동기 함수들이 순차적으로 실행되어야 합니다', async () => {
    const queue = PromiseQueue()
    const result: number[] = []
    const createTask = (value: number, delay: number) => async () => {
      await wait(delay)
      result.push(value)
      return value
    }
    const p1 = queue(createTask(1, 50))
    const p2 = queue(createTask(2, 10))
    const p3 = queue(createTask(3, 30))
    const res1 = await p1
    const res2 = await p2
    const res3 = await p3
    expect(result).toEqual([1, 2, 3])
    expect([res1, res2, res3]).toEqual([1, 2, 3])
  })
})

describe('LimitedTaskExecutor 테스트', () => {
  test('동시 실행 제한이 올바르게 작동해야 합니다', async () => {
    const executor = new LimitedTaskExecutor(2)
    const startTimes: number[] = []
    const finishTimes: number[] = []
    const createTask = (index: number, delay: number) => async () => {
      startTimes[index] = Date.now()
      await wait(delay)
      finishTimes[index] = Date.now()
      return index
    }
    const tasks = [
      executor.runTask(createTask(0, 100)),
      executor.runTask(createTask(1, 100)),
      executor.runTask(createTask(2, 100)),
      executor.runTask(createTask(3, 100)),
    ]
    const results = await Promise.all(tasks)
    expect(results).toEqual([0, 1, 2, 3])
    expect(startTimes[2]).toBeGreaterThanOrEqual(finishTimes[0])
    expect(startTimes[3]).toBeGreaterThanOrEqual(finishTimes[1])
  })
})
