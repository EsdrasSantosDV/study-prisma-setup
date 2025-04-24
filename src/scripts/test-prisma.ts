import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criar um usuário
  const user = await prisma.user.create({
    data: {
      email: 'teste@exemplo.com',
      name: 'Usuário Teste',
    },
  });

  console.log('Usuário criado:', user);

  // Criar um post
  const post = await prisma.post.create({
    data: {
      title: 'Meu primeiro post',
      content: 'Conteúdo do post',
      authorId: user.id,
    },
  });

  console.log('Post criado:', post);

  // Buscar usuário com posts
  const userWithPosts = await prisma.user.findUnique({
    where: { id: user.id },
    include: { posts: true },
  });

  console.log('Usuário com posts:', userWithPosts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 