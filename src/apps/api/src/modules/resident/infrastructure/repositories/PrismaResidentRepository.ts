import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma/prisma.service';
import { ResidentRepository } from '../../application/ports/ResidentRepository';
import { Resident } from '../../domain/entities/Resident';
import { ResidentMapper } from '../mappers/ResidentMapper';

@Injectable()
export class PrismaResidentRepository implements ResidentRepository {
  private readonly logger = new Logger(PrismaResidentRepository.name);

  private static readonly MISSING_PROFILE_PHOTO_MESSAGE =
    'Resident persisted without profile photo.';

  constructor(private readonly prismaService: PrismaService) {}

  private throwMissingProfilePhoto(id: string): never {
    this.logger.error(
      `${PrismaResidentRepository.MISSING_PROFILE_PHOTO_MESSAGE} (resident id: ${id})`,
    );

    throw new Error(PrismaResidentRepository.MISSING_PROFILE_PHOTO_MESSAGE);
  }

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

    return residents.map((resident) => {
      if (!resident.profilePhoto) {
        this.throwMissingProfilePhoto(resident.id);
      }

      return ResidentMapper.toDomain(
        resident.id,
        resident.name,
        resident.profilePhoto,
        resident.contacts,
      );
    });
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

    if (!data.profilePhoto) {
      this.throwMissingProfilePhoto(data.id);
    }

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

    return residents.map((resident) => {
      if (!resident.profilePhoto) {
        this.throwMissingProfilePhoto(resident.id);
      }

      return ResidentMapper.toDomain(
        resident.id,
        resident.name,
        resident.profilePhoto,
        resident.contacts,
      );
    });
  }
}
