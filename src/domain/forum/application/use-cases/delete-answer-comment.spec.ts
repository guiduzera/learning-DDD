import { expect, test, describe, beforeEach } from 'vitest'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete answer comment', () => {
  beforeEach(() => {
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentRepository)
  })

  test('Should be able to delete a answer comment', async () => {
    const newAnswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('answer-comment-id'),
    )

    await inMemoryAnswerCommentRepository.create(newAnswerComment)

    await sut.execute({
      answerCommentId: 'answer-comment-id',
      authorId: 'author-id',
    })

    expect(inMemoryAnswerCommentRepository.items).toHaveLength(0)
  })

  test('Should not be able to delete a answer comment from another user', async () => {
    const newAnswerComment = makeAnswerComment(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('answer-comment-id'),
    )

    await inMemoryAnswerCommentRepository.create(newAnswerComment)

    expect(() => {
      return sut.execute({
        answerCommentId: 'answer-comment-id',
        authorId: 'author-id-2',
      })
    }).rejects.toBeInstanceOf(Error)
  })

  test('Should not be able to delete a answercomment that not exists', async () => {
    expect(() => {
      return sut.execute({
        answerCommentId: 'answer-comment-id',
        authorId: 'author-id',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
