import { Resident } from '../../../domain/entities/Resident';
import {
  ContactResponseDto,
  ResidentResponseDto,
} from '../dto/ResidentResponseDto';

export class ResidentResponseMapper {
  private static readonly DEFAULT_PROFILE_PHOTO = 'defaults/profile.jpg';

  static toResponse(resident: Resident): ResidentResponseDto {
    return new ResidentResponseDto(
      resident.id,
      resident.name,
      resident.profilePhoto?.storageKey ??
        ResidentResponseMapper.DEFAULT_PROFILE_PHOTO,
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
