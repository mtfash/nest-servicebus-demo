import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import {
  EventHubConsumerClient,
  MessagingError,
  PartitionContext,
  ReceivedEventData,
  earliestEventPosition,
} from '@azure/event-hubs';
import { DefaultAzureCredential } from '@azure/identity';
import { BlobCheckpointStore } from '@azure/eventhubs-checkpointstore-blob';
import { ContainerClient } from '@azure/storage-blob';
import { SBusProducerService } from './sbus-producer.service';
import { assert } from 'src/helpers/assert';
import logger from 'src/helpers/logger';

@Injectable()
export class EventHubsConsumerService {
  private readonly eventhubFQNS: string;
  private readonly eventhubName: string;
  private readonly consumerGroup: string;
  private readonly storageAccount: string;
  private readonly containerName: string;

  constructor(
    config: ConfigService,
    private readonly sbusProducer: SBusProducerService,
  ) {
    this.eventhubFQNS = config.get('EVENTHUB_FQNS');
    this.eventhubName = config.get('EVENTHUB_NAME');
    this.consumerGroup = config.get('EVENTHUB_CONSUMER_GROUP');
    this.storageAccount = config.get('EVENTHUB_STORAGE_ACCOUNT');
    this.containerName = config.get('EVENTHUB_CHECKPOINT_CONTAINER_NAME');

    assert(this.eventhubFQNS, 'EVENTHUB_FQNS is not defined');
    assert(this.eventhubName, 'EVENTHUB_NAME is not defined');
    assert(this.consumerGroup, 'EVENTHUB_CONSUMER_GROUP is not defined');
    assert(this.storageAccount, 'EVENTHUB_STORAGE_ACCOUNT is not defined');
    assert(
      this.containerName,
      'EVENTHUB_CHECKPOINT_CONTAINER_NAME is not defined',
    );
  }

  start() {
    const credential = new DefaultAzureCredential();

    const containerURL = `https://${this.storageAccount}.blob.core.windows.net/${this.containerName}`;
    const containerClient = new ContainerClient(containerURL, credential);

    const checkpointStore = new BlobCheckpointStore(containerClient);
    const consumerClient = new EventHubConsumerClient(
      this.consumerGroup,
      this.eventhubFQNS,
      this.eventhubName,
      credential,
      checkpointStore,
    );

    consumerClient.subscribe(
      {
        // bind the handler to this to make sure we don't lose context
        processEvents: this.processEvents.bind(this),
        processError: this.processError.bind(this),
      },
      { startPosition: earliestEventPosition },
    );
  }

  async processEvents(events: ReceivedEventData[], context: PartitionContext) {
    if (events.length === 0) {
      return;
    }

    for (const event of events) {
      logger.info(
        `Event recveived from partition '${context.partitionId}' and consumer group: '${context.consumerGroup}'`,
        { event },
      );

      await this.sbusProducer.sendMessage(event.body);
    }

    await context.updateCheckpoint(events[events.length - 1]);
  }

  async processError(error: Error | MessagingError, context: PartitionContext) {
    logger.error(error.message, {
      eventhubNameSpace: this.eventhubFQNS,
      eventhub: this.eventhubName,
      consumerGroup: context.consumerGroup,
      partitionId: context.partitionId,
      error,
    });

    throw error;
  }
}
