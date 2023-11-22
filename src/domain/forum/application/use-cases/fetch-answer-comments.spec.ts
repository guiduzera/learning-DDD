import { expect, test, describe, beforeEach } from 'vitest'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch answer comments', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  test('Should be able to return a list of answers', async () => {
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID('1') }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID('2') }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID('1') }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID('1') }),
    )

    const result = await sut.execute({
      page: 1,
      answerId: '1',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.answerComments).toEqual([
      expect.objectContaining({ answerId: new UniqueEntityID('1') }),
      expect.objectContaining({ answerId: new UniqueEntityID('1') }),
      expect.objectContaining({ answerId: new UniqueEntityID('1') }),
    ])
  })

  test('Should be able to return a list of answer comments paginated', async () => {
    for (let i = 1; i <= 30; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityID('1') }),
      )
    }

    const result = await sut.execute({
      page: 2,
      answerId: '1',
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.answerComments).toHaveLength(10)
  })
})
