import { Inject, Injectable } from "@nestjs/common";
import type { UserRepository } from "../ports/UserRepository";

@Injectable()
export class DeleteUserByIdUseCase {
    constructor(
        @Inject("UserRepository")
        private readonly userRepository: UserRepository
    ) {}

    async execute(id: string) {
        await this.userRepository.deleteById(id)
    }
}