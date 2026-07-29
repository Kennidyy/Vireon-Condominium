import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { CreateResidentUseCase } from '../../../application/use-cases/CreateResidentUseCase';
import { CreateResidentRequest } from '../dto/CreateResidentRequest';
import { GetAllResidentsUseCase } from '../../../application/use-cases/GetAllResidentsUseCase';
import { UpdateResidentCommand } from '../../../application/command/UpdateResidentNameCommand';
import { UpdateResidentRequest } from '../dto/UpdateResidentRequest';
import { UpdateResidentUseCase } from '../../../application/use-cases/UpdateResidentNameUseCase';
import { CreateResidentCommand } from '../../../application/command/CreateResidentCommand';
import { ContactResponseDto, ResidentResponseDto } from '../dto/ResidentResponseDto';

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
        const residents = this.getAllResidentsUseCase.execute()

        //TODO: Create a response mapper
        return (await residents).map(resident => 
            new ResidentResponseDto(
                resident.userId,
                resident.id,
                resident.name,
                resident.profilePhoto.storageKey,
                resident.contactList.map(contact => 
                    new ContactResponseDto(
                        contact.id,
                        contact.type,
                        contact.value,
                        contact.isPrimary
                    )
                )
            )
        )
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
