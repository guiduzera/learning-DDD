import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface DeleteAnswerCommentUseCaseRequest {
  authorId: string
  answerCommentId: string
}

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<void> {
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) {
      throw new Error('Answer comment not found')
    }

    if (answerComment.authorId.toString() !== authorId) {
      throw new Error('You are not allowed to delete this comment')
    }

    await this.answerCommentsRepository.delete(answerComment)
  }
}
