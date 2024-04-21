import { Module } from '@nestjs/common';
import { SBusLikesConsumer } from './sbus-likes-consumer.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notification,
  NotificationScheam,
} from './schemas/notification.schema';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { SBusCommentsConsumer } from './sbus-comments-consumer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationScheam },
    ]),
  ],
  providers: [SBusLikesConsumer, SBusCommentsConsumer, NotificationsService],
  controllers: [NotificationsController],
  exports: [SBusLikesConsumer, SBusCommentsConsumer],
})
export class NotificationsModule {}
