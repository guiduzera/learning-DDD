import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentRepository,
  ) {}

  async findById(questionId: string): Promise<Question | null> {
    const question = this.items.find(
      (question) => question.id.toString() === questionId,
    )

    return question || null
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((question) => question.slug.value === slug)

    return question || null
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      // (page - 1) * limite por página, page * o tanto a mais a ser carregado
      .slice((page - 1) * 20, page * 20)

    return questions
  }

  async create(question: Question): Promise<void> {
    this.items.push(question)
  }

  async delete(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items.splice(itemIndex, 1)

    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }

  async edit(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items[itemIndex] = question
  }
}
