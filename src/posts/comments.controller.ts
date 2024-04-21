import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreateCommentDto } from './dtos/create-comment.dto';

@ApiTags('Comments')
@Controller({ path: 'comments', version: '1' })
export class CommentsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('/:postId')
  async findPostComments(@Param('postId') postId: string) {
    return await this.postsService.postComments(postId);
  }

  @Post('/:postId')
  async createComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return await this.postsService.createComment(postId, createCommentDto);
  }
}
