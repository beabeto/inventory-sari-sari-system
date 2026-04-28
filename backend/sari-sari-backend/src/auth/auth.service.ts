import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /** Login user safely */
  async login(username: string, password: string) {
    const user = await this.usersService.findOne(username);

    if (!user) throw new UnauthorizedException('Invalid username or password');

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) throw new UnauthorizedException('Invalid username or password');

    const payload = { username: user.username, sub: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(username: string, password: string) {
    const existing = await this.usersService.findOne(username);

    if (existing) {
      throw new ConflictException('Username already exists');
    }

    const user = await this.usersService.create(username, password);

    return {
      message: 'Registration successful',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }
}
