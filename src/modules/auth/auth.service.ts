import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService, 
    private readonly jwtService: JwtService     
  ) {}

  async register(dto: RegisterAuthDto) {
    return await this.usersService.create(dto);
  }

  async login(credentials: LoginAuthDto) {
    const users = await this.usersService.findAll();
    const user = users.find(u => u.mail === credentials.email);

    if (!user || user.password !== credentials.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, name: user.name, email: user.mail };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}