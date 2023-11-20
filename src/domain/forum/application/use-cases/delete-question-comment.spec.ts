import { expect, test, describe, beforeEach } from 'vitest'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete question comment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentRepository)
  })

  test('Should be able to delete a question comment', async () => {
    const newQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('question-comment-id'),
    )

    await inMemoryQuestionCommentRepository.create(newQuestionComment)

    await sut.execute({
      questionCommentId: 'question-comment-id',
      authorId: 'author-id',
    })

    expect(inMemoryQuestionCommentRepository.items).toHaveLength(0)
  })

  test('Should not be able to delete a question comment from another user', async () => {
    const newQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('question-comment-id'),
    )

    await inMemoryQuestionCommentRepository.create(newQuestionComment)

    expect(() => {
      return sut.execute({
        questionCommentId: 'question-comment-id',
        authorId: 'author-id-2',
      })
    }).rejects.toBeInstanceOf(Error)
  })

  test('Should not be able to delete a questioncomment that not exists', async () => {
    expect(() => {
      return sut.execute({
        questionCommentId: 'question-comment-id',
        authorId: 'author-id',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
