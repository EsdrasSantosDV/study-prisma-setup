// src/pedidos/pedidos.controller.ts
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SseEventBusPort } from '../sse/event-bus.port';

type StatusPedido = 'RECEBIDO' | 'PREPARANDO' | 'PRONTO' | 'ENTREGUE';

@Controller('pedidos')
export class PedidosController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bus: SseEventBusPort,
  ) {}

  /**
   * Listar todos os pedidos (com itens)
   */
  @Get()
  async listar() {
    return this.prisma.pedido.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
  }

  /**
   * Criar um novo pedido e emitir evento SSE "criado".
   */
  @Post()
  async criar(
    @Body()
    body: {
      customer: string;
      items: { dish: string; qty: number }[];
    },
  ) {
    const pedido = await this.prisma.pedido.create({
      data: {
        customer: body.customer,
        status: 'RECEBIDO',
        items: {
          create: body.items.map((i) => ({
            dish: i.dish,
            qty: i.qty,
          })),
        },
      },
      include: { items: true },
    });

    // Emite evento SSE "pedido-criado"
    this.bus.publish(
      this.bus.createEnvelope('pedidos', 'pedido-criado', { pedido }),
    );

    return pedido;
  }

  /**
   * Atualizar o status de um pedido específico e emitir SSE "status-alterado".
   */
  @Patch(':id/status')
  async atualizarStatus(
    @Param('id') id: string,
    @Body() body: { status: StatusPedido },
  ) {
    const permitido: StatusPedido[] = [
      'RECEBIDO',
      'PREPARANDO',
      'PRONTO',
      'ENTREGUE',
    ];
    if (!permitido.includes(body.status)) {
      throw new Error(`Status inválido. Use um de: ${permitido.join(', ')}`);
    }

    const pedido = await this.prisma.pedido.update({
      where: { id },
      data: { status: body.status },
      include: { items: true },
    });

    // Emite evento SSE "status-alterado"
    this.bus.publish(
      this.bus.createEnvelope('pedidos', 'status-alterado', {
        pedidoId: pedido.id,
        status: pedido.status,
      }),
    );

    return pedido;
  }
}
