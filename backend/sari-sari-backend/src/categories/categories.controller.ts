import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /** Get all categories with product count and total stock */
  @Get()
  async findAll() {
    return this.categoriesService.findAll();
  }

  /** Create a new category */
  @Post()
  async create(@Body() body: { name: string }) {
    return this.categoriesService.create(body.name);
  }

  /** Update a category safely */
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: { name: string }) {
    return this.categoriesService.update(+id, body.name);
  }

  /** Remove a category by ID */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.categoriesService.remove(+id);
  }
}