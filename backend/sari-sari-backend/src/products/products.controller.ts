import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Req() req: any, @Query('category_id') categoryId?: string) {
    return this.service.findAll(req.user, categoryId ? Number(categoryId) : undefined);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Req() req: any, @Body() body: any) {
    return this.service.create(req.user, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() body: any) {
    return this.service.update(req.user, Number(id), body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.user, Number(id));
  }

  // ✅ FIXED: Low stock endpoint
  @UseGuards(AuthGuard('jwt'))
  @Get('low-stock')
  getLowStock(@Req() req: any) {
    return this.service.getLowStock(req.user);
  }
}