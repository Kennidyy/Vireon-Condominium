import { Resident } from "../../domain/entities/Resident";

export class ResidentMapper {
    static toPersistance(resident: Resident) {
        const photo = resident.profilePhoto

        return {
            id: resident.id,
            userId: resident.userId,
            name: resident.name,

            contacts: {
                create: resident.contactList.map(contact => ({
                    id: contact.id,
                    type: contact.type,
                    value: contact.value,
                    isPrimary: contact.isPrimary
                })),
            },

            profilePhoto: {
                create: {
                    id: photo.id,
                    storageKey: photo.storageKey,
                    contentType: ResidentMapper.imageTypeToPrisma(photo.contentType),
                    size: photo.size
                }
            }
        }
    }

    private static imageTypeToPrisma(contentType: string): 'PNG' | 'JPEG' {
        switch (contentType) {
            case 'image/png': return 'PNG'
            case 'image/jpeg': return 'JPEG'
            default: return 'PNG'
        }
    }
}