import { BadRequestException, Controller, Get, Post, Body, Param, Delete, Put, Req, UseGuards } from '@nestjs/common';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

@ApiTags('Pet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Post()
  create(@Body() createPetDto: CreatePetDto) {
    return this.petService.create(createPetDto);
  }

  @Get()
  findAll() {
    return this.petService.findAll();
  }

  @Get('back')
  @ApiQuery({ name: 'q', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  async backend(@Req() req: Request) {
    const builder = await this.petService.queryBuilder('pets');
    builder.leftJoinAndSelect('pets.breed', 'breed');

    if (req.query.q !== undefined && typeof req.query.q !== 'string') {
      throw new BadRequestException('q must be a string.');
    }
    if (req.query.q) {
      builder.where('pets.name LIKE :q', { q: `%${req.query.q}%` });
    }

    const sort = req.query.sort;
    if (sort !== undefined) {
      if (typeof sort !== 'string' || !['ASC', 'DESC'].includes(sort.toUpperCase())) {
        throw new BadRequestException('sort must be asc or desc.');
      }
      builder.orderBy('pets.age', sort.toUpperCase() as 'ASC' | 'DESC');
    }

    const pageValue = req.query.page;
    if (pageValue !== undefined && (typeof pageValue !== 'string' || !/^\d+$/.test(pageValue))) {
      throw new BadRequestException('page must be a positive integer.');
    }
    const page = pageValue === undefined ? 1 : parseInt(pageValue as string, 10);
    if (!Number.isSafeInteger(page) || page < 1) {
      throw new BadRequestException('page must be a positive integer.');
    }

    const limit = 2;
    builder.offset((page - 1) * limit).limit(limit);
    const total = await builder.getCount();

    return {
      data: await builder.getMany(),
      total: total,
      page,
      last_page: Math.ceil(total / limit),
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto) {
    return this.petService.update(+id, updatePetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.petService.remove(+id);
  }
}
