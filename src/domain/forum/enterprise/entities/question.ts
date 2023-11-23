import dayjs from 'dayjs'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Slug } from './value-objects/slug'
import { AggregateRoot } from '../../../../core/entities/aggregate-root'
import { QuestionAttachment } from './question-attachment'

export interface QuestionProps {
  authorId: UniqueEntityID
  bestAnswerId?: UniqueEntityID
  title: string
  content: string
  slug: Slug
  attachments: QuestionAttachment[]
  createdAt: Date
  updatedAt?: Date
}

export class Question extends AggregateRoot<QuestionProps> {
  get authorId(): UniqueEntityID {
    return this.props.authorId
  }

  get bestAnswerId(): UniqueEntityID | undefined {
    return this.props.bestAnswerId
  }

  set bestAnswerId(value: UniqueEntityID) {
    this.props.bestAnswerId = value
    this.touch()
  }

  get title(): string {
    return this.props.title
  }

  set title(value: string) {
    this.props.title = value
    this.props.slug = Slug.createFromText(value)
    this.touch()
  }

  get content(): string {
    return this.props.content
  }

  set content(value: string) {
    this.props.content = value
    this.touch()
  }

  get slug(): Slug {
    return this.props.slug
  }

  get attachments(): QuestionAttachment[] {
    return this.props.attachments
  }

  set attachments(value: QuestionAttachment[]) {
    this.props.attachments = value
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'day') <= 3
  }

  // resumo da resposta
  get excerpt(): string {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch(): void {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityID,
  ): Question {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        createdAt: props.createdAt ?? new Date(),
        attachments: props.attachments ?? [],
      },
      id,
    )

    return question
  }
}
