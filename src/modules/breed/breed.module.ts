import { Module } from '@nestjs/common';
import { BreedService } from './breed.service';
import { BreedController } from './breed.controller';
import { breedProviders } from './breed.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BreedController],
  providers: [BreedService, ...breedProviders],
})
export class BreedModule {}
