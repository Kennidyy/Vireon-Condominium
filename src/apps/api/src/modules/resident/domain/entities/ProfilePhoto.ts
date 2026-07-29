import { ImageType } from "../enum/ImageType";
import {Uuid } from "../value-objects/Uuid";

export class ProfilePhoto {

    private static readonly MAX_SIZE = 5 * 1024 * 1024;

    readonly #id: Uuid;
    readonly #storageKey: string;
    readonly #contentType: ImageType;
    readonly #size: number;

    private constructor(
        storageKey: string,
        contentType: ImageType,
        size: number
    ) {
        this.#id = Uuid.generate();
        this.#storageKey = storageKey;
        this.#contentType = contentType;
        this.#size = size;
    }

    public static create(
        storageKey: string,
        contentType: ImageType,
        size: number
    ): ProfilePhoto {

        if (
            contentType !== ImageType.PNG &&
            contentType !== ImageType.JPEG
        ) {
            throw new Error('Invalid image type');
        }

        if (size > ProfilePhoto.MAX_SIZE) {
            throw new Error('Image exceeds max size');
        }

        if (!storageKey) {
            throw new Error('Storage key is mandatory');
        }

        return new ProfilePhoto(
            storageKey,
            contentType,
            size
        );
    }

    static default() {
        return ProfilePhoto.create(
            'defaults/profile.jpg',
            ImageType.JPEG,
            124000
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
}