import { Resident } from '../../../domain/entities/Resident';
import {
  ContactResponseDto,
  ResidentResponseDto,
} from '../dto/ResidentResponseDto';

export class ResidentResponseMapper {
  static toResponse(resident: Resident): ResidentResponseDto {
    return new ResidentResponseDto(
      resident.id,
      resident.name,
      resident.profilePhoto.storageKey,
      resident.contactList.map(
        (contact) =>
          new ContactResponseDto(
            contact.id,
            contact.type,
            contact.value,
            contact.isPrimary,
          ),
      ),
    );
  }

  static toResponseList(residents: Resident[]): ResidentResponseDto[] {
    return residents.map((resident) =>
      ResidentResponseMapper.toResponse(resident),
    );
  }
}
