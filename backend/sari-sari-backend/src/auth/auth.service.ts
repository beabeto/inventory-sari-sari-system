import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    console.log('User from DB:', user);

    if (!user) throw new UnauthorizedException('Invalid username or password');

    const isValid = await bcrypt.compare(password, user.password);
    console.log('Password valid?', isValid);

    if (!isValid) throw new UnauthorizedException('Invalid username or password');

    const payload = { username: user.username, sub: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}