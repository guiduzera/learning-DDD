import { Entity } from '../../../../core/entities/entity'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { Optional } from '../../../../core/types/optional'

export interface QuestionCommentProps {
  authorId: UniqueEntityID
  questionId: UniqueEntityID
  content: string
  createdAt: Date
  updatedAt?: Date
}

export class QuestionComment extends Entity<QuestionCommentProps> {
  get content(): string {
    return this.props.content
  }

  set content(value: string) {
    this.props.content = value
    this.touch()
  }

  get authorId(): UniqueEntityID {
    return this.props.authorId
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }

  private touch(): void {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): QuestionComment {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return questionComment
  }
}
