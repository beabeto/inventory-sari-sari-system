import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoriesService.findAll();
  }

  @Post()
  async create(@Body() body: { name: string }): Promise<Category> {
    return await this.categoriesService.create(body.name);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { name: string },
  ): Promise<Category> {
    return await this.categoriesService.update(+id, body.name);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.categoriesService.remove(+id);
  }
}