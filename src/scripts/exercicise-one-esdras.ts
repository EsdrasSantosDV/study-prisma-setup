import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const customers = await prisma.customer.createMany({
    data: [
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'bob@example.com' },
    ],
  });

  const products = await prisma.product.createMany({
    data: [
      { name: 'Notebook', price: 3000 },
      { name: 'Mouse', price: 100 },
      { name: 'Keyboard', price: 250 },
    ],
  });

  const productList = await prisma.product.findMany();
  const customerList = await prisma.customer.findMany();

  for (let i = 0; i < 20; i++) {
    const product = productList[Math.floor(Math.random() * productList.length)];
    const customer = customerList[Math.floor(Math.random() * customerList.length)];
    const quantity = Math.floor(Math.random() * 5) + 1;
    const total = quantity * product.price;

    await prisma.order.create({
      data: {
        customerId: customer.id,
        productId: product.id,
        quantity,
        total,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 1_000_000_000)), // datas variadas
      },
    });
  }

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
  .then(() => console.log('✅ Seed realizado com sucesso!'))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
