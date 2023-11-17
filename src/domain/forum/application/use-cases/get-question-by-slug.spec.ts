import { expect, test, describe, beforeEach } from 'vitest'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repositories'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get question by slug', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionRepository)
  })

  test('Should be able to return a question by your slug', async () => {
    const newQuestion = makeQuestion()

    await inMemoryQuestionRepository.create(newQuestion)

    const { question } = await sut.execute({
      slug: 'question-slug',
    })

    expect(question.id).toEqual(newQuestion.id)
  })

  test('If question not exists, should be throw an error', async () => {
    expect(() => {
      return sut.execute({ slug: 'question-slug' })
    }).rejects.toBeInstanceOf(Error)
  })
})
