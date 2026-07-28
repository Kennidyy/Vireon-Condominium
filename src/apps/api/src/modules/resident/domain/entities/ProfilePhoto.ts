import { ProfilePhotoId } from "../value-objects/ProfilePhotoId";

export class ProfilePhoto {

    readonly #id: ProfilePhotoId
    readonly #storageKey: string
    #contentType: string
    #size: number

    private constructor(
        storageKey: string,
        contentType: string,
        size: number
    ) {
        this.#id = ProfilePhotoId.generate()
        this.#storageKey = storageKey
        this.#contentType = contentType
        this.#size = size
    }

    public static create(
        storageKey: string,
        contentType: string,
        size: number
    ): ProfilePhoto {
        
        if(contentType !== 'PNG') {
            throw new Error('Image must be of type PNG')
        }

        if(size > 5.00 || size < 0.01) {
            throw new Error('Invalid image Size Max: 5.0Mb')
        }

        if(!storageKey) {
            throw new Error('Storage key is mandatory')
        }

        return new ProfilePhoto(
            storageKey,
            contentType,
            size
        )
    }

    get id(): string {
        return this.#id.value
    }

    get storageKey(): string {
        return this.#storageKey
    }

    get contentType(): string {
        return this.#contentType
    }

    get size(): number {
        return this.#size
    }


    // I gotta learn how an image bucket works before finish this entity
}