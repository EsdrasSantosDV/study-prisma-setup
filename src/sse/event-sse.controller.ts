import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { SseEventBusPort } from './event-bus.port';

@Controller('events')
export class SseEventController {
  constructor(private readonly bus: SseEventBusPort) {}

  @Sse('stream')
  streamMessages(): Observable<MessageEvent> {
    return this.bus.stream().pipe(
      map(
        (env): MessageEvent => ({
          type: 'app-event',
          id: env.eventId,
          data: env,
        }),
      ),
    );
  }
}
