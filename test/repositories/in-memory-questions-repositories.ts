import { QuestionsRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

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

  async create(question: Question): Promise<void> {
    this.items.push(question)
  }

  async delete(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items.splice(itemIndex, 1)
  }

  async edit(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items[itemIndex] = question
  }
}
