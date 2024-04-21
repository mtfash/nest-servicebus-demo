import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiTags } from '@nestjs/swagger';
import { LikePostDto } from './dtos/like-post.dto';

@ApiTags('Post Likes')
@Controller({ path: 'likes', version: '1' })
export class LikesController {
  constructor(private readonly postsService: PostsService) {}

  @Get('/:postId')
  async findPostLikes(@Param('postId') postId: string) {
    return await this.postsService.postLikes(postId);
  }

  @Post('/:postId')
  async likePost(
    @Param('postId') postId: string,
    @Body() { likedBy }: LikePostDto,
  ) {
    return await this.postsService.likePost(postId, likedBy);
  }
}
