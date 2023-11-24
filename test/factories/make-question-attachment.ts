import { UniqueEntityID } from '../../src/core/entities/unique-entity-id'
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '../../src/domain/forum/enterprise/entities/question-attachment'

export function makeQuestionAttachment(
  override: Partial<QuestionAttachmentProps> = {},
  id?: UniqueEntityID,
): QuestionAttachment {
  const newQuestionAttachment = QuestionAttachment.create(
    {
      questionId: new UniqueEntityID('question-id'),
      attachmentId: new UniqueEntityID('attachment-id'),
      ...override,
    },
    id,
  )

  return newQuestionAttachment
}
