import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepo: Repository<Category>,
  ) {}

  // Get all categories
  findAll(): Promise<Category[]> {
    return this.categoriesRepo.find();
  }

  // Create category
  create(name: string): Promise<Category> {
    const category = this.categoriesRepo.create({ name });
    return this.categoriesRepo.save(category);
  }

  // Update category
  async update(id: number, name: string): Promise<Category> {
    const category = await this.categoriesRepo.findOneBy({ category_id: id });

    if (!category) {
      throw new Error('Category not found');
    }

    category.name = name;

    return this.categoriesRepo.save(category);
  }

  // Delete category
  async remove(id: number): Promise<void> {
    await this.categoriesRepo.delete(id);
  }
}