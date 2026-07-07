import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdoptionApplicationService } from './adoption_application.service';
import { CreateAdoptionApplicationDto } from './dto/create-adoption_application.dto';
import { UpdateAdoptionApplicationDto } from './dto/update-adoption_application.dto';

@Controller('adoption-application')
export class AdoptionApplicationController {
  constructor(private readonly adoptionApplicationService: AdoptionApplicationService) {}

  @Post()
  create(@Body() createAdoptionApplicationDto: CreateAdoptionApplicationDto) {
    return this.adoptionApplicationService.create(createAdoptionApplicationDto);
  }

  @Get()
  findAll() {
    return this.adoptionApplicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adoptionApplicationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdoptionApplicationDto: UpdateAdoptionApplicationDto) {
    return this.adoptionApplicationService.update(+id, updateAdoptionApplicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adoptionApplicationService.remove(+id);
  }
}
