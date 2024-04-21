import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './schemas/notification.schema';
import { Model } from 'mongoose';
import { AppEvent, EventType } from 'src/events/types';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

  async findAll(username: string) {
    return await this.notificationModel.find({
      user: username,
    });
  }

  async find(id: string) {
    const notification = await this.notificationModel.findById(id);
    if (!notification) {
      throw new NotFoundException('Notification was not found');
    }
    return notification;
  }

  async create(appEvent: AppEvent) {
    const notification = await this.notificationModel.findOne({
      eventId: appEvent.eventId,
    });

    if (notification) {
      return notification;
    }

    let message = '';
    if (appEvent.eventType === EventType.PostLike) {
      message = `${appEvent.payload.likedBy} liked your post.`;
    } else if (appEvent.eventType === EventType.PostComment) {
      message = `${appEvent.payload.commentAuthor} left a comment on your post.`;
    }

    const createdNotification = new this.notificationModel({
      eventId: appEvent.eventId,
      message: message,
      post: appEvent.payload.post,
      timestamp: appEvent.payload.timestamp,
      user: appEvent.payload.postOwner,
    });

    return await createdNotification.save();
  }
}
