import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Post } from './post.schema';
import mongoose, { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  _id: string;

  @Prop()
  comment: string;

  @Prop()
  author: string;

  @Prop()
  createdAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  post: Post;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
