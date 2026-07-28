import { Resident } from "../../domain/entities/Resident";

export class ResidentMapper {
    static toPersistance(resident: Resident) {
        return {
            userId: resident.userId,
            id: resident.id,
            name: resident.name,
            photo: resident.profilePhoto,
            contacts: resident.contactList
        }
    }
}