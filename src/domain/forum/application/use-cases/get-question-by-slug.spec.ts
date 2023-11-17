import { expect, test, describe, beforeEach } from 'vitest'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repositories'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get question by slug', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionRepository)
  })

  test('Should be able to return a question by your slug', async () => {
    const newQuestion = Question.create({
      authorId: new UniqueEntityID('author-id'),
      title: 'Question title',
      content: 'Question content',
      slug: Slug.createFromText('question-slug'),
    })

    await inMemoryQuestionRepository.create(newQuestion)

    const { question } = await sut.execute({
      slug: 'question-slug',
    })

    expect(question.id).toEqual(newQuestion.id)
  })

  // test('If question not exists, should be throw an error', async () => {
  //   const { question } = await sut.execute({
  //     slug: 'question-slug',
  //   })

  //   // Deve estourar um erro
  //   expect(question).toBeUndefined()
  // })
})
