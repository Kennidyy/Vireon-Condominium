import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserUseCase } from '../../../application/use-cases/CreateUserUseCase';
import type { CreateUserDto } from '../../../application/dto/CreateUserDto';
import { GetUserByEmailUseCase } from '../../../application/use-cases/GetUserByEmailUseCase';
import { GetUserByIdUseCase } from '../../../application/use-cases/GetUserByIdUseCase';
import { DeleteUserByIdUseCase } from '../../../application/use-cases/DeleteUserByIdUseCase';
import { UpdateUserUseCase } from '../../../application/use-cases/UpdateUserUseCase';
import type { UpdateUserDto } from '../../../application/dto/UpdateUserDto';
import { GetAllUsersUseCase } from '../../../application/use-cases/GetAllUsersUseCase';
import { UserResponseDto } from '../dto/UserResponseDto';
import { LoginUseCase } from '../../../application/use-cases/LoginUseCase';
import type { LoginDto } from '../../../application/dto/LoginDto';

@Controller('identity')
export class IdentityController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly deleteUserByIdUseCase: DeleteUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly loginUseCase: LoginUseCase
  ) {}

  @Get('users')
  async getByEmail(@Query('email') email: string) {
    return await this.getUserByEmailUseCase.execute(email);
  }

  @Get('users/:id')
  async getById(@Param('id') id: string) {
    return await this.getUserByIdUseCase.execute(id);
  }

  @Post('users')
  async create(@Body() dto: CreateUserDto) {
    return await this.createUserUseCase.execute(dto);
  }

  @Delete('users/:id')
  async deleteById(@Param('id') id: string) {
    return await this.deleteUserByIdUseCase.execute(id);
  }

  @Patch('users/:id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return await this.updateUserUseCase.execute(id, dto);
  }

  @Get('all')
  async getAll() {
    const users = await this.getAllUsersUseCase.execute();

    return users.map((user) => new UserResponseDto(user));
  }

  @Post("/login")
  async login(@Body() dto: LoginDto) {
    await this.loginUseCase.execute(dto)
  }

}
