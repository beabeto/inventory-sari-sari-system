import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Brand } from '../brands/brand.entity';
import { Category } from '../categories/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepo: Repository<Product>,

    @InjectRepository(Brand)
    private brandsRepo: Repository<Brand>,

    @InjectRepository(Category)
    private categoriesRepo: Repository<Category>,
  ) {}

  /** GET all products (with filters) */
  async findAll(categoryId?: number, brandId?: number): Promise<any[]> {
    const query = this.productsRepo.createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.category', 'category');

    if (categoryId) {
      query.andWhere('product.category_id = :categoryId', { categoryId });
    }

    if (brandId) {
      query.andWhere('product.brand_id = :brandId', { brandId });
    }

    const products = await query.getMany();

    return products.map(p => ({
      product_id: p.product_id,
      name: p.name,
      stock: p.stock,
      category_id: p.category_id,
      brand_id: p.brand_id,
      brandName: p.brand?.name || '',
      categoryName: p.category?.name || '',
    }));
  }

  /** CREATE */
  async create(data: {
    name: string;
    stock: number;
    brand_id: number;
    category_id: number;
  }): Promise<Product> {
    const brand = await this.brandsRepo.findOneBy({ brand_id: data.brand_id });
    const category = await this.categoriesRepo.findOneBy({ category_id: data.category_id });

    if (!brand) throw new NotFoundException('Brand not found');
    if (!category) throw new NotFoundException('Category not found');

    const product = this.productsRepo.create({
      name: data.name,
      stock: data.stock,
      brand,
      category,
    });

    return this.productsRepo.save(product);
  }

  /** UPDATE */
  async update(id: number, data: {
    name: string;
    stock: number;
    brand_id: number;
    category_id: number;
  }): Promise<Product> {
    const product = await this.productsRepo.findOneBy({ product_id: id });
    if (!product) throw new NotFoundException('Product not found');

    const brand = await this.brandsRepo.findOneBy({ brand_id: data.brand_id });
    const category = await this.categoriesRepo.findOneBy({ category_id: data.category_id });

    if (!brand) throw new NotFoundException('Brand not found');
    if (!category) throw new NotFoundException('Category not found');

    product.name = data.name;
    product.stock = data.stock;
    product.brand = brand;
    product.category = category;

    return this.productsRepo.save(product);
  }

  /** DELETE */
  async remove(id: number): Promise<void> {
    const result = await this.productsRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Product not found');
  }
}