import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual } from 'typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Category } from '../categories/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private repo: Repository<Product>,

    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async findAll(user: any, categoryId?: number) {
    const query = this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'category');

    // All users (including 'admin' username) see only their own products
    query.where('p.user_id = :userId', { userId: user?.userId || 0 });

    if (categoryId) {
      query.andWhere('p.category_id = :categoryId', { categoryId });
    }

    const data = await query.getMany();

    return data.map((p) => ({
      product_id: p.product_id,
      name: p.name,
      price: Number(p.price),
      stock: p.stock,
      category_id: p.category_id,
      categoryName: p.category?.name || '',
    }));
  }

  async create(user: any, data: {
  name: string;
  price: number;
  stock: number;
  category_id: number;
}) {
  const category = await this.categoryRepo.findOneBy({
    category_id: data.category_id,
  });

  if (!category) {
    throw new NotFoundException('Category not found');
  }

    // Always assign created products to the creating user
    const product = this.repo.create({
    name: data.name,
    price: data.price,
    stock: data.stock,
    category,
    category_id: data.category_id,
      user_id: user?.userId,
  });

  return this.repo.save(product);
}

  async update(
    user: any,
    id: number,
    data: {
      name: string;
      price: number;
      stock: number;
      category_id: number;
    },
  ) {
    const product = await this.repo.findOneBy({ product_id: id, user_id: user?.userId });
    if (!product) {
      throw new NotFoundException('Product not found or access denied');
    }

    const category = await this.categoryRepo.findOneBy({
      category_id: data.category_id,
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

  product.name = data.name;
  product.price = data.price;
  product.stock = data.stock;
  product.category = category;
  product.category_id = data.category_id;

    return this.repo.save(product);
  }

  async remove(user: any, id: number) {
    const product = await this.repo.findOneBy({ product_id: id, user_id: user?.userId });
    if (!product) {
      throw new NotFoundException('Product not found or access denied');
    }
    return this.repo.remove(product);
  }

  async getLowStock(user?: any) {
    // Only include this user's low-stock products
    return this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'category')
      .where('p.stock <= :lvl', { lvl: 5 })
      .andWhere('p.user_id = :userId', { userId: user?.userId ?? 0 })
      .getMany();
  }
}