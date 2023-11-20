import { AnswerComment } from '../../enterprise/entities/answer-comment'

export interface AnswerCommentsRepository {
  findById(id: string): Promise<AnswerComment | null>
  create(comment: AnswerComment): Promise<void>
  delete(comment: AnswerComment): Promise<void>
}
