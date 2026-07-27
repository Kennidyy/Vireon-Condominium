import {
  Request,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
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
import { JwtAuthGuard } from '../../../infrastructure/auth/JwtAuthGuard';
import { RolesGuard } from '../../../infrastructure/auth/RolesGuard';
import { UserRole } from '../../../domain/enum/UserRole';
import { Roles } from '../../../infrastructure/auth/Roles';
import { CreateUserRequest } from '../dto/CreateUserRequest';
import { LoginRequest } from '../dto/LoginRequest';
import { UpdateUserRequest } from '../dto/UpdateUserRequest';

@Controller('identity')
export class IdentityController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly deleteUserByIdUseCase: DeleteUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}


  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getByEmail(@Query('email') email: string) {
    return await this.getUserByEmailUseCase.execute(email);
  }

  @Get('users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getById(@Param('id') id: string) {
    return await this.getUserByIdUseCase.execute(id);
  }

  @Post('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateUserRequest) {
    return await this.createUserUseCase.execute(dto);
  }

  @Delete('users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteById(@Param('id') id: string) {
    return await this.deleteUserByIdUseCase.execute(id);
  }

  @Patch('users/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateUserRequest) {
    return await this.updateUserUseCase.execute(id, dto);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAll() {
    const users = await this.getAllUsersUseCase.execute();

    return users.map((user) => new UserResponseDto(user));
  }

  @Post('/login')
  async login(@Body() dto: LoginRequest) {
    return await this.loginUseCase.execute(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
    me(@Request() req: any) {
        return req.user;
    }
}
