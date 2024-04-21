import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  _id: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  author: string;

  @Prop()
  createdAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
