import { expect, test, describe, beforeEach } from 'vitest'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repositories'
import { makeQuestion } from 'test/factories/make-question'
import { EditQuestionUseCase } from './edit-question'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(inMemoryQuestionRepository)
  })

  test('Should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('question-id'),
    )

    await inMemoryQuestionRepository.create(newQuestion)

    await sut.execute({
      questionId: 'question-id',
      authorId: 'author-id',
      title: 'New title',
      content: 'New content',
    })

    expect(inMemoryQuestionRepository.items[0]).toMatchObject({
      title: 'New title',
      content: 'New content',
    })
  })

  test('Should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('question-id'),
    )

    await inMemoryQuestionRepository.create(newQuestion)

    expect(() => {
      return sut.execute({
        questionId: 'question-id',
        authorId: 'author-id-2',
        title: 'New title',
        content: 'New content',
      })
    }).rejects.toBeInstanceOf(Error)
  })

  test('Should not be able to edit a question that not exists', async () => {
    expect(() => {
      return sut.execute({
        questionId: 'question-id',
        authorId: 'author-id',
        title: 'New title',
        content: 'New content',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
