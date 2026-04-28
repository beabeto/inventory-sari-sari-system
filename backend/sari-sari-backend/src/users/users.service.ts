import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async findOne(username: string) {
  return this.repo.findOne({
    where: { username },
  });
}

  /* ================= PROFILE ================= */
  async getMe(userId: number) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    return {
      id: user.id,
      username: user.username,
      role: user.role,
      profileImage: user.profileImage ?? null,
    };
  }

  async updateProfile(
    userId: number,
    username: string,
    profileImage?: string | null,
  ) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.username = username;

    if (profileImage !== undefined) {
      const trimmed = typeof profileImage === 'string' ? profileImage.trim() : '';
      user.profileImage = trimmed || null;
    }

    await this.repo.save(user);

    return { message: 'Profile updated successfully' };
  }

  /* ================= PASSWORD ================= */
  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) throw new UnauthorizedException('Wrong current password');

    user.password = await bcrypt.hash(newPassword, 10);
    await this.repo.save(user);

    return { message: 'Password changed successfully' };
  }

  /* OPTIONAL CREATE (fixes your seed issue) */
  async create(username: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);

    const user = this.repo.create({
      username,
      password: hashed,
      role: 'admin',
      profileImage: null,
    });

    return this.repo.save(user);
  }
}
