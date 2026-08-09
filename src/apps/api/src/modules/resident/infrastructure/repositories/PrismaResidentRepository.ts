import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';
import { ResidentRepository } from '../../application/ports/ResidentRepository';
import { Resident } from '../../domain/entities/Resident';
import { ResidentMapper } from '../mappers/ResidentMapper';

@Injectable()
export class PrismaResidentRepository implements ResidentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(resident: Resident): Promise<void> {
    const data = ResidentMapper.toPersistence(resident);
    await this.prismaService.resident.create({ data });
  }

  async update(resident: Resident): Promise<void> {
    await this.prismaService.resident.update({
      where: { id: resident.id },
      data: ResidentMapper.toUpdatePersistence(resident),
    });
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.resident.delete({
      where: { id },
    });
  }

  async getByName(name: string): Promise<Resident[]> {
    const residents = await this.prismaService.resident.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      include: {
        profilePhoto: true,
        contacts: true,
      },
    });

    return residents.map((resident) =>
      ResidentMapper.toDomain(
        resident.id,
        resident.name,
        resident.profilePhoto,
        resident.contacts,
      ),
    );
  }

  async getById(id: string): Promise<Resident | null> {
    const data = await this.prismaService.resident.findUnique({
      where: { id },
      include: {
        profilePhoto: true,
        contacts: true,
      },
    });

    if (!data) return null;

    return ResidentMapper.toDomain(
      data.id,
      data.name,
      data.profilePhoto,
      data.contacts,
    );
  }

  async getAll(): Promise<Resident[]> {
    const residents = await this.prismaService.resident.findMany({
      include: {
        user: true,
        profilePhoto: true,
        contacts: true,
      },
    });

    return residents.map((resident) =>
      ResidentMapper.toDomain(
        resident.id,
        resident.name,
        resident.profilePhoto,
        resident.contacts,
      ),
    );
  }
}
