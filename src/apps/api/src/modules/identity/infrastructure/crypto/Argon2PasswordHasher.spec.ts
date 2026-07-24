import { Argon2PasswordHasher } from "./Argon2PasswordHasher"

describe("Argon2 password hasher", () => {
    it("should hash a password", async () => {
        const passwordHasher = new Argon2PasswordHasher()
        const pswd = "Senha1234@#@"
        const hashedPassword = await passwordHasher.hash(pswd)
        console.log("hashedPassword", hashedPassword)

        expect(hashedPassword).toBeDefined()
        expect(hashedPassword).not.toEqual(pswd)
    })

    it("should compare a password with its hash", async () => {
        const passwordHasher = new Argon2PasswordHasher()
        const pswd = "Senha1234@#@"
        const hashedPassword = await passwordHasher.hash(pswd)

        const isMatch = await passwordHasher.compare(pswd, hashedPassword)

        console.log("isMatch", isMatch)
        expect(isMatch).toBe(true)
    })
})