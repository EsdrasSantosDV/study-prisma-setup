// src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { PedidosController } from './pedido.controller';

@Module({
  controllers: [PedidosController],
})
export class PedidoModule {}
