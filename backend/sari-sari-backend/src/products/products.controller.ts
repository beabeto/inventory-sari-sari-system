import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(@Query('category_id') categoryId?: string, @Query('brand_id') brandId?: string): Promise<Product[]> {
    return this.productsService.findAll(
      categoryId ? +categoryId : undefined,
      brandId ? +brandId : undefined,
    );
  }

  @Post()
  async create(@Body() body: { name: string; stock: number; brand_id: number; category_id: number }): Promise<Product> {
    return this.productsService.create(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: { name: string; stock: number; brand_id: number; category_id: number }): Promise<Product> {
    return this.productsService.update(+id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.productsService.remove(+id);
  }
}