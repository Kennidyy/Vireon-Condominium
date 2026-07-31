import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, UserRole } from '@prisma/client';
import * as argon2 from 'argon2';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../../.env') });


const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const password = await argon2.hash('Admin@123');

  const user = await prisma.user.upsert({
    where: {
      email: 'admin@vireon.com',
    },
    update: {},
    create: {
      id: crypto.randomUUID(),
      email: 'admin@vireon.com',
      password,
      role: UserRole.ADMIN,
    },
  });

  await prisma.resident.upsert({
    where: {
      id: user.id,
    },
    update: {},
    create: {
      id: user.id,
      name: 'Admin',
      contacts: {
        create: {
          id: crypto.randomUUID(),
          type: 'EMAIL',
          value: 'admin@vireon.com',
          isPrimary: true,
        },
      },
      profilePhoto: {
        create: {
          id: crypto.randomUUID(),
          storageKey: 'seed/default-admin',
          contentType: 'PNG',
          size: 0,
        },
      },
    },
  });

  console.log('Seed executed successfully.');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });