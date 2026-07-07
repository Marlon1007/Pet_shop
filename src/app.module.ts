import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { BreedModule } from './modules/breed/breed.module';
import { PersonModule } from './modules/person/person.module';
import { PetModule } from './modules/pet/pet.module';
import { RoleModule } from './modules/role/role.module';
import { ApplicantModule } from './modules/applicant/applicant.module';
import { AdoptionApplicationModule } from './modules/adoption_application/adoption_application.module';

@Module({
  imports: [AuthModule, UsersModule, DatabaseModule, ConfigModule, BreedModule, PersonModule, PetModule, RoleModule, ApplicantModule, AdoptionApplicationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
