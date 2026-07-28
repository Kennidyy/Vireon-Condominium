export class Phone {

    static readonly BRAZIL_MOBILE_REGEX = /^\+55\d{2}9\d{8}$/; 

    #value: string

    private constructor(value: string) {
        this.#value = value
    }

    public static create(raw: string): Phone {
        const phone = Phone.normalize(raw)

        Phone.validate(phone)

        return new Phone(phone)
    }

    private static normalize(raw: string): string {
        return raw.trim()
    }

    private static validate(value: string): void {
        if(!value) {
            throw new Error('Phone number is required')
        }

        if(!this.BRAZIL_MOBILE_REGEX.test(value)) {
            throw new Error("Invalid phone format")
        }
    }

    get value(): string {
        return this.#value
    }

    equals(other: Phone): boolean {
        return this.#value === other.value
    }
}