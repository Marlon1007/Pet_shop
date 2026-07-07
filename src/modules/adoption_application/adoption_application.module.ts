import { Module } from '@nestjs/common';
import { AdoptionApplicationService } from './adoption_application.service';
import { AdoptionApplicationController } from './adoption_application.controller';

@Module({
  controllers: [AdoptionApplicationController],
  providers: [AdoptionApplicationService],
})
export class AdoptionApplicationModule {}
