import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, UserRole } from '@prisma/client';
import * as argon2 from 'argon2';

export interface TestUser {
  id: string;
  email: string;
  password: string;
}

export class TestDatabase {
  private readonly prisma: PrismaClient;

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL is required to run E2E tests');
    }

    this.prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString }),
    });
  }

  async createUser(role: UserRole = UserRole.USER): Promise<TestUser> {
    const id = crypto.randomUUID();
    const email = `e2e-${id}@vireon.test`;
    const password = 'StrongPass@123';
    const passwordHash = await argon2.hash(password);

    await this.prisma.user.create({
      data: { id, email, password: passwordHash, role },
    });

    return { id, email, password };
  }

  async createUserWithCorruptedHash(
    role: UserRole = UserRole.USER,
  ): Promise<TestUser> {
    const id = crypto.randomUUID();
    const email = `e2e-corrupt-${id}@vireon.test`;
    const password = 'StrongPass@123';

    await this.prisma.user.create({
      data: { id, email, password: 'not-an-argon2-hash', role },
    });

    return { id, email, password };
  }

  async deleteUser(id: string): Promise<void> {
    await this.prisma.resident.deleteMany({ where: { id } });
    await this.prisma.user.deleteMany({ where: { id } });
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
