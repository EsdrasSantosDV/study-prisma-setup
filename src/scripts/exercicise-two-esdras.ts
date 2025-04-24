import { PrismaClient, ProjectStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Criar membros
  const members = await prisma.member.createMany({
    data: Array.from({ length: 8 }, () => ({
      name: faker.person.fullName(),
      role: faker.helpers.arrayElement(['Developer', 'Designer', 'Manager', 'QA']),
      joinedAt: faker.date.past({ years: 3 }),
    })),
  });

  const allMembers = await prisma.member.findMany();

  // Criar projetos
  const projects = await prisma.project.createMany({
    data: Array.from({ length: 5 }, () => ({
      name: faker.company.name(),
      startDate: faker.date.past({ years: 1 }),
      status: faker.helpers.arrayElement(Object.values(ProjectStatus)),
    })),
  });

  const allProjects = await prisma.project.findMany();

  // Criar assignments + tasks por projeto
  for (const project of allProjects) {
    const selectedMembers = faker.helpers.shuffle(allMembers).slice(0, 4);

    for (const member of selectedMembers) {
      await prisma.projectAssignment.create({
        data: {
          projectId: project.id,
          memberId: member.id,
          assignedRole: faker.helpers.arrayElement(['Dev', 'Lead', 'Analyst']),
        },
      });
    }

    for (let i = 0; i < 5; i++) {
      await prisma.task.create({
        data: {
          projectId: project.id,
          title: faker.hacker.phrase(),
          completed: faker.datatype.boolean(),
          dueDate: faker.date.soon({ days: 90 }),
        },
      });
    }
  }
}

main()
  .then(() => console.log('✅ Seed completo!'))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
