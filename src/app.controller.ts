import { Controller, Sse, MessageEvent, Get } from '@nestjs/common';
import { Observable, Subject, interval, map, merge } from 'rxjs';
import * as os from 'node:os';
import { AppService } from './app.service';

type ServerMetrics = {
  cpuLoad1m: number;
  rssMB: number;
  heapMB: number;
  ts: string;
};

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private actionSubject = new Subject<boolean>();
  private action$ = this.actionSubject.asObservable();

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Sse('stream')
  stream(): Observable<MessageEvent> {
    const heartbeat$ = interval(15_000).pipe(
      map(() => ({ data: ':keepalive' as any })),
    );

    const metrics$ = interval(1_000).pipe(
      map(() => {
        const rssMB = Math.round(process.memoryUsage().rss / 1024 / 1024);
        const heapMB = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
        const cpuLoad1m = Number(os.loadavg()[0].toFixed(2));
        const payload: ServerMetrics = {
          rssMB,
          heapMB,
          cpuLoad1m,
          ts: new Date().toISOString(),
        };

        return { data: JSON.stringify(payload) } as MessageEvent;
      }),
    );

    return merge(heartbeat$, metrics$);
  }
}
