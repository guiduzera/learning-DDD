import { QuestionComment } from '../../enterprise/entities/question-comment'

export interface QuestionCommentsRepository {
  findById(id: string): Promise<QuestionComment | null>
  create(comment: QuestionComment): Promise<void>
  delete(comment: QuestionComment): Promise<void>
}
