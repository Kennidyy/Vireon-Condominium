import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CreateResidentUseCase } from '../../../application/use-cases/CreateResidentUseCase';
import { CreateResidentRequest } from '../dto/CreateResidentRequest';
import { GetAllResidentsUseCase } from '../../../application/use-cases/GetAllResidentsUseCase';
import { UpdateResidentCommand } from '../../../application/command/UpdateResidentNameCommand';
import { UpdateResidentRequest } from '../dto/UpdateResidentRequest';
import { UpdateResidentUseCase } from '../../../application/use-cases/UpdateResidentNameUseCase';
import { CreateResidentCommand } from '../../../application/command/CreateResidentCommand';
import { ContactResponseDto, ResidentResponseDto } from '../dto/ResidentResponseDto';
import { JwtAuthGuard } from '../../../../auth/infrastructure/guards/JwtAuthGuard';
import { Roles } from '../../../../auth/infrastructure/decorators/Roles';
import { UserRole } from '../../../../auth/domain/enum/UserRole';
import { RolesGuard } from '../../../../auth/infrastructure/guards/RolesGuard';
import type { AuthenticatedRequest } from '../dto/AuthenticatedRequest';
import { GetByNameUseCase } from '../../../application/use-cases/GetByNameUseCase';
import { DeleteResidentUseCase } from '../../../application/use-cases/DeleteResidentUseCase';
import { DeleteResidentCommand } from '../../../application/command/DeleteResidentCommand';
import { GetResidentByIdUseCase } from '../../../application/use-cases/GetResidentByIdUseCase';
import { UpdateProfilePhotoUseCase } from '../../../application/use-cases/UpdateProfilePhotoUseCase';
import { UpdateProfilePhotoCommand } from '../../../application/command/UpdateProfilePhotoCommand';
import { UpdateProfilePhotoRequest } from '../dto/UpdateProfilePhotoRequest';
import { AddContactUseCase } from '../../../application/use-cases/AddContactUseCase';
import { AddContactCommand } from '../../../application/command/AddContactCommand';
import { AddContactRequest } from '../dto/AddContactRequest';
import { UpdateContactValueUseCase } from '../../../application/use-cases/UpdateContactValueUseCase';
import { UpdateContactValueCommand } from '../../../application/command/UpdateContactValueCommand';
import { UpdateContactValueRequest } from '../dto/UpdateContactValueRequest';
import { SetPrimaryContactUseCase } from '../../../application/use-cases/SetPrimaryContactUseCase';
import { SetPrimaryContactCommand } from '../../../application/command/SetPrimaryContactCommand';
import { RemoveContactUseCase } from '../../../application/use-cases/RemoveContactUseCase';
import { RemoveContactCommand } from '../../../application/command/RemoveContactCommand';

@Controller('residents')
export class ResidentController {

    constructor(
        private readonly createResidentUseCase: CreateResidentUseCase,
        private readonly getResidentByName: GetByNameUseCase,
        private readonly getAllResidentsUseCase: GetAllResidentsUseCase,
        private readonly updateResidentUseCase: UpdateResidentUseCase,
        private readonly deleteResidentUseCase: DeleteResidentUseCase,
        private readonly getResidentByIdUseCase: GetResidentByIdUseCase,
        private readonly updateProfilePhotoUseCase: UpdateProfilePhotoUseCase,
        private readonly addContactUseCase: AddContactUseCase,
        private readonly updateContactValueUseCase: UpdateContactValueUseCase,
        private readonly setPrimaryContactUseCase: SetPrimaryContactUseCase,
        private readonly removeContactUseCase: RemoveContactUseCase
    ) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.USER, UserRole.ADMIN)
    async create(
        @Req() req: AuthenticatedRequest,
        @Body() dto: CreateResidentRequest
    ) {
        const command = new CreateResidentCommand(
            req.user.id,
            dto.name
        )

         this.createResidentUseCase.execute(command);
    }

    
    @Patch()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.USER, UserRole.ADMIN)
    async update(
        @Req() req: AuthenticatedRequest,
        @Body() request: UpdateResidentRequest
    ) {

        const id = req.user.id

        const command = new UpdateResidentCommand(
            id,
            request.name
        )
         await this.updateResidentUseCase.execute(command)
    }


    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async delete(
        @Param('id') id: string
     ) {
        const command = new DeleteResidentCommand(
            id
        )

        await this.deleteResidentUseCase.execute(command)
    }

    
    @Get()
    async getByName(
        @Query("name") name: string,
    ) {
        const residents = await this.getResidentByName.execute(name);

        return residents.map(resident =>
            new ResidentResponseDto(
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

    @Get('all')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async getAll(){
        const residents = this.getAllResidentsUseCase.execute()

        //TODO: Create a response mapper
        return (await residents).map(resident => 
            new ResidentResponseDto(
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

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async getById(
        @Param('id') id: string
    ) {
        return this.getResidentByIdUseCase.execute(id)
    }

    @Patch(':id/photo')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    async updatePhoto(
        @Param('id') id: string,
        @Body() dto: UpdateProfilePhotoRequest
    ) {
        const command = new UpdateProfilePhotoCommand(
            id,
            dto.storageKey,
            dto.contentType,
            dto.size
        )

        return this.updateProfilePhotoUseCase.execute(command)
    }

    @Post(':id/contacts')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.USER, UserRole.ADMIN)
    async addContact(
        @Param('id') id: string,
        @Body() dto: AddContactRequest
    ) {
        const command = new AddContactCommand(
            id,
            dto.type,
            dto.value
        )

        return this.addContactUseCase.execute(command)
    }

    @Patch(':id/contacts/:contactId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.USER, UserRole.ADMIN)
    async updateContactValue(
        @Param('id') id: string,
        @Param('contactId') contactId: string,
        @Body() dto: UpdateContactValueRequest
    ) {
        const command = new UpdateContactValueCommand(
            id,
            contactId,
            dto.value
        )

        return this.updateContactValueUseCase.execute(command)
    }

    @Patch(':id/contacts/:contactId/primary')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.USER, UserRole.ADMIN)
    async setPrimaryContact(
        @Param('id') id: string,
        @Param('contactId') contactId: string
    ) {
        const command = new SetPrimaryContactCommand(
            id,
            contactId
        )

        return this.setPrimaryContactUseCase.execute(command)
    }

    @Delete(':id/contacts/:contactId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.USER, UserRole.ADMIN)
    async removeContact(
        @Param('id') id: string,
        @Param('contactId') contactId: string
    ) {
        const command = new RemoveContactCommand(
            id,
            contactId
        )

        return this.removeContactUseCase.execute(command)
    }

}
