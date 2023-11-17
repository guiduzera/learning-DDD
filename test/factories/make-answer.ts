import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '../../src/core/entities/unique-entity-id'
import {
  Answer,
  AnswerProps,
} from '../../src/domain/forum/enterprise/entities/answer'

export function makeAnswer(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityID,
): Answer {
  const newAnswer = Answer.create(
    {
      authorId: new UniqueEntityID('author-id'),
      questionId: new UniqueEntityID('question-id'),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return newAnswer
}
