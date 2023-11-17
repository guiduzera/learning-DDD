import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/question-repository'

interface createQuestionUseCaseRequest {
  authorId: string
  title: string
  content: string
}

interface createQuestionUseCaseResponse {
  question: Question
}

export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    title,
    content,
  }: createQuestionUseCaseRequest): Promise<createQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      title,
      content,
    })

    await this.questionsRepository.create(question)

    return { question }
  }
}
