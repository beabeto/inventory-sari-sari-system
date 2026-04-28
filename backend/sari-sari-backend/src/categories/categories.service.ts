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
  async findAll(user: any): Promise<any[]> {
    const query = this.categoriesRepo
      .createQueryBuilder('category')
      .leftJoin('category.products', 'product')
      .select('category.category_id', 'category_id')
      .addSelect('category.name', 'name')
      .addSelect('COUNT(product.product_id)', 'productCount')
      .addSelect('COALESCE(SUM(product.stock), 0)', 'totalStock');

    // All users (including any 'admin' username) see only their own categories
    query.where('category.user_id = :userId', { userId: user?.userId || 0 });

    return query
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
  create(user: any, name: string) {
    // Always assign created categories to the creating user
    const category = this.categoriesRepo.create({ name, user_id: user?.userId });
    return this.categoriesRepo.save(category);
  }

  /** Update a category safely */
  async update(user: any, id: number, name: string) {
    // Only allow updating categories owned by this user
    const category = await this.categoriesRepo.findOneBy({ category_id: id, user_id: user?.userId });
    if (!category) throw new NotFoundException('Category not found or access denied');
    category.name = name;
    return this.categoriesRepo.save(category);
  }

  /** Remove a category by ID */
  async remove(user: any, id: number) {
    const result = await this.categoriesRepo.delete({ category_id: id, user_id: user?.userId });
    if (result.affected === 0) throw new NotFoundException('Category not found or access denied');
  }

  // ...existing code...
}