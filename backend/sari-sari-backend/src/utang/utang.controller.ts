import { Controller, Get, Post, Delete, Param, Body, Put, Patch, UseGuards, Req } from '@nestjs/common';
import { UtangService } from './utang.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('utang')
export class UtangController {
  constructor(private readonly utangService: UtangService) {}

  @Get()
  findAll(@Req() req: any) {
    return this.utangService.findAll(req.user.userId);
  }

  @Post()
  create(@Req() req: any, @Body() body: any) {
    return this.utangService.create(req.user.userId, body);
  }

  // ✅ EDIT UTANG
  @Put(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.utangService.update(req.user.userId, +id, body);
  }

  // ✅ TOGGLE PAID / UNPAID
  @Patch(':id/toggle')
  togglePaid(@Req() req: any, @Param('id') id: string) {
    return this.utangService.togglePaid(req.user.userId, +id);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.utangService.remove(req.user.userId, +id);
  }
}