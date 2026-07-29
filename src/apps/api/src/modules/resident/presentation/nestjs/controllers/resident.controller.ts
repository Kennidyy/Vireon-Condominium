import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { CreateResidentUseCase } from '../../../application/use-cases/CreateResidentUseCase';
import { CreateResidentRequest } from '../dto/CreateResidentRequest';
import { GetAllResidentsUseCase } from '../../../application/use-cases/GetAllResidentsUseCase';
import { UpdateResidentCommand } from '../../../application/command/UpdateResidentNameCommand';
import { UpdateResidentRequest } from '../dto/UpdateResidentRequest';
import { UpdateResidentUseCase } from '../../../application/use-cases/UpdateResidentNameUseCase';
import { ProfilePhoto } from '../../../domain/entities/ProfilePhoto';
import { ImageType } from '../../../domain/enum/ImageType';
import { CreateResidentCommand } from '../../../application/command/CreateResidentCommand';

@Controller('residents')
export class ResidentController {

    constructor(
        private readonly createResidentUseCase: CreateResidentUseCase,
        private readonly getAllResidentsUseCase: GetAllResidentsUseCase,
        private readonly updateResidentUseCase: UpdateResidentUseCase
    ) {}

    @Post(':id')
    async create(
        @Param('id') id: string,
        @Body() dto: CreateResidentRequest
    ) {
        const command = new CreateResidentCommand(
            id,
            dto.name
        )

        return this.createResidentUseCase.execute(command);
    }

    @Get() 
    async getAll(){
        return this.getAllResidentsUseCase.execute()
    }

    @Patch('name/:id')
    async update(
        @Param('id') id: string,
        @Body() request: UpdateResidentRequest
    ) {

        const command = new UpdateResidentCommand(
            request.name
        )
        await this.updateResidentUseCase.execute(id, command)
    }

}
