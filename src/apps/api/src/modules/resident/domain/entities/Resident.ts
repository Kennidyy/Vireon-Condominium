import { PersonName } from "../value-objects/PersonName";
import { ResidentId } from "../value-objects/ResidentId";
import { Contact } from "./Contact";
import { ProfilePhoto } from "./ProfilePhoto";

export class Resident {

    private static readonly MAX_CONTACTS = 10
    
    #id: ResidentId
    #name: PersonName
    #profilePhoto: ProfilePhoto
    #contacts: Contact[] = []
    //#userId: string  // this is the id for user identity table

    private constructor(
        name: PersonName,
        profilePhoto: ProfilePhoto,
    ) {
        this.#id = ResidentId.generate()
        this.#name = name
        this.#profilePhoto = profilePhoto
    }

    public static create(
        name: PersonName,
        profilePhoto: ProfilePhoto,
    ): Resident {
        return new Resident(
            name,
            profilePhoto
        )
    }

    public addContact(newContact: Contact): void {
        if(this.#contacts.length > Resident.MAX_CONTACTS) {
            throw new Error('Resident cannot have more than 10 contacts')
        }

        this.#contacts.push(newContact)
    }

    public changeContact(
        newContact: Contact,
        oldContact: Contact
    ): void {
        oldContact.changeValue(newContact.value)
    }

    public removeContact(
        contact: Contact
    ) {

        return this.#contacts.indexOf(contact)
        
    }

    get id() {
        return this.#id.value
    }

    get name() {
        return this.#name.value
    }

    get profilePhoto() {
        return this.#profilePhoto.storageKey
    }

    contactList() {
    return this.#contacts.map(contact => ({
        id: contact.id,
        value: contact.value,
        type: contact.type,
        isPrimary: contact.isPrimary,
    }));
}
}