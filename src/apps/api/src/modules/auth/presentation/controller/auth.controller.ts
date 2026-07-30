import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserUseCase } from '../../application/use-cases/LoginUserUseCase';
import { AuthUserRequestDto } from '../dto/AuthUserRequestDto';
import { LoginUserCommand } from '../../application/command/LoginUserCommand';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly loginUserUseCase: LoginUserUseCase
    ) {}

    @Post('login')
    async login(@Body() dto: AuthUserRequestDto) {
        const command = new LoginUserCommand(
            dto.email,
            dto.password
        )

        return await this.loginUserUseCase.execute(command)

    }

}
