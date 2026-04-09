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

  /** Get all categories with product count and total stock */
  async findAll(): Promise<any[]> {
    return this.categoriesRepo
      .createQueryBuilder('category')
      .leftJoin('category.products', 'product')
      .select('category.category_id', 'category_id')
      .addSelect('category.name', 'name')
      .addSelect('COUNT(product.product_id)', 'productCount')
      .addSelect('COALESCE(SUM(product.stock), 0)', 'totalStock')
      .groupBy('category.category_id')
      .getRawMany()
      .then(rows =>
        rows.map(row => ({
          category_id: Number(row.category_id),
          name: row.name,
          productCount: Number(row.productCount),
          totalStock: Number(row.totalStock),
        })),
      );
  }

  /** Create a new category */
  create(name: string) {
    const category = this.categoriesRepo.create({ name });
    return this.categoriesRepo.save(category);
  }

  /** Update a category safely */
  async update(id: number, name: string) {
    const category = await this.categoriesRepo.findOneBy({ category_id: id });
    if (!category) throw new NotFoundException('Category not found');
    category.name = name;
    return this.categoriesRepo.save(category);
  }

  /** Remove a category by ID */
  async remove(id: number) {
    const result = await this.categoriesRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Category not found');
  }
}