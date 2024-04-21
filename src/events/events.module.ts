import { Module } from '@nestjs/common';
import { EventHubsProducerService } from './eventhubs-producer.service';
import { EventHubsConsumerService } from './eventhubs-consumer.service';
import { SBusProducerService } from './sbus-producer.service';

@Module({
  imports: [],
  providers: [
    EventHubsProducerService,
    EventHubsConsumerService,
    SBusProducerService,
  ],
  exports: [EventHubsProducerService, EventHubsConsumerService],
})
export class EventsModule {}
