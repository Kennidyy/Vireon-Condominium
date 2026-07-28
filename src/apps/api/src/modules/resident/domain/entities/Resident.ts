import { PersonName } from "../value-objects/PersonName";
import { Uuid } from "../value-objects/Uuid";
import { Contact } from "./Contact";
import { ProfilePhoto } from "./ProfilePhoto";

export class Resident {
    private static readonly MAX_CONTACTS = 10;

    readonly #id: Uuid;
    readonly #userId: Uuid;

    #name: PersonName;
    #profilePhoto: ProfilePhoto;
    #contacts: Contact[];

    private constructor(
        id: Uuid,
        userId: Uuid,
        name: PersonName,
        profilePhoto: ProfilePhoto,
        contacts: Contact[],
    ) {
        this.#id = id;
        this.#userId = userId;
        this.#name = name;
        this.#profilePhoto = profilePhoto;
        this.#contacts = contacts;
    }

    public static create(
        userId: Uuid,
        name: PersonName,
        profilePhoto: ProfilePhoto,
        contacts: Contact[] = [],
    ): Resident {
        if (contacts.length > Resident.MAX_CONTACTS) {
            throw new Error(
                `Resident cannot have more than ${Resident.MAX_CONTACTS} contacts`,
            );
        }

        return new Resident(
            Uuid.generate(),
            userId,
            name,
            profilePhoto,
            contacts,
        );
    }

    public static restore(
        id: string,
        userId: string,
        name: string,
        profilePhoto: ProfilePhoto,
        contacts: Contact[],
    ): Resident {
        return new Resident(
            Uuid.create(id),
            Uuid.create(userId),
            PersonName.create(name),
            profilePhoto,
            contacts,
        );
    }

    public changeName(newName: string): void {
        this.#name = PersonName.create(newName);
    }

    public changeProfilePhoto(
        newPhoto: ProfilePhoto,
    ): void {
        this.#profilePhoto = newPhoto;
    }

    public addContact(contact: Contact): void {
        if (this.#contacts.length >= Resident.MAX_CONTACTS) {
            throw new Error(
                `Resident cannot have more than ${Resident.MAX_CONTACTS} contacts`,
            );
        }

        this.#contacts.push(contact);
    }

    public changeContactValue(
        contactId: string,
        newValue: string,
    ): void {
        const contact = this.#contacts.find(
            contact => contact.id === contactId,
        );

        if (!contact) {
            throw new Error("Contact not found");
        }

        contact.changeValue(newValue);
    }

    public setPrimaryContact(
        contactId: string,
    ): void {
        const contact = this.#contacts.find(
            contact => contact.id === contactId,
        );

        if (!contact) {
            throw new Error("Contact not found");
        }

        this.#contacts.forEach(contact => {
            contact.changePrimaryStatus(false);
        });

        contact.changePrimaryStatus(true);
    }

    public removeContact(
        contactId: string,
    ): void {
        const index = this.#contacts.findIndex(
            contact => contact.id === contactId,
        );

        if (index === -1) {
            throw new Error("Contact not found");
        }

        this.#contacts.splice(index, 1);
    }

    get id(): string {
        return this.#id.value;
    }

    get userId(): string {
        return this.#userId.value;
    }

    get name(): string {
        return this.#name.value;
    }

    get profilePhoto() {
        return {
            id: this.#profilePhoto.id,
            storageKey: this.#profilePhoto.storageKey,
            contentType: this.#profilePhoto.contentType,
            size: this.#profilePhoto.size,
        };
    }

    get contactList() {
        return this.#contacts.map(contact => ({
            id: contact.id,
            value: contact.value,
            type: contact.type,
            isPrimary: contact.isPrimary,
        }));
    }
}