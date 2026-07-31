import {
        ContactType as PrismaContactType,
        Contact as PrismaContact,
        ImageType as PrismaImageType,
        ProfilePhoto as PrismaProfilePhoto,
    } from "@prisma/client";
import { Resident } from "../../domain/entities/Resident";
import { ImageType } from "../../domain/enum/ImageType";
import { ProfilePhoto } from "../../domain/entities/ProfilePhoto";
import { Contact } from "../../domain/entities/Contact";
import { ContactType } from "../../domain/enum/ContactType";
export class ResidentMapper {
    static toPersistence(resident: Resident) {
        const photo = resident.profilePhoto

        return {
            id: resident.id,
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

    static toUpdatePersistence(resident: Resident) {
        const photo = resident.profilePhoto

        return {
            name: resident.name,

            contacts: {
                deleteMany: {},
                create: resident.contactList.map(contact => ({
                    id: contact.id,
                    type: contact.type,
                    value: contact.value,
                    isPrimary: contact.isPrimary
                })),
            },

            profilePhoto: {
                upsert: {
                    create: {
                        id: photo.id,
                        storageKey: photo.storageKey,
                        contentType: ResidentMapper.imageTypeToPrisma(photo.contentType),
                        size: photo.size,
                    },
                    update: {
                        storageKey: photo.storageKey,
                        contentType: ResidentMapper.imageTypeToPrisma(photo.contentType),
                        size: photo.size,
                    },
                },
            },
        }
    }

    static toDomain(
        id: string,
        name: string,
        prismaProfilePhoto: PrismaProfilePhoto,
        prismaContact: PrismaContact[]
    ) {
        const photo = ProfilePhoto.restore(
            prismaProfilePhoto.id,
            prismaProfilePhoto.storageKey,
            ResidentMapper.toDomainImageType(prismaProfilePhoto.contentType),
            prismaProfilePhoto.size
        );

        const contacts = prismaContact.map(contact => {
            return Contact.restore(
                contact.id,
                ResidentMapper.toDomainContactType(contact.type),
                contact.value,
                contact.isPrimary
            )
        })
        

        return Resident.restore(
            id,
            name,
            photo,
            contacts
        );
    }

    private static toDomainContactType(contactType: PrismaContactType) {
        switch(contactType) {
            case PrismaContactType.EMAIL:
                return ContactType.EMAIL

            case PrismaContactType.PHONE:
                return ContactType.PHONE
        }
    }

    private static toDomainImageType(imageType: PrismaImageType) {
        switch(imageType) {
            case PrismaImageType.PNG:
                return ImageType.PNG

            case PrismaImageType.JPEG:
                return ImageType.JPEG
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