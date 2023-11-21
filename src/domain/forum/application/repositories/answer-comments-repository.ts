import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '../../enterprise/entities/answer-comment'

export interface AnswerCommentsRepository {
  findById(id: string): Promise<AnswerComment | null>
  findManyByAnswerId(
    params: PaginationParams,
    answerId: string,
  ): Promise<AnswerComment[]>
  create(comment: AnswerComment): Promise<void>
  delete(comment: AnswerComment): Promise<void>
}
