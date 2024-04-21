import { DefaultAzureCredential } from '@azure/identity';
import {
  ProcessErrorArgs,
  ServiceBusClient,
  ServiceBusReceivedMessage,
} from '@azure/service-bus';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationsService } from './notifications.service';
import { assert } from 'src/helpers/assert';
import logger from 'src/helpers/logger';

@Injectable()
export class SBusLikesConsumer {
  private readonly serviceBusNamespace: string;
  private readonly postLikesQueueName: string;

  constructor(
    config: ConfigService,
    private readonly notificationsService: NotificationsService,
  ) {
    this.serviceBusNamespace = config.get('SERVICEBUS_FQNS');
    this.postLikesQueueName = config.get('POST_LIKES_QUEUE');

    assert(this.serviceBusNamespace, 'SERVICEBUS_FQNS variable is not defined');
    assert(this.postLikesQueueName, 'POST_LIKES_QUEUE variable is not defined');
  }

  async start() {
    const credential = new DefaultAzureCredential();
    const sbClient = new ServiceBusClient(this.serviceBusNamespace, credential);
    const receiver = sbClient.createReceiver(this.postLikesQueueName);

    await receiver.subscribe({
      // bind the handler to this to make sure we don't lose context
      processMessage: this.processMessage.bind(this),
      processError: this.processError.bind(this),
    });
  }

  async processMessage(message: ServiceBusReceivedMessage) {
    logger.info(`Received message from queue '${this.postLikesQueueName}'`, {
      messageId: message.messageId,
      body: message.body,
    });

    await this.notificationsService.create(message.body);
  }

  async processError(error: ProcessErrorArgs) {
    logger.error(error.error.message, { error });
    throw error;
  }
}
