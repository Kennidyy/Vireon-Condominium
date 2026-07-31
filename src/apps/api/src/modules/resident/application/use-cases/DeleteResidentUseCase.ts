import { Inject, Injectable } from '@nestjs/common';
import type { ResidentRepository } from '../ports/ResidentRespository';
import { DeleteResidentCommand } from '../command/DeleteResidentCommand';

@Injectable()
export class DeleteResidentUseCase {
  constructor(
    @Inject('ResidentRepository')
    private readonly residentRepository: ResidentRepository,
  ) {}

  async execute(command: DeleteResidentCommand) {
    return await this.residentRepository.delete(command.id);
  }
}
