import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Pet } from './entities/pet.entity';
import { PetController } from './pet.controller';
import { PetService } from './pet.service';

describe('PetController', () => {
  let app: INestApplication;
  const pets = [{ id: 1, name: 'Luna', age: 3, breed: { id: 1, name: 'Siamese' } }];
  const builder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    getCount: jest.fn().mockResolvedValue(5),
    getMany: jest.fn().mockResolvedValue(pets),
  };
  const repository = {
    createQueryBuilder: jest.fn().mockReturnValue(builder),
    find: jest.fn().mockResolvedValue(pets),
    create: jest.fn().mockImplementation((data: object) => data),
    save: jest.fn().mockImplementation(async (data: object) => ({ id: 1, ...data })),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      controllers: [PetController],
      providers: [PetService, { provide: getRepositoryToken(Pet), useValue: repository }],
    }).overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => { await app.close(); });

  it('returns paginated pets and metadata from the back route', async () => {
    const response = await request(app.getHttpServer()).get('/pet/back').expect(200);
    expect(response.body).toEqual({ data: pets, total: 5, page: 1, last_page: 3 });
    expect(builder.offset).toHaveBeenCalledWith(0);
    expect(builder.limit).toHaveBeenCalledWith(2);
    expect(builder.leftJoinAndSelect).toHaveBeenCalledWith('pets.breed', 'breed');
  });

  it.each(['asc', 'desc'])('combines a parameterized name filter, %s age order and page', async (sort) => {
    await request(app.getHttpServer()).get(`/pet/back?q=Lu&sort=${sort}&page=2`).expect(200);
    expect(builder.where).toHaveBeenCalledWith('pets.name LIKE :q', { q: '%Lu%' });
    expect(builder.orderBy).toHaveBeenCalledWith('pets.age', sort.toUpperCase());
    expect(builder.offset).toHaveBeenCalledWith(2);
  });

  it('returns zero pages for an empty result', async () => {
    builder.getCount.mockResolvedValueOnce(0);
    builder.getMany.mockResolvedValueOnce([]);
    const response = await request(app.getHttpServer()).get('/pet/back?q=Missing').expect(200);
    expect(response.body).toEqual({ data: [], total: 0, page: 1, last_page: 0 });
  });

  it.each(['page=-1', 'page=1.5', 'page=abc', 'page=0', 'sort=invalid', 'q=a&q=b'])('rejects malformed query %s', async (query) => {
    await request(app.getHttpServer()).get(`/pet/back?${query}`).expect(400);
  });

  it('keeps the original list response as an array', async () => {
    const response = await request(app.getHttpServer()).get('/pet').expect(200);
    expect(response.body).toEqual(pets);
  });

  it('rejects an empty creation payload', async () => {
    await request(app.getHttpServer()).post('/pet').send({}).expect(400);
  });

  it('accepts a valid pet with optional fields omitted', async () => {
    const response = await request(app.getHttpServer()).post('/pet').send({
      name: 'Luna', breed: 1, age: 3, gender: 'Female',
    }).expect(201);
    expect(response.body.breed).toEqual({ id: 1 });
    expect(response.body.name).toBe('Luna');
  });

  it.each([{ age: '3' }, { breed: '1' }, { status: 'Unknown' }, { gender: 1 }, { age: -1 }])(
    'rejects invalid pet fields %j', async (invalid) => {
      await request(app.getHttpServer()).post('/pet').send({
        name: 'Luna', breed: 1, age: 3, gender: 'Female', ...invalid,
      }).expect(400);
    },
  );
});
