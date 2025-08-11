import { Observable } from 'rxjs';

export interface SseEventEnvelope<T = unknown> {
  channel: string;
  type: string;
  data: T;
  eventId: string;
  occurredAt: string;
  schemaVersion: 1;
}

export abstract class SseEventBusPort {
  abstract publish<T = unknown>(env: SseEventEnvelope<T>): void;
  abstract stream(): Observable<SseEventEnvelope>;
  abstract createEnvelope<T = unknown>(
    channel: string,
    type: string,
    data: T,
  ): SseEventEnvelope<T>;
}
