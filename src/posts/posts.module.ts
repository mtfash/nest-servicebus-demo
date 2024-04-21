import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { LikesController } from './likes.controller';
import { Post, PostSchema } from './schemas/post.schema';
import { CommentsController } from './comments.controller';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { PostLike, PostLikeSchema } from './schemas/like.schema';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: PostLike.name, schema: PostLikeSchema },
    ]),
    EventsModule,
  ],
  providers: [PostsService],
  controllers: [PostsController, LikesController, CommentsController],
  exports: [PostsService],
})
export class PostsModule {}
