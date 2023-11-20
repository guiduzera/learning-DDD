import { expect, test, describe, beforeEach } from 'vitest'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repositories'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repositories'
import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose de best question Answer', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryQuestionsRepository,
    )
  })

  test('Should be able to choose the best question answer', async () => {
    // "question-id" já está como padrão no campo questionId
    const answer = makeAnswer()
    const question = makeQuestion(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('question-id'),
    )

    await inMemoryAnswersRepository.create(answer)

    await inMemoryQuestionsRepository.create(question)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-id',
    })

    expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(answer.id)
  })

  test('Should not be able to choose the best question answer if the question does not exist', async () => {
    const answer = makeAnswer()

    await inMemoryAnswersRepository.create(answer)

    const promise = sut.execute({
      answerId: answer.id.toString(),
      authorId: 'author-id',
    })

    await expect(promise).rejects.toThrow()
  })

  test('Should not be able to choose the best question answer if the answer does not exist', async () => {
    const question = makeQuestion(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('question-id'),
    )

    await inMemoryQuestionsRepository.create(question)

    const promise = sut.execute({
      answerId: 'answer-id',
      authorId: 'author-id',
    })

    await expect(promise).rejects.toThrow()
  })

  test('Should not be able to choose the best question answer if the user is not the author of the question', async () => {
    const answer = makeAnswer()
    const question = makeQuestion(
      {
        authorId: new UniqueEntityID('author-id'),
      },
      new UniqueEntityID('question-id'),
    )

    await inMemoryAnswersRepository.create(answer)
    await inMemoryQuestionsRepository.create(question)

    const promise = sut.execute({
      answerId: answer.id.toString(),
      authorId: 'another-author-id',
    })

    await expect(promise).rejects.toThrow()
  })
})
