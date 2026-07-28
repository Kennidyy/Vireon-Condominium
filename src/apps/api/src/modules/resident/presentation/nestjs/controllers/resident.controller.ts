import { Body, Controller, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { CreateResidentUseCase } from '../../../application/use-cases/CreateResidentUseCase';
import { CreateResidentRequest } from '../dto/CreateResidentRequest';
import { CreateResidentCommand } from '../../../application/command/CreateResidentCommand';
import { FakeResidentRepository } from '../../../infrastructure/repositories/mock/FakeResidenteRepository';
import { GetAllResidentsUseCase } from '../../../application/use-cases/GetAllResidentsUseCase';
import { UpdateUserRequest } from '../../../../identity/presentation/nestjs/dto/UpdateUserRequest';
import { UpdateResidentCommand } from '../../../application/command/UpdateResidentCommand';
import { UpdateResidentRequest } from '../dto/UpdateResidentRequest';
import { UpdateResidentUseCase } from '../../../application/use-cases/UpdateResidentUseCase';

@Controller('residents')
export class ResidentController {

    constructor(
        private readonly createResidentUseCase: CreateResidentUseCase,
        private readonly getAllResidentsUseCase: GetAllResidentsUseCase,
        private readonly updateResidentUseCase: UpdateResidentUseCase
    ) {}

    @Post()
    async create(@Body() request: CreateResidentRequest) {
        const command = new CreateResidentCommand(
            request.userId,
            request.name
        )
        await this.createResidentUseCase.execute(command)
    }

    @Get() 
    async getAll(){
        return this.getAllResidentsUseCase.execute()
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() request: UpdateResidentRequest
    ) {

        const command = new UpdateResidentCommand(
            request.id,
            request.name
        )
        await this.updateResidentUseCase.execute(command)
    }

}
