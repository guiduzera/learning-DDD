import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

export interface AnswerAttachmentRepository {
  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>
  create(answerAttachment: AnswerAttachment): Promise<void>
  deleteManyByAnswerId(answerId: string): Promise<void>
}
