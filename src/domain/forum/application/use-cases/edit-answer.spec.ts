import { expect, test, describe, beforeEach } from 'vitest'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repositories'
import { makeAnswer } from 'test/factories/make-answer'
import { EditAnswerUseCase } from './edit-answer'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswerRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: EditAnswerUseCase

describe('Edit answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswerRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new EditAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryAnswerAttachmentsRepository,
    )
  })

  test('Should be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('answer-id'),
    )

    await inMemoryAnswerRepository.create(newAnswer)

    await inMemoryAnswerAttachmentsRepository.create(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
    )
    await inMemoryAnswerAttachmentsRepository.create(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    const result = await sut.execute({
      answerId: 'answer-id',
      authorId: 'author-id',
      content: 'New content',
      attachmentIds: ['1', '3'],
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryAnswerRepository.items[0]).toMatchObject({
      content: 'New content',
    })
    expect(
      inMemoryAnswerRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(inMemoryAnswerRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  test('Should not be able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('answer-id'),
    )

    await inMemoryAnswerRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: 'answer-id',
      authorId: 'author-id-2',
      content: 'New content',
      attachmentIds: ['1', '3'],
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})

test('Should not be able to edit a answer that not exists', async () => {
  const result = await sut.execute({
    answerId: 'not-exists',
    authorId: 'author-id',
    content: 'New content',
    attachmentIds: ['1', '3'],
  })

  expect(result.isLeft()).toBeTruthy()
  expect(result.value).toBeInstanceOf(ResourceNotFoundError)
})
