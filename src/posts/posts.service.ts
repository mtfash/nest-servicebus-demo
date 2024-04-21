import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { PostLike } from './schemas/like.schema';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { Comment } from './schemas/comment.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>,
    @InjectModel(PostLike.name)
    private readonly postLikeModel: Model<PostLike>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,
  ) {}

  async findAll() {
    return await this.postModel.find();
  }

  async postLikes(postId: string) {
    return await this.postLikeModel.find({ post: postId });
  }

  async postComments(postId: string) {
    return await this.commentModel.find({ post: postId });
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

  async likePost(id: string, likedBy: string) {
    try {
      const post = await this.postModel.findById(id);
      if (!post) {
        throw new NotFoundException('Post was not found');
      }

      const createdPostLike = new this.postLikeModel({
        createdAt: new Date(),
        likedBy: likedBy,
        post: id,
      });

      return await createdPostLike.save();
    } catch (error) {
      // If the user already liked this post
      if (error.code === 11000) {
        return await this.postLikeModel.findOne({
          likedBy,
          post: id,
        });
      }

      throw error;
    }
  }

  async createComment(postId: string, createCommentDto: CreateCommentDto) {
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new NotFoundException('Post was not found');
    }

    const comment = new this.commentModel({
      ...createCommentDto,
      post: postId,
      createdAt: new Date(),
    });

    return await comment.save();
  }
}
