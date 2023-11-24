import { Either, left, right } from '../../../../core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { AnswerAttachmentRepository } from '../repositories/answer-attachments-repository'

interface EditAnswerUseCaseRequest {
  content: string
  answerId: string
  authorId: string
  attachmentIds: string[]
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentRpository: AnswerAttachmentRepository,
  ) {}

  async execute({
    answerId,
    authorId,
    content,
    attachmentIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    const currentAnswerAttachments =
      await this.answerAttachmentRpository.findManyByAnswerId(answerId)

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    )

    const newAnswerAttachments = attachmentIds.map((id) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(id),
        answerId: answer.id,
      })
    })

    answerAttachmentList.update(newAnswerAttachments)

    answer.content = content
    answer.attachments = answerAttachmentList

    await this.answersRepository.edit(answer)

    return right({ answer })
  }
}
