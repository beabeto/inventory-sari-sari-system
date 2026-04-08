import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepo: Repository<Category>,
  ) {}

  /** Get all categories */
  findAll(): Promise<Category[]> {
    return this.categoriesRepo.find();
  }

  /** Create a new category */
  create(name: string): Promise<Category> {
    const category = this.categoriesRepo.create({ name });
    return this.categoriesRepo.save(category);
  }

  /** Update a category safely */
  async update(id: number, name: string): Promise<Category> {
    const category = await this.categoriesRepo.findOneBy({ category_id: id });
    if (!category) throw new NotFoundException('Category not found');

    category.name = name;
    return this.categoriesRepo.save(category);
  }

  /** Remove a category by ID */
  async remove(id: number): Promise<void> {
    const result = await this.categoriesRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Category not found');
  }
}