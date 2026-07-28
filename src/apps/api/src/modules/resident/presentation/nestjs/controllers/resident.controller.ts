import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { CreateResidentUseCase } from '../../../application/use-cases/CreateResidentUseCase';
import { CreateResidentRequest } from '../dto/CreateResidentRequest';
import { CreateResidentCommand } from '../../../application/command/CreateResidentCommand';
import { FakeResidentRepository } from '../../../infrastructure/repositories/mock/FakeResidenteRepository';
import { GetAllResidentsUseCase } from '../../../application/use-cases/GetAllResidentsUseCase';

@Controller('residents')
export class ResidentController {

    constructor(
        private readonly createResidentUseCase: CreateResidentUseCase,
        private readonly getAllResidentsUseCase: GetAllResidentsUseCase
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

}
