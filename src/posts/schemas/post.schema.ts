import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

type ReactionType = 'like' | 'dislike';

export class PostReaction {
  @Prop()
  reactionType: ReactionType;

  @Prop()
  reactionBy: string;

  @Prop()
  createdAt: Date;
}

export class PostComment {
  @Prop()
  comment: string;

  @Prop()
  author: string;

  @Prop()
  createdAt: Date;
}

@Schema()
export class Post {
  _id: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  author: string;

  @Prop()
  createdAt: Date;

  @Prop([PostComment])
  comments: PostComment[];

  @Prop([PostReaction])
  reactions: PostReaction[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
