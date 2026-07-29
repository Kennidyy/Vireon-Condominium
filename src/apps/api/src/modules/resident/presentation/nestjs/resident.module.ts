import { Module } from '@nestjs/common';
import { CreateResidentUseCase } from '../../application/use-cases/CreateResidentUseCase';
import { ResidentController } from './controllers/resident.controller';
import { GetAllResidentsUseCase } from '../../application/use-cases/GetAllResidentsUseCase';
import { UpdateResidentUseCase } from '../../application/use-cases/UpdateResidentNameUseCase';
import { PrismaResidentRepository } from '../../infrastructure/repositories/PrismaResidentRepository';
import { PrismaModule } from '../../../../infrastructure/database/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ResidentController],
    providers: [
        CreateResidentUseCase,
        GetAllResidentsUseCase,
        UpdateResidentUseCase,

        {
            provide: 'ResidentRepository',
            useClass: PrismaResidentRepository
        },
    ]
})
export class ResidentModule {
    
}
