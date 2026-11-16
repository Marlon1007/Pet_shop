import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterAuthDto) {
    const password = await hash(dto.password, 12);

    return await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password,
    });
  }

  async login(credentials: LoginAuthDto) {
    const users = await this.usersService.findAll();
    const user = users.find((u) => u.email === credentials.email);

    if (
      !user ||
      user.name !== credentials.name ||
      !(await compare(credentials.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, name: user.name, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
