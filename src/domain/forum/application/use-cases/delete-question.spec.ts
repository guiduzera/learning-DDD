import { expect, test, describe, beforeEach } from 'vitest'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repositories'
import { makeQuestion } from 'test/factories/make-question'
import { DeleteQuestionUseCase } from './delete-question'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase

describe('Delete question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestionUseCase(inMemoryQuestionRepository)
  })

  test('Should be able to delete a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('question-id'),
    )

    await inMemoryQuestionRepository.create(newQuestion)

    await sut.execute({ questionId: 'question-id', authorId: 'author-id' })

    expect(inMemoryQuestionRepository.items).toHaveLength(0)
  })

  test('Should not be able to delete a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('question-id'),
    )

    await inMemoryQuestionRepository.create(newQuestion)

    expect(() => {
      return sut.execute({ questionId: 'question-id', authorId: 'author-id-2' })
    }).rejects.toBeInstanceOf(Error)
  })

  test('Should not be able to delete a question that not exists', async () => {
    expect(() => {
      return sut.execute({ questionId: 'question-id', authorId: 'author-id' })
    }).rejects.toBeInstanceOf(Error)
  })
})
