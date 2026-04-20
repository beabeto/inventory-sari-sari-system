import {
  Controller,
  Get,
  Put,
  Body,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getMe(@Req() req: any) {
    return this.usersService.getMe(req.user.userId);
  }

  @Put('update-profile')
  updateProfile(@Req() req: any, @Body() body: any) {
    if (!body.username) {
      throw new BadRequestException('Username required');
    }

    return this.usersService.updateProfile(
      req.user.userId,
      body.username,
    );
  }

  @Put('change-password')
  changePassword(@Req() req: any, @Body() body: any) {
    if (!body.currentPassword || !body.newPassword) {
      throw new BadRequestException('Missing fields');
    }

    return this.usersService.changePassword(
      req.user.userId,
      body.currentPassword,
      body.newPassword,
    );
  }
}