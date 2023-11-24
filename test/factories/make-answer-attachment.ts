import { UniqueEntityID } from '../../src/core/entities/unique-entity-id'
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '../../src/domain/forum/enterprise/entities/answer-attachment'

export function makeAnswerAttachment(
  override: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityID,
): AnswerAttachment {
  const newAnswerAttachment = AnswerAttachment.create(
    {
      answerId: new UniqueEntityID('answer-id'),
      attachmentId: new UniqueEntityID('attachment-id'),
      ...override,
    },
    id,
  )

  return newAnswerAttachment
}
