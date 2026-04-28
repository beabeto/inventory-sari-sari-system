import { Controller, Get, Post, Put, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /** Get all categories with product count and total stock */
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req: any) {
    return this.categoriesService.findAll(req.user);
  }

  /** Create a new category */
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Req() req: any, @Body() body: { name: string }) {
    return this.categoriesService.create(req.user, body.name);
  }

  /** Update a category safely */
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() body: { name: string }) {
    return this.categoriesService.update(req.user, +id, body.name);
  }

  /** Remove a category by ID */
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    await this.categoriesService.remove(req.user, +id);
  }
}