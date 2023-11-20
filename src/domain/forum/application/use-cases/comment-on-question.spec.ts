import { expect, test, describe, beforeEach } from 'vitest'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repositories'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { makeQuestion } from 'test/factories/make-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase

describe('Create Comment on question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()

    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    )
  })

  test('Should be able to create a comment on a question', async () => {
    const question = makeQuestion()

    await inMemoryQuestionsRepository.create(question)

    const { questionComment } = await sut.execute({
      authorId: 'author-id',
      questionId: question.id.toString(),
      content: 'Comment content',
    })

    expect(inMemoryQuestionCommentsRepository.items[0].id).toEqual(
      questionComment.id,
    )
    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
      questionComment.content,
    )
  })
})
