import { UniqueEntityID } from '../../src/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '../../src/domain/forum/enterprise/entities/question'
import { Slug } from '../../src/domain/forum/enterprise/entities/value-objects/slug'

export function makeQuestion(override: Partial<QuestionProps> = {}): Question {
  const newQuestion = Question.create({
    authorId: new UniqueEntityID('author-id'),
    title: 'Question title',
    content: 'Question content',
    slug: Slug.createFromText('question-slug'),
    ...override,
  })

  return newQuestion
}
