import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '../../src/core/entities/unique-entity-id'
import {
  AnswerComment,
  AnswerCommentProps,
} from '../../src/domain/forum/enterprise/entities/answer-comment'

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityID,
): AnswerComment {
  const newAnswerComment = AnswerComment.create(
    {
      authorId: new UniqueEntityID('author-id'),
      answerId: new UniqueEntityID('answer-id'),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return newAnswerComment
}
