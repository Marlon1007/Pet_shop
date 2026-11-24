import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

describe('AuthService', () => {
  let service: AuthService;
  let users: User[];
  let jwtService: JwtService;
  const credentials = {
    name: 'Adopter',
    email: 'adopter@example.com',
    password: 'Password123',
  };

  beforeEach(() => {
    users = [];
    const repository = {
      create: (data: Partial<User>) => Object.assign(new User(), data),
      save: (user: User) => {
        user.id = users.length + 1;
        users.push(user);
        return Promise.resolve(user);
      },
      find: () => Promise.resolve(users),
    } as Repository<User>;
    jwtService = new JwtService({ secret: 'test-only-signing-key' });
    service = new AuthService(new UsersService(repository), jwtService);
  });

  it('stores the registration email in the user email field', async () => {
    await service.register(credentials);

    expect(users[0].email).toBe('adopter@example.com');
  });

  it('stores a password hash that verifies the original password', async () => {
    await service.register(credentials);

    expect(users[0].password).not.toBe(credentials.password);
    expect(await compare(credentials.password, users[0].password)).toBe(true);
  });

  it('authenticates a registered user and returns their identity in the JWT', async () => {
    await service.register(credentials);

    const result = await service.login(credentials);

    expect(
      jwtService.verify<Record<string, unknown>>(result.access_token),
    ).toEqual(
      expect.objectContaining({
        id: 1,
        name: 'Adopter',
        email: 'adopter@example.com',
      }),
    );
  });

  it('rejects an incorrect password', async () => {
    await service.register(credentials);

    await expect(
      service.login({ ...credentials, password: 'WrongPassword' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects an unknown email', async () => {
    await expect(service.login(credentials)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('authenticates with email and password without a name', async () => {
    await service.register(credentials);
    const result = await service.login({ email: credentials.email, password: credentials.password });
    expect(jwtService.verify<Record<string, unknown>>(result.access_token).email).toBe(credentials.email);
  });

  it('validates login credentials without requiring a name', async () => {
    const input = plainToInstance(LoginAuthDto, { email: credentials.email, password: credentials.password });
    expect(await validate(input)).toEqual([]);
  });

  it.each([undefined, '', 123])('requires a valid name when registering: %s', async (name) => {
    const errors = await validate(plainToInstance(RegisterAuthDto, { ...credentials, name }));
    expect(errors.some(error => error.property === 'name')).toBe(true);
  });

  it.each(['email', 'password'])(
    'requires %s when registering',
    async (field) => {
      const input: Record<string, string> = { ...credentials };
      delete input[field];

      const errors = await validate(plainToInstance(RegisterAuthDto, input));

      expect(errors.some((error) => error.property === field)).toBe(true);
    },
  );
});
