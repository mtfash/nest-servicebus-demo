import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Post } from './schemas/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>,
  ) {}

  async findAll() {
    return await this.postModel.find();
  }

  async find(id: string) {
    const post = await this.postModel.findById(id);
    if (!post) {
      throw new NotFoundException('Post was not found');
    }

    return post;
  }

  async create(createDto: CreatePostDto) {
    const createdPost = new this.postModel({
      ...createDto,
      createdAt: new Date(),
    });

    return await createdPost.save();
  }

  async update(id: string, updateDto: UpdatePostDto) {
    const post = await this.find(id);

    post.content = updateDto.content;

    return await post.save();
  }

  async delete(id: string) {
    return await this.postModel.deleteOne({ _id: id });
  }
}
