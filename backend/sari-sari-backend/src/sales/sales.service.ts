import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './sale.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private salesRepo: Repository<Sale>,

    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  /* ================= CREATE SALE ================= */
  async createTodaySale(product_id: number, quantity: number) {
    const product = await this.productRepo.findOne({ where: { product_id } });

    if (!product) throw new NotFoundException('Product not found');
    if (product.stock < quantity) throw new BadRequestException('Insufficient stock');

    const price = Number(product.price);
    const total = price * quantity;

    const sale = this.salesRepo.create({
      product,
      product_id,
      quantity,
      price,
      total,
    });

    product.stock -= quantity;
    await this.productRepo.save(product);

    return this.salesRepo.save(sale);
  }

  /* ================= DAILY (REAL) ================= */
  async getDailySales(date: string) {
    const result = await this.salesRepo
      .createQueryBuilder('sale')
      .select('DATE(sale.sale_date)', 'date')
      .addSelect('SUM(sale.total)', 'totalSales')
      .where('DATE(sale.sale_date) = :date', { date })
      .groupBy('DATE(sale.sale_date)')
      .getRawOne();

    return {
      date: result?.date ?? date,
      totalSales: Number(result?.totalSales ?? 0),
    };
  }

  /* ================= WEEKLY (REAL PER DAY RANGE) ================= */
  async getWeeklySales(month: number, year: number) {
    const result = await this.salesRepo
      .createQueryBuilder('sale')
      .select('DATE(sale.sale_date)', 'date')
      .addSelect('SUM(sale.total)', 'totalSales')
      .where('MONTH(sale.sale_date) = :month', { month })
      .andWhere('YEAR(sale.sale_date) = :year', { year })
      .groupBy('DATE(sale.sale_date)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return result.map(r => ({
      date: r.date,
      totalSales: Number(r.totalSales),
    }));
  }

  /* ================= MONTHLY (REAL PER DAY) ================= */
  async getMonthlySales(year: number) {
    const result = await this.salesRepo
      .createQueryBuilder('sale')
      .select('DATE(sale.sale_date)', 'date')
      .addSelect('SUM(sale.total)', 'totalSales')
      .where('YEAR(sale.sale_date) = :year', { year })
      .groupBy('DATE(sale.sale_date)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return result.map(r => ({
      date: r.date,
      totalSales: Number(r.totalSales),
    }));
  }

  /* ================= YEARLY (REAL PER MONTH) ================= */
  async getYearlySales() {
    const result = await this.salesRepo
      .createQueryBuilder('sale')
      .select('MONTH(sale.sale_date)', 'month')
      .addSelect('SUM(sale.total)', 'totalSales')
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    return Array.from({ length: 12 }, (_, i) => {
      const found = result.find(r => Number(r.month) === i + 1);
      return {
        month: i + 1,
        totalSales: Number(found?.totalSales ?? 0),
      };
    });
  }

  /* ================= TODAY ================= */
  async getTodaySales() {
    return this.salesRepo
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.product', 'product')
      .where('DATE(sale.sale_date) = CURDATE()')
      .orderBy('sale.sale_date', 'DESC')
      .getMany();
  }

  async getAllSales() {
  const result = await this.salesRepo
    .createQueryBuilder("sale")
    .leftJoinAndSelect("sale.product", "product")
    .orderBy("sale.sale_date", "DESC")
    .getMany();

  return result.map(s => ({
    sale_id: s.sale_id,
    product_name: s.product?.name,
    quantity: Number(s.quantity),
    price: Number(s.price),
    total: Number(s.total),
    sale_date: s.sale_date,
  }));
}
}