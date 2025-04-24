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
}

main()
  .then(() => console.log('✅ Seed realizado com sucesso!'))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
