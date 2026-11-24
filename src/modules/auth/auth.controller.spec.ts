import { DynamicModule, INestApplication, ValidationPipe } from '@nestjs/common';
import { MODULE_METADATA } from '@nestjs/common/constants';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { hash } from 'bcrypt';
import request from 'supertest';
import { UsersService } from '../users/users.service';
import { PetController } from '../pet/pet.controller';
import { PetService } from '../pet/pet.service';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

describe('Authentication HTTP flow', () => {
  let app: INestApplication;
  let jwt: JwtService;

  beforeAll(async () => {
    const password = await hash('Password123', 4);
    const imports = Reflect.getMetadata(MODULE_METADATA.IMPORTS, AuthModule) as DynamicModule[];
    const jwtModule = imports.find(module => module.module === JwtModule)!;
    const module = await Test.createTestingModule({
      imports: [jwtModule],
      controllers: [AuthController, PetController],
      providers: [
        AuthService,
        JwtStrategy,
        { provide: UsersService, useValue: {
          findAll: async () => [{ id: 1, name: 'Adopter', email: 'adopter@example.com', password }],
        } },
        { provide: PetService, useValue: { findAll: async () => [] } },
      ],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    jwt = module.get(JwtService);
  });

  afterAll(async () => { await app.close(); });

  it('logs in with email and password and authorizes a protected request for eight hours', async () => {
    const response = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'adopter@example.com', password: 'Password123',
    }).expect(201);
    const claims = jwt.verify<{ id: number; email: string; exp: number; iat: number }>(response.body.access_token);
    expect(claims.email).toBe('adopter@example.com');
    expect(claims.exp - claims.iat).toBe(28800);
    await request(app.getHttpServer()).get('/pet')
      .set('Authorization', `Bearer ${response.body.access_token}`).expect(200);
  });

  it('rejects an incorrect password', async () => {
    await request(app.getHttpServer()).post('/auth/login').send({
      email: 'adopter@example.com', password: 'WrongPassword',
    }).expect(401);
  });

  it('rejects malformed login data', async () => {
    await request(app.getHttpServer()).post('/auth/login').send({ email: 'invalid' }).expect(400);
  });

  it('rejects an expired token', async () => {
    const token = jwt.sign({ id: 1, email: 'adopter@example.com' }, { expiresIn: -1 });
    await request(app.getHttpServer()).get('/pet').set('Authorization', `Bearer ${token}`).expect(401);
  });
});
