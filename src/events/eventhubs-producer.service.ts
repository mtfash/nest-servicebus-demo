import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventHubProducerClient } from '@azure/event-hubs';
import { DefaultAzureCredential } from '@azure/identity';
import { AppEvent } from 'src/events/types';
import logger from 'src/helpers/logger';

@Injectable()
export class EventHubsProducerService {
  private readonly eventHubFQNS: string;
  private readonly eventHubName: string;

  constructor(private readonly config: ConfigService) {
    this.eventHubFQNS = config.get('EVENTHUB_FQNS');
    this.eventHubName = config.get('EVENTHUB_NAME');
  }

  async sendAppEvent(event: AppEvent) {
    const credential = new DefaultAzureCredential();

    const producer = new EventHubProducerClient(
      this.eventHubFQNS,
      this.eventHubName,
      credential,
    );

    const batch = await producer.createBatch();

    if (batch.tryAdd({ body: event })) {
      await producer.sendBatch(batch);
    } else {
      const msg = 'Could not add event to batch';

      logger.error(msg, { event });

      throw new Error(msg);
    }

    await producer.close();
  }
}
