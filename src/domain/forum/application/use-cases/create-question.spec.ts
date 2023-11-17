import { expect, test } from 'vitest'
import { QuestionsRepository } from '../repositories/question-repository'
import { Question } from '../../enterprise/entities/question'
import { CreateQuestionUseCase } from './create-question'

const fakeQuestionRepository: QuestionsRepository = {
  create: async (question: Question) => {
    Question.create({
      authorId: question.authorId,
      title: question.title,
      content: question.content,
    })
  },
}

test('create an question', async () => {
  const createQuestion = new CreateQuestionUseCase(fakeQuestionRepository)

  const { question } = await createQuestion.execute({
    authorId: 'author-id',
    title: 'Question title',
    content: 'Question content',
  })

  expect(question.id).toBeTruthy()
})
