import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../application/ports/UserRepository';
import { PrismaService } from '../../../../../infrastructure/database/prisma/prisma.service';
import { User } from '../../../domain/entities/User';
import { UserMapper } from '../../mappers/UserMapper';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(user: User): Promise<void> {
    await this.prismaService.user.create({
      data: UserMapper.toPersistence(user),
    });
  }

  async getByEmail(email: string): Promise<User | null> {
    const data = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!data) return null;

    return UserMapper.toDomain(data);
  }

  async getById(id: string): Promise<User | null> {
    const data = await this.prismaService.user.findUnique({
      where: { id }
    })

    if(!data) return null

    return UserMapper.toDomain(data)
  }

  async deleteById(id: string): Promise<void> {
    await this.prismaService.user.delete({
      where: { id }
    })
  }

  async update(user: User): Promise<void> {
    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        email: user.email.value,
        password: user.password.value,
      },
    })
  }
}
