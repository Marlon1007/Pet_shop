import { Module } from '@nestjs/common';
import { AdoptionApplicationService } from './adoption_application.service';
import { AdoptionApplicationController } from './adoption_application.controller';
import { AdoptionApplication } from './entities/adoption_application.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AdoptionApplication])],
  controllers: [AdoptionApplicationController],
  providers: [AdoptionApplicationService],
  exports: [AdoptionApplicationService]
})
export class AdoptionApplicationModule {}
