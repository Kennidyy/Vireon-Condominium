import { PersonName } from "../value-objects/PersonName";
import { ResidentId } from "../value-objects/ResidentId";
import { Contact } from "./Contact";
import { ProfilePhoto } from "./ProfilePhoto";

export class Resident {

    private static readonly MAX_CONTACTS = 10
    
    #userId: string
    #id: ResidentId
    #name: PersonName
    //#profilePhoto: ProfilePhoto
    #contacts: Contact[] = []

    private constructor(
        userId: string, //TODO: change this
        name: PersonName,
    ) {
        this.#userId = userId
        this.#id = ResidentId.generate()
        this.#name = name
    }

    public static create(
        userId: string, //TODO: change this
        name: PersonName
    ): Resident {
        return new Resident(
            userId,
            name
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

    get userId() {
        return this.#userId
    }

    get id() {
        return this.#id.value
    }

    get name() {
        return this.#name.value
    }

    /*
    get profilePhoto() {
        return this.#profilePhoto.storageKey
    }
    */
    contactList() {
    return this.#contacts.map(contact => ({
        id: contact.id,
        value: contact.value,
        type: contact.type,
        isPrimary: contact.isPrimary,
    }));
}
}