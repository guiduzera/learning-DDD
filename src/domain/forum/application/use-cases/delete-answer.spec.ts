import { expect, test, describe, beforeEach } from 'vitest'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repositories'
import { makeAnswer } from 'test/factories/make-answer'
import { DeleteAnswerUseCase } from './delete-answer'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'

let inMemoryAnswerRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerUseCase(inMemoryAnswerRepository)
  })

  test('Should be able to delete a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('answer-id'),
    )

    await inMemoryAnswerRepository.create(newAnswer)

    await sut.execute({ answerId: 'answer-id', authorId: 'author-id' })

    expect(inMemoryAnswerRepository.items).toHaveLength(0)
  })

  test('Should not be able to delete a answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('answer-id'),
    )

    await inMemoryAnswerRepository.create(newAnswer)

    expect(() => {
      return sut.execute({ answerId: 'answer-id', authorId: 'author-id-2' })
    }).rejects.toBeInstanceOf(Error)
  })

  test('Should not be able to delete a answer that not exists', async () => {
    expect(() => {
      return sut.execute({ answerId: 'answer-id', authorId: 'author-id' })
    }).rejects.toBeInstanceOf(Error)
  })
})
