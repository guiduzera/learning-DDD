import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '../../src/core/entities/unique-entity-id'
import {
  QuestionComment,
  QuestionCommentProps,
} from '../../src/domain/forum/enterprise/entities/question-comment'

export function makeQuestionComment(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityID,
): QuestionComment {
  const newQuestionComment = QuestionComment.create(
    {
      authorId: new UniqueEntityID('author-id'),
      questionId: new UniqueEntityID('question-id'),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return newQuestionComment
}
