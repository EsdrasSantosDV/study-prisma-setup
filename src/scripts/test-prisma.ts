import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
 
  
  // QUERY 1: Projetos ativos com tarefas pendentes e membros com cargo Lead
  const projetos1 = await prisma.project.findMany({
    where: {
      status: 'ACTIVE',
      tasks: {
        some: { completed: false },
      },
      assignments: {
        some: { assignedRole: 'Lead' },

      },
      
    },
    include: {
      tasks: true,
      assignments: { include: { member: true } },
    },
  });
  console.log('1️⃣ Projetos ativos com tarefas pendentes + Lead:', projetos1);

  // QUERY 2: Primeira tarefa pendente mais próxima
  const proximaTarefa = await prisma.task.findFirst({
    where: { completed: false },
    orderBy: { dueDate: 'asc' },
  });
  console.log('2️⃣ Próxima tarefa pendente:', proximaTarefa);

  // QUERY 3: Buscar uma assignment por chave composta
  const assignment = await prisma.projectAssignment.findFirst();
  if (assignment) {
    const compAssignment = await prisma.projectAssignment.findUnique({
      where: {
        projectId_memberId: {
          projectId: assignment.projectId,
          memberId: assignment.memberId,
        },
      },
    });
    console.log('3️⃣ Assignment por chave composta:', compAssignment);
  }

  // QUERY 4: Membros com pelo menos 2 projetos e joinado antes de 2023
  const membrosComplexos = await prisma.member.findMany({
    where: {
      joinedAt: { lt: new Date('2023-01-01') },
      assignments: { some: {} },
    },
    include: {
      assignments: { include: { project: true } },
    },
  });
  console.log('4️⃣ Membros com múltiplos projetos e entrada antes de 2023:', membrosComplexos);

  // QUERY 5: Nomes únicos de membros que foram alocados como 'Dev'
  const nomesUnicos = await prisma.member.findMany({
    where: {
      assignments: { some: { assignedRole: 'Dev' } },
    },
    distinct: ['name', 'role'],
    select: { name: true },
  });
  console.log('5️⃣ Nomes únicos com papel Dev:', nomesUnicos);

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 