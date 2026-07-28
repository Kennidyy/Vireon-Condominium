import { Module } from '@nestjs/common';
import { FakeResidentRepository } from '../../infrastructure/repositories/mock/FakeResidenteRepository';
import { CreateResidentUseCase } from '../../application/use-cases/CreateResidentUseCase';

@Module({
    providers: [
        FakeResidentRepository,
        CreateResidentUseCase,

        {
            provide: 'ResidentRepository',
            useClass: FakeResidentRepository
        },
    ]
})
export class ResidentModule {
    
}
