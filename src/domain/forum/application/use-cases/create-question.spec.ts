import { expect, test, describe, beforeEach } from 'vitest'
import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repositories'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(inMemoryQuestionRepository)
  })

  test('Should be able to create a question', async () => {
    const result = await sut.execute({
      authorId: 'author-id',
      title: 'Question title',
      content: 'Question content',
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryQuestionRepository.items[0]).toEqual(result.value?.question)
  })
})
