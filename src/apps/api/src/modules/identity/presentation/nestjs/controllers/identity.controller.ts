import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserUseCase } from '../../../application/use-cases/CreateUserUseCase';
import type { CreateUserDto } from '../../../application/dto/CreateUserDto';

@Controller('identity')
export class IdentityController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post('users')
  async create(@Body() dto: CreateUserDto) {
    return await this.createUserUseCase.execute(dto);
  }
}
