import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = []

  async findById(id: string): Promise<AnswerComment | null> {
    const comment = this.items.find((comment) => comment.id.toString() === id)

    return comment || null
  }

  async findManyByAnswerId(
    { page }: PaginationParams,
    answerId: string,
  ): Promise<AnswerComment[]> {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      // (page - 1) * limite por página, page * o tanto a mais a ser carregado
      .slice((page - 1) * 20, page * 20)

    return answerComments
  }

  async create(answer: AnswerComment): Promise<void> {
    this.items.push(answer)
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    )

    this.items.splice(itemIndex, 1)
  }
}
