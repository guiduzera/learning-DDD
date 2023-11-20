import { QuestionComment } from '../../enterprise/entities/question-comment'

export interface QuestionCommentsRepository {
  create(comment: QuestionComment): Promise<void>
}
