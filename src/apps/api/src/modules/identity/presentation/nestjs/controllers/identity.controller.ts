import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateUserUseCase } from '../../../application/use-cases/CreateUserUseCase';
import type { CreateUserDto } from '../../../application/dto/CreateUserDto';
import { GetUserByEmailUseCase } from '../../../application/use-cases/GetUserByEmailUseCase';

@Controller('identity')
export class IdentityController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
  ) {}

  @Get('users')
  async getByEmail(@Query('email') email: string) {
    return await this.getUserByEmailUseCase.execute(email);
  }

  @Post('users')
  async create(@Body() dto: CreateUserDto) {
    return await this.createUserUseCase.execute(dto);
  }
}
