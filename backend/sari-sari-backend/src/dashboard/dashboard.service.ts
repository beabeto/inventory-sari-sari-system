import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/product.entity';
import { Sale } from '../sales/sale.entity';
import { Utang } from '../utang/utang.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(Sale)
    private saleRepo: Repository<Sale>,

    @InjectRepository(Utang)
    private utangRepo: Repository<Utang>,
  ) {}

  async getDashboard() {
    const totalProducts = await this.productRepo.count();
    const totalCategories = await this.productRepo
      .createQueryBuilder('p')
      .select('COUNT(DISTINCT p.category_id)', 'count')
      .getRawOne();

    const lowStock = await this.productRepo.count({
      where: { stock: 10 },
    });

    const salesToday = await this.saleRepo
      .createQueryBuilder('sale')
      .select('SUM(sale.total)', 'total')
      .where('DATE(sale.sale_date) = CURDATE()')
      .getRawOne();

    const totalUtang = await this.utangRepo
      .createQueryBuilder('u')
      .select('SUM(u.total_debt)', 'total')
      .where('u.is_paid = false')
      .getRawOne();

    return {
      totalProducts,
      totalCategories: Number(totalCategories?.count || 0),
      lowStock,
      salesToday: Number(salesToday?.total || 0),
      totalUtang: Number(totalUtang?.total || 0),
    };
  }
}