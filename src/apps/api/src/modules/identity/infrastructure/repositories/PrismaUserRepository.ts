import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../application/ports/UserRepository';
import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';
import { User } from '../../domain/entities/User';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(user: User): Promise<void> {
    await this.prismaService.user.create({
      data: {
        id: user.id,
        email: user.email.value,
        password: user.password.value,
      },
    });
  }

  async getByEmail(email: string): Promise<any | null> {
    return await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
  }
}
