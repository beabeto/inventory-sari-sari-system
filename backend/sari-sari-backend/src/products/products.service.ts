import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async findAll(categoryId?: number) {
    const query = this.repo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'category');

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

  async create(data: {
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

  const product = this.repo.create({
    name: data.name,
    price: data.price,
    stock: data.stock,
    category,
    category_id: data.category_id,
  });

  return this.repo.save(product);
}

  async update(
    id: number,
    data: {
      name: string;
      price: number;
      stock: number;
      category_id: number;
    },
  ) {
    const product = await this.repo.findOneBy({ product_id: id });
    if (!product) {
      throw new NotFoundException('Product not found');
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

  async remove(id: number) {
    const product = await this.repo.findOneBy({ product_id: id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.repo.remove(product);
  }
}