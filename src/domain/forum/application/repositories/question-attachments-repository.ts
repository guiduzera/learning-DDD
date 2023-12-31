import { QuestionAttachment } from '../../enterprise/entities/question-attachment'

export interface QuestionAttachmentRepository {
  findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>
  create(questionAttachment: QuestionAttachment): Promise<void>
  deleteManyByQuestionId(questionId: string): Promise<void>
}
