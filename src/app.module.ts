import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SseEventModule } from './sse/sse.module';
import { PedidoModule } from './pedidos/pedido.module';

@Module({
  imports: [PrismaModule, SseEventModule, PedidoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
