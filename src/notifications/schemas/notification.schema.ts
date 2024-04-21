import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Post } from 'src/posts/schemas/post.schema';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema()
export class Notification {
  _id: string;

  @Prop()
  user: string;

  @Prop()
  message: string;

  @Prop()
  timestamp: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  post: Post;

  @Prop()
  eventId: string;

  @Prop()
  read: boolean;
}

export const NotificationScheam = SchemaFactory.createForClass(Notification);

NotificationScheam.index({ events: 1 });
