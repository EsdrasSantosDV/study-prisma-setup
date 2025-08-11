import { Global, Module, Provider } from '@nestjs/common';
import { SseEventBusPort } from './event-bus.port';
import { InMemorySseEventBus } from './inmemory-event-bus';
import { SseEventController } from './event-sse.controller';

const sseEventBusFactory: Provider = {
  provide: SseEventBusPort,
  useFactory: () => {
    return new InMemorySseEventBus();
  },
};

@Global()
@Module({
  controllers: [SseEventController],
  imports: [],
  providers: [sseEventBusFactory],
  exports: [SseEventBusPort],
})
export class SseEventModule {}
