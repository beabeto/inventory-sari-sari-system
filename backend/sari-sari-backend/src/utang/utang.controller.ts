import { Controller, Get, Post, Delete, Param, Body, Put, Patch } from '@nestjs/common';
import { UtangService } from './utang.service';

@Controller('utang')
export class UtangController {
  constructor(private readonly utangService: UtangService) {}

  @Get()
  findAll() {
    return this.utangService.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.utangService.create(body);
  }

  // ✅ EDIT UTANG
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.utangService.update(+id, body);
  }

  // ✅ TOGGLE PAID / UNPAID
  @Patch(':id/toggle')
  togglePaid(@Param('id') id: string) {
    return this.utangService.togglePaid(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.utangService.remove(+id);
  }
}