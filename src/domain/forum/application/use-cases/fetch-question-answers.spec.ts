import { expect, test, describe, beforeEach } from 'vitest'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repositories'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch question answers', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  test('Should be able to return a list of answers', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('1') }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('2') }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('1') }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('1') }),
    )

    const { answers } = await sut.execute({
      page: 1,
      questionId: '1',
    })

    expect(answers).toEqual([
      expect.objectContaining({ questionId: new UniqueEntityID('1') }),
      expect.objectContaining({ questionId: new UniqueEntityID('1') }),
      expect.objectContaining({ questionId: new UniqueEntityID('1') }),
    ])
  })

  test('Should be able to return a list of answers paginated', async () => {
    for (let i = 1; i <= 30; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({ questionId: new UniqueEntityID('1') }),
      )
    }

    const { answers } = await sut.execute({
      page: 2,
      questionId: '1',
    })

    expect(answers).toHaveLength(10)
  })
})
