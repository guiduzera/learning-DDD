import { expect, test, describe, beforeEach } from 'vitest'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repositories'
import { makeAnswer } from 'test/factories/make-answer'
import { EditAnswerUseCase } from './edit-answer'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'

let inMemoryAnswerRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit answer', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(inMemoryAnswerRepository)
  })

  test('Should be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('answer-id'),
    )

    await inMemoryAnswerRepository.create(newAnswer)

    await sut.execute({
      answerId: 'answer-id',
      authorId: 'author-id',
      content: 'New content',
    })

    expect(inMemoryAnswerRepository.items[0]).toMatchObject({
      content: 'New content',
    })
  })

  test('Should not be able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('answer-id'),
    )

    await inMemoryAnswerRepository.create(newAnswer)

    expect(() => {
      return sut.execute({
        answerId: 'answer-id',
        authorId: 'author-id-2',
        content: 'New content',
      })
    }).rejects.toBeInstanceOf(Error)
  })

  test('Should not be able to edit a answer that not exists', async () => {
    expect(() => {
      return sut.execute({
        answerId: 'answer-id',
        authorId: 'author-id',
        content: 'New content',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
