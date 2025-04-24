import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const total = await prisma.order.aggregate({
    _sum: { total: true },
    _avg: { total: true },
    _min: { total: true },
    _max: { total: true },
  });
  
  const totalByCustomer = await prisma.order.groupBy({
    by: ['customerId'],
    _sum: { total: true },
  });

  // Total de vendas por cliente (com nome do cliente)
  const vendasPorCliente = await prisma.order.groupBy({
    by: ['customerId'],
    _sum: { total: true },
    _count: { _all: true },
  });
  
  for (const venda of vendasPorCliente) {
    const cliente = await prisma.customer.findUnique({
      where: { id: venda.customerId },
    });
  
    console.log(`Cliente: ${cliente?.name}, Total vendido: R$ ${venda._sum.total}, Pedidos: ${venda._count._all}`);
  }

  //Produto mais vendido em valor (R$)
  const produtos = await prisma.order.groupBy({
    by: ['productId'],
    _sum: { total: true },
    orderBy: {
      _sum: { total: 'desc' },
    },
    take: 1,
  });
  
  const produtoMaisVendido = await prisma.product.findUnique({
    where: { id: produtos[0].productId },
  });
  
  console.log(`Produto mais vendido: ${produtoMaisVendido?.name}, Total: R$ ${produtos[0]._sum.total}`);

  
  const highSpenders = await prisma.order.groupBy({
    by: ['customerId'],
    _sum: { total: true },
    having: {
      total: {
        _sum: {
          gt: 2000,
        },
      },
    },
  });
  
  for (const entry of highSpenders) {
    const client = await prisma.customer.findUnique({ where: { id: entry.customerId } });
    console.log(`${client?.name} gastou R$ ${entry._sum.total}`);
  }
  const topClientes = await prisma.order.groupBy({
    by: ['customerId'],
    _sum: { total: true },
    orderBy: {
      _sum: { total: 'desc' },
    },
    take: 5,
  });
  
  for (const item of topClientes) {
    const client = await prisma.customer.findUnique({ where: { id: item.customerId } });
    console.log(`${client?.name}: R$ ${item._sum.total}`);
  
  }
  
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 