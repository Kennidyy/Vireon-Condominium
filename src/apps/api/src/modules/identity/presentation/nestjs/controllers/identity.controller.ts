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
import { GetUserByEmailUseCase } from '../../../application/use-cases/GetUserByEmailUseCase';
import { GetUserByIdUseCase } from '../../../application/use-cases/GetUserByIdUseCase';
import { DeleteUserByIdUseCase } from '../../../application/use-cases/DeleteUserByIdUseCase';
import { UpdateUserUseCase } from '../../../application/use-cases/UpdateUserUseCase';
import { GetAllUsersUseCase } from '../../../application/use-cases/GetAllUsersUseCase';
import { UserResponseDto } from '../dto/UserResponseDto';
import { UserRole } from '../../../domain/enum/UserRole';
import { CreateUserRequest } from '../dto/CreateUserRequest';
import { UpdateUserRequest } from '../dto/UpdateUserRequest';
import { JwtAuthGuard } from '../../../../auth/infrastructure/guards/JwtAuthGuard';
import { RolesGuard } from '../../../../auth/infrastructure/guards/RolesGuard';
import { Roles } from '../../../../auth/infrastructure/decorators/Roles';
@Controller('identity')
export class IdentityController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly deleteUserByIdUseCase: DeleteUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
  ) {}

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getUsers(
    @Query('email') email?: string,
  ): Promise<UserResponseDto | UserResponseDto[]> {
    if (email !== undefined) {
      return await this.getUserByEmailUseCase.execute(email);
    }

    const users = await this.getAllUsersUseCase.execute();

    return users.map((user) => new UserResponseDto(user));
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

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  me(@Request() req: { user: { id: string; role: string } }) {
    return req.user;
  }
}
