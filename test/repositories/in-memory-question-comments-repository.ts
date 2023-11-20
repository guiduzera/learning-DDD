import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = []

  async findById(id: string): Promise<QuestionComment | null> {
    const comment = this.items.find((comment) => comment.id.toString() === id)

    return comment || null
  }

  async create(question: QuestionComment): Promise<void> {
    this.items.push(question)
  }

  async delete(comment: QuestionComment): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === comment.id)

    this.items.splice(itemIndex, 1)
  }
}
