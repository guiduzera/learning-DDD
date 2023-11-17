import { expect, test } from 'vitest';
import { Answer } from "../entities/answer";
import { AnswersRepository } from "../repositories/answersRepositorie";
import { AnswerQuestionUseCase } from "./answer-question";

const fakeAnswerQuestionRepository: AnswersRepository = {
  create: async (answer: Answer) => {
    return;
  },
};

test('create an answer', async () => {
  const answerQuestion = new AnswerQuestionUseCase(fakeAnswerQuestionRepository);

  const answer = await answerQuestion.execute({
    instructorId: 'instructor-id',
    questionId: 'question-id',
    content: 'Answer content',
  });

  expect(answer).toBeInstanceOf(Answer);
  expect(answer.content).toBe('Answer content');
});
