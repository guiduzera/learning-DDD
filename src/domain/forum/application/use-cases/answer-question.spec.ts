import { expect, test } from 'vitest'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { AnswerQuestionUseCase } from './answer-question'

const fakeAnswerQuestionRepository: AnswersRepository = {
  create: async (answer: Answer) => {
    Answer.create({
      content: 'Answer content',
      authorId: answer.authorId,
      questionId: answer.questionId,
    })
  },
}

test('create an answer', async () => {
  const answerQuestion = new AnswerQuestionUseCase(fakeAnswerQuestionRepository)

  const answer = await answerQuestion.execute({
    instructorId: 'instructor-id',
    questionId: 'question-id',
    content: 'Answer content',
  })

  expect(answer.answer).toBeInstanceOf(Answer)
  expect(answer.answer.content).toBe('Answer content')
})
