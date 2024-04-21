import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppEvent, EventType } from './types';
import { ServiceBusClient, ServiceBusMessage } from '@azure/service-bus';
import { assert } from 'src/helpers/assert';
import logger from 'src/helpers/logger';

@Injectable()
export class SBusProducerService {
  private readonly connectionString: string;
  private readonly postLikesQueueName: string;
  private readonly postCommentsQueueName: string;

  constructor(private readonly config: ConfigService) {
    this.connectionString = config.get('SERVICEBUS_CONNECTION_STRING');
    this.postLikesQueueName = config.get('POST_LIKES_QUEUE');
    this.postCommentsQueueName = config.get('COMMENTS_QUEUE');

    assert(
      this.connectionString,
      'SERVICEBUS_CONNECTION_STRING is not defined',
    );
    assert(this.postLikesQueueName, 'POST_LIKES_QUEUE variable is not defined');
    assert(
      this.postCommentsQueueName,
      'COMMENTS_QUEUE variable is not defined',
    );
  }

  async sendMessage(message: AppEvent) {
    let queueName: string;

    if (message.eventType === EventType.PostLike) {
      queueName = this.postLikesQueueName;
    } else if (message.eventType == EventType.PostComment) {
      queueName = this.postCommentsQueueName;
    }

    const sbClient = new ServiceBusClient(this.connectionString);

    const sender = sbClient.createSender(queueName);

    try {
      const batch = await sender.createMessageBatch();
      const serviceBusMessage: ServiceBusMessage = {
        body: message,
        contentType: 'application/json',
      };

      if (batch.tryAddMessage(serviceBusMessage)) {
        await sender.sendMessages(batch);
      }

      await sender.close();

      logger.info(`Batch was sent to '${queueName}' queue`, {
        sbMessage: serviceBusMessage,
      });
    } finally {
      await sbClient.close();
    }
  }
}
