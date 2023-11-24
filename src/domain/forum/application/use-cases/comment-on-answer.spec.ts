import { expect, test, describe, beforeEach } from 'vitest'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repositories'
import { CommentOnAnswerUseCase } from './comment-on-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: CommentOnAnswerUseCase

describe('Create Comment on answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()

    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    )
  })

  test('Should be able to create a comment on a answer', async () => {
    const answer = makeAnswer()

    await inMemoryAnswersRepository.create(answer)

    const result = await sut.execute({
      authorId: 'author-id',
      answerId: answer.id.toString(),
      content: 'Comment content',
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
      'Comment content',
    )
  })

  test('Should not be able to create a comment on a answer that not exists', async () => {
    const result = await sut.execute({
      authorId: 'author-id',
      answerId: 'answer-id',
      content: 'Comment content',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
