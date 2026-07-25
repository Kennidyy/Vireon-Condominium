import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateUserUseCase } from '../../../application/use-cases/CreateUserUseCase';
import type { CreateUserDto } from '../../../application/dto/CreateUserDto';
import { GetUserByEmailUseCase } from '../../../application/use-cases/GetUserByEmailUseCase';
import { GetUserByIdUseCase } from '../../../application/use-cases/GetUserByIdUseCase';

@Controller('identity')
export class IdentityController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase
  ) {}

  @Get('users')
  async getByEmail(@Query('email') email: string) {
    return await this.getUserByEmailUseCase.execute(email);
  }

  @Get('users/:id')
  async getById(@Param("id") id: string) {
    return await this.getUserByIdUseCase.execute(id)
  }

  @Post('users')
  async create(@Body() dto: CreateUserDto) {
    return await this.createUserUseCase.execute(dto);
  }
}
