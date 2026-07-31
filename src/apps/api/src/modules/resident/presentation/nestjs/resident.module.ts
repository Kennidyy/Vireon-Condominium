import { Module } from '@nestjs/common';
import { CreateResidentUseCase } from '../../application/use-cases/CreateResidentUseCase';
import { ResidentController } from './controllers/resident.controller';
import { GetAllResidentsUseCase } from '../../application/use-cases/GetAllResidentsUseCase';
import { UpdateResidentUseCase } from '../../application/use-cases/UpdateResidentNameUseCase';
import { PrismaResidentRepository } from '../../infrastructure/repositories/PrismaResidentRepository';
import { PrismaModule } from '../../../../infrastructure/database/prisma/prisma.module';
import { GetByNameUseCase } from '../../application/use-cases/GetByNameUseCase';
import { DeleteResidentUseCase } from '../../application/use-cases/DeleteResidentUseCase';
import { GetResidentByIdUseCase } from '../../application/use-cases/GetResidentByIdUseCase';
import { UpdateProfilePhotoUseCase } from '../../application/use-cases/UpdateProfilePhotoUseCase';
import { AddContactUseCase } from '../../application/use-cases/AddContactUseCase';
import { UpdateContactValueUseCase } from '../../application/use-cases/UpdateContactValueUseCase';
import { SetPrimaryContactUseCase } from '../../application/use-cases/SetPrimaryContactUseCase';
import { RemoveContactUseCase } from '../../application/use-cases/RemoveContactUseCase';

@Module({
    imports: [
        PrismaModule
    ],
    controllers: [ResidentController],
    providers: [
        DeleteResidentUseCase,
        GetByNameUseCase,
        CreateResidentUseCase,
        GetAllResidentsUseCase,
        UpdateResidentUseCase,
        GetResidentByIdUseCase,
        UpdateProfilePhotoUseCase,
        AddContactUseCase,
        UpdateContactValueUseCase,
        SetPrimaryContactUseCase,
        RemoveContactUseCase,

        {
            provide: 'ResidentRepository',
            useClass: PrismaResidentRepository
        },
    ]
})
export class ResidentModule {
    
}
