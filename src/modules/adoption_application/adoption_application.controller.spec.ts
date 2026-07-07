import { Test, TestingModule } from '@nestjs/testing';
import { AdoptionApplicationController } from './adoption_application.controller';
import { AdoptionApplicationService } from './adoption_application.service';

describe('AdoptionApplicationController', () => {
  let controller: AdoptionApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdoptionApplicationController],
      providers: [AdoptionApplicationService],
    }).compile();

    controller = module.get<AdoptionApplicationController>(AdoptionApplicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
