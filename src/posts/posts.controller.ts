import {
  Get,
  Put,
  Post,
  Body,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';

@ApiTags('Posts')
@Controller({ path: 'posts', version: '1' })
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll() {
    return await this.postsService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.postsService.find(id);
  }

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    return await this.postsService.create(createPostDto);
  }

  @Put('/:id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return await this.postsService.update(id, updatePostDto);
  }

  @Delete('/:id')
  async deletePost(@Param('id') id: string) {
    return await this.postsService.delete(id);
  }
}
