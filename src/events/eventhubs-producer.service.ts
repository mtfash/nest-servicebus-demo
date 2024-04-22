import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventHubProducerClient } from '@azure/event-hubs';
import { AppEvent } from 'src/events/types';
import logger from 'src/helpers/logger';

@Injectable()
export class EventHubsProducerService {
  private readonly connectionString: string;
  private readonly eventHubName: string;

  constructor(private readonly config: ConfigService) {
    this.connectionString = config.get('EVENTHUB_CONNECTION_STRING');
    this.eventHubName = config.get('EVENTHUB_NAME');
  }

  async sendAppEvent(event: AppEvent) {
    const producer = new EventHubProducerClient(
      this.connectionString,
      this.eventHubName,
    );

    const batch = await producer.createBatch();

    if (batch.tryAdd({ body: event })) {
      await producer.sendBatch(batch);
    } else {
      const msg = 'Could not add event to batch';

      logger.error(msg, { service: 'EventHubsProducerService', event });

      throw new Error(msg);
    }

    await producer.close();
  }
}
