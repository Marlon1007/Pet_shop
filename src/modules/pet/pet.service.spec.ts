import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';
import { PetService } from './pet.service';

describe('PetService', () => {
  it('saves the numeric breed identifier as an entity reference', async () => {
    const saved = { id: 1, name: 'Luna', breed: { id: 2 }, age: 3, gender: 'Female' };
    const repository = {
      create: jest.fn().mockImplementation((data: object) => data),
      save: jest.fn().mockResolvedValue(saved),
    };
    const module = await Test.createTestingModule({
      providers: [PetService, { provide: getRepositoryToken(Pet), useValue: repository }],
    }).compile();
    const service = module.get(PetService);
    expect(await service.create({ name: 'Luna', breed: 2, age: 3, gender: 'Female' })).toEqual(saved);
    expect(repository.save).toHaveBeenCalledWith({ name: 'Luna', breed: { id: 2 }, age: 3, gender: 'Female' });
  });
});
