import { expect, test, describe, beforeEach } from 'vitest'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { makeQuestionComment } from 'test/factories/make-question-comment'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch question comments', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  test('Should be able to return a list of answers', async () => {
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID('1') }),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID('2') }),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID('1') }),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID('1') }),
    )

    const { questionComments } = await sut.execute({
      page: 1,
      questionId: '1',
    })

    expect(questionComments).toEqual([
      expect.objectContaining({ questionId: new UniqueEntityID('1') }),
      expect.objectContaining({ questionId: new UniqueEntityID('1') }),
      expect.objectContaining({ questionId: new UniqueEntityID('1') }),
    ])
  })

  test('Should be able to return a list of question comments paginated', async () => {
    for (let i = 1; i <= 30; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityID('1') }),
      )
    }

    const { questionComments } = await sut.execute({
      page: 2,
      questionId: '1',
    })

    expect(questionComments).toHaveLength(10)
  })
})
