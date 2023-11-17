import { AnswersRepository } from '../repositories/answers-repository'

interface EditAnswerUseCaseRequest {
  content: string
  answerId: string
  authorId: string
}

export class EditAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    answerId,
    authorId,
    content,
  }: EditAnswerUseCaseRequest): Promise<void> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found')
    }

    if (answer.authorId.toString() !== authorId) {
      throw new Error('You are not the author of this answer')
    }

    answer.content = content

    await this.answersRepository.edit(answer)
  }
}
