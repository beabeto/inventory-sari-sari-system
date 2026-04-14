import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  findAll(@Query('category_id') categoryId?: string) {
    return this.service.findAll(
      categoryId ? Number(categoryId) : undefined,
    );
  }

  @Post()
  create(
    @Body()
    body: {
      name: string;
      price: number;
      stock: number;
      category_id: number;
    },
  ) {
    return this.service.create(body);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      name: string;
      price: number;
      stock: number;
      category_id: number;
    },
  ) {
    return this.service.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }

  // ✅ FIXED: Low stock endpoint
  @Get('low-stock')
  getLowStock() {
    return this.service.getLowStock();
  }
}