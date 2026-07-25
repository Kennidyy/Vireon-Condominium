import { Inject, Injectable } from "@nestjs/common";
import type { UserRepository } from "../ports/UserRepository";

@Injectable()
export class GetUserByIdUseCase {
    constructor(
        @Inject('UserRepository')
        private readonly userRepository: UserRepository
    ) {}


    async execute(id: string) {
        const user = await this.userRepository.getById(id)

        if(!user) {
            throw new Error("User not found")
        }

        return {
            id: user.id,
            email: user.email.value
        }
    }

    
}