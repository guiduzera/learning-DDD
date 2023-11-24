import { PaginationParams } from '../../src/core/repositories/pagination-params'
import { AnswerAttachmentRepository } from '../../src/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '../../src/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentRepository,
  ) {}

  async findById(answerId: string): Promise<Answer | null> {
    const answer = this.items.find(
      (answer) => answer.id.toString() === answerId,
    )

    return answer || null
  }

  async findManyByQuestionId(
    { page }: PaginationParams,
    questionId: string,
  ): Promise<Answer[]> {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      // (page - 1) * limite por página, page * o tanto a mais a ser carregado
      .slice((page - 1) * 20, page * 20)

    return answers
  }

  async create(answer: Answer): Promise<void> {
    this.items.push(answer)
  }

  async delete(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)

    this.items.splice(itemIndex, 1)

    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
  }

  async edit(answer: Answer): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)

    this.items[itemIndex] = answer
  }
}
