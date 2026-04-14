import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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

  /* ================= TODAY SALES ================= */
  async getTodaySales() {
    return this.salesRepo
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.product', 'product')
      .where('DATE(sale.sale_date) = CURDATE()')
      .orderBy('sale.sale_date', 'DESC')
      .getMany();
  }

  /* ================= CREATE SALE ================= */
  async createTodaySale(product_id: number, quantity: number) {
    const product = await this.productRepo.findOne({
      where: { product_id },
    });

    if (!product) throw new NotFoundException('Product not found');

    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

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

  /* ================= DAILY SALES ================= */
  async getDailySales(date: string) {
    return this.salesRepo
      .createQueryBuilder('sale')
      .select('DATE(sale.sale_date)', 'date')
      .addSelect('SUM(sale.total)', 'totalSales')
      .where('DATE(sale.sale_date) = :date', { date })
      .groupBy('DATE(sale.sale_date)')
      .getRawMany();
  }

  /* ================= WEEKLY SALES (REAL) ================= */
  async getWeeklySales(month: number, year: number) {
    return this.salesRepo
      .createQueryBuilder('sale')
      .select('WEEK(sale.sale_date, 1)', 'week')
      .addSelect('SUM(sale.total)', 'totalSales')
      .where('MONTH(sale.sale_date) = :month', { month })
      .andWhere('YEAR(sale.sale_date) = :year', { year })
      .groupBy('WEEK(sale.sale_date, 1)')
      .orderBy('week', 'ASC')
      .getRawMany();
  }

  /* ================= MONTHLY SALES ================= */
  async getMonthlySales(year: number) {
    return this.salesRepo
      .createQueryBuilder('sale')
      .select('MONTH(sale.sale_date)', 'month')
      .addSelect('SUM(sale.total)', 'totalSales')
      .where('YEAR(sale.sale_date) = :year', { year })
      .groupBy('MONTH(sale.sale_date)')
      .orderBy('month', 'ASC')
      .getRawMany();
  }

  /* ================= YEARLY SALES ================= */
  async getYearlySales() {
    return this.salesRepo
      .createQueryBuilder('sale')
      .select('YEAR(sale.sale_date)', 'year')
      .addSelect('SUM(sale.total)', 'totalSales')
      .groupBy('YEAR(sale.sale_date)')
      .orderBy('year', 'ASC')
      .getRawMany();
  }
}