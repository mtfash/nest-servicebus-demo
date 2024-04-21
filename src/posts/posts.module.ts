import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './posts.service';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { PostsController } from './posts.controller';
import { LikesController } from './likes.controller';
import { Post, PostSchema } from './schemas/post.schema';
import { PostLike, PostLikeSchema } from './schemas/like.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: PostLike.name, schema: PostLikeSchema },
    ]),
  ],
  providers: [PostsService],
  controllers: [PostsController, LikesController],
  exports: [PostsService],
})
export class PostsModule {}
