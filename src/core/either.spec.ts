import { test, expect } from 'vitest'
import { Either, left, right } from './either'

function doSomething(x: boolean): Either<string, string> {
  if (x) {
    return right('success')
  }

  return left('error')
}

test('Success result', () => {
  const result = doSomething(true)

  expect(result.isRight()).toBe(true)
  expect(result.isLeft()).toBe(false)
})

test('Error result', () => {
  const result = doSomething(false)

  expect(result.isLeft()).toBe(true)
  expect(result.isRight()).toBe(false)
})
