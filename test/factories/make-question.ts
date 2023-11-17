import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '../../src/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '../../src/domain/forum/enterprise/entities/question'
import { Slug } from '../../src/domain/forum/enterprise/entities/value-objects/slug'

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID,
): Question {
  const newQuestion = Question.create(
    {
      authorId: new UniqueEntityID('author-id'),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      slug: Slug.createFromText('question-slug'),
      ...override,
    },
    id,
  )

  return newQuestion
}
