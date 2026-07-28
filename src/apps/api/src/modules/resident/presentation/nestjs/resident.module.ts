import { Module } from '@nestjs/common';
import { FakeResidentRepository } from '../../infrastructure/repositories/mock/FakeResidenteRepository';
import { CreateResidentUseCase } from '../../application/use-cases/CreateResidentUseCase';
import { ResidentController } from './controllers/resident.controller';
import { GetAllResidentsUseCase } from '../../application/use-cases/GetAllResidentsUseCase';

@Module({
    controllers: [ResidentController],
    providers: [
        FakeResidentRepository,
        CreateResidentUseCase,
        GetAllResidentsUseCase,

        {
            provide: 'ResidentRepository',
            useClass: FakeResidentRepository
        },
    ]
})
export class ResidentModule {
    
}
