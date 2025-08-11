import { PrismaClient, PedidoStatus } from '@prisma/client';

const prisma = new PrismaClient();

const clientes = [
  'João Silva',
  'Maria Santos',
  'Pedro Oliveira',
  'Ana Costa',
  'Carlos Ferreira',
  'Lucia Rodrigues',
  'Roberto Almeida',
  'Fernanda Lima',
  'Ricardo Pereira',
  'Juliana Martins',
];

const statusOptions: PedidoStatus[] = [
  'RECEBIDO',
  'PREPARANDO',
  'PRONTO',
  'ENTREGUE',
];

async function main() {
  console.log('🍔 Iniciando geração de pedidos de restaurante...\n');

  // Limpar dados existentes (opcional)
  await prisma.pedidoItem.deleteMany();
  await prisma.pedido.deleteMany();

  // Gerar 50 pedidos aleatórios
  for (let i = 0; i < 50; i++) {
    const cliente = clientes[Math.floor(Math.random() * clientes.length)];
    const status =
      statusOptions[Math.floor(Math.random() * statusOptions.length)];

    // Data aleatória nos últimos 30 dias
    const dataAleatoria = new Date();
    dataAleatoria.setDate(
      dataAleatoria.getDate() - Math.floor(Math.random() * 30),
    );

    await prisma.pedido.create({
      data: {
        customer: cliente,
        status,
        createdAt: dataAleatoria,
        updatedAt: dataAleatoria,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro durante a execução:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
