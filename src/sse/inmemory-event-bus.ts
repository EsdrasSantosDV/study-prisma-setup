import { Subject, Observable } from 'rxjs';
import { randomUUID } from 'crypto';
import { SseEventBusPort, SseEventEnvelope } from './event-bus.port';

export class InMemorySseEventBus extends SseEventBusPort {
  private readonly bus$ = new Subject<SseEventEnvelope>();

  publish<T>(envelope: SseEventEnvelope<T>): void {
    this.bus$.next(envelope);
  }

  stream(): Observable<SseEventEnvelope> {
    return this.bus$.asObservable();
  }

  createEnvelope<T>(
    channel: string,
    type: string,
    data: T,
  ): SseEventEnvelope<T> {
    return {
      channel,
      type,
      data,
      eventId: randomUUID(),
      occurredAt: new Date().toISOString(),
      schemaVersion: 1,
    };
  }
}
