import { expect, test, describe, beforeEach } from 'vitest'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repositories'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Create Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })

  test('Should be able to create a answer', async () => {
    const result = await sut.execute({
      instructorId: 'instructor-id',
      questionId: 'question-id',
      content: 'Answer content',
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryAnswersRepository.items[0].id).toEqual(
      result.value?.answer.id,
    )
  })
})
