import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Post } from './post.schema';

export type PostLikeDocument = HydratedDocument<PostLike>;

@Schema()
export class PostLike {
  _id: string;

  @Prop()
  likedBy: string;

  @Prop()
  createdAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  post: Post;
}

export const PostLikeSchema = SchemaFactory.createForClass(PostLike);

// Create unique constraint for likes so a user can't like a post multiple times
// In a real world scenario likedBy would be a userId, but for the sake of
// simplicity we make it just a username
PostLikeSchema.index({ post: 1, likedBy: 1 }, { unique: true });
