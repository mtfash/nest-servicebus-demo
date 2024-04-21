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
export class SBusCommentsConsumer {
  private readonly serviceBusNamespace: string;
  private readonly commentsQueueName: string;

  constructor(
    config: ConfigService,
    private readonly notificationsService: NotificationsService,
  ) {
    this.serviceBusNamespace = config.get('SERVICEBUS_FQNS');
    this.commentsQueueName = config.get('COMMENTS_QUEUE');

    assert(this.serviceBusNamespace, 'SERVICEBUS_FQNS variable is not defined');
    assert(this.commentsQueueName, 'COMMENTS_QUEUE variable is not defined');
  }

  async start() {
    const credential = new DefaultAzureCredential();
    const sbClient = new ServiceBusClient(this.serviceBusNamespace, credential);
    const receiver = sbClient.createReceiver(this.commentsQueueName);

    await receiver.subscribe({
      // bind the handler to this to make sure we don't lose context
      processMessage: this.processMessage.bind(this),
      processError: this.processError.bind(this),
    });
  }

  async processMessage(message: ServiceBusReceivedMessage) {
    logger.info(`Received message from queue '${this.commentsQueueName}'`, {
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
