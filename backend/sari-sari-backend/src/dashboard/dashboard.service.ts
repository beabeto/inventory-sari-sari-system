import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../products/product.entity';
import { Sale } from '../sales/sale.entity';
import { Utang } from '../utang/utang.entity';
import { Expense } from '../expenses/expenses.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(Sale)
    private saleRepo: Repository<Sale>,

    @InjectRepository(Utang)
    private utangRepo: Repository<Utang>,

    @InjectRepository(Expense)
    private expenseRepo: Repository<Expense>,
  ) {}

  /* ================= DASHBOARD SUMMARY ================= */
  async getDashboard() {
    const totalProducts = await this.productRepo.count();

    const totalCategoriesRaw = await this.productRepo
      .createQueryBuilder('p')
      .select('COUNT(DISTINCT p.category_id)', 'count')
      .getRawOne();

    const lowStock = await this.productRepo
      .createQueryBuilder('p')
      .where('p.stock <= :limit', { limit: 10 })
      .getCount();

    const salesTodayRaw = await this.saleRepo
      .createQueryBuilder('sale')
      .select('SUM(sale.quantity * sale.price)', 'total')
      .where('DATE(CONVERT_TZ(sale.sale_date, "+00:00", "+08:00")) = CURDATE()')
      .getRawOne();

    const expensesTodayRaw = await this.expenseRepo
      .createQueryBuilder('e')
      .select('SUM(e.amount)', 'total')
      .where('DATE(e.date) = CURDATE()')
      .getRawOne();

    const totalUtangRaw = await this.utangRepo
      .createQueryBuilder('u')
      .select('SUM(u.total_debt)', 'total')
      .where('u.is_paid = false')
      .getRawOne();

    const sales = Number(salesTodayRaw?.total || 0);
    const expenses = Number(expensesTodayRaw?.total || 0);

    return {
      totalProducts,
      totalCategories: Number(totalCategoriesRaw?.count || 0),
      lowStock,
      salesToday: sales,
      expensesToday: expenses,
      profitToday: sales - expenses,
      totalUtang: Number(totalUtangRaw?.total || 0),
    };
  }

  /* ================= WEEKLY ================= */
  async weekly() {
    const raw = await this.saleRepo.query(`
      SELECT 
        DAYOFWEEK(sale_date) as dayIndex,
        SUM(quantity * price) as totalSales
      FROM sales
      WHERE YEARWEEK(sale_date, 1) = YEARWEEK(CURDATE(), 1)
      GROUP BY DAYOFWEEK(sale_date)
    `);

    const week = Array(7).fill(0);

    raw.forEach((d: any) => {
      const index = d.dayIndex === 1 ? 6 : d.dayIndex - 2;
      if (index >= 0 && index < 7) {
        week[index] = Number(d.totalSales || 0);
      }
    });

    return [
      { day: 'MON', totalSales: week[0] },
      { day: 'TUE', totalSales: week[1] },
      { day: 'WED', totalSales: week[2] },
      { day: 'THU', totalSales: week[3] },
      { day: 'FRI', totalSales: week[4] },
      { day: 'SAT', totalSales: week[5] },
      { day: 'SUN', totalSales: week[6] },
    ];
  }

  /* ================= MONTHLY (SAFE) ================= */
  async monthly(year?: number) {
    const safeYear =
      !year || isNaN(year) ? new Date().getFullYear() : year;

    const raw = await this.saleRepo.query(
      `
      SELECT 
        MONTH(sale_date) as month,
        SUM(quantity * price) as totalSales
      FROM sales
      WHERE YEAR(sale_date) = ?
      GROUP BY MONTH(sale_date)
      ORDER BY month ASC
      `,
      [safeYear],
    );

    const months = Array(12).fill(0);

    raw.forEach((d: any) => {
      const i = Number(d.month) - 1;
      if (i >= 0 && i < 12) {
        months[i] = Number(d.totalSales || 0);
      }
    });

    return months.map((val, i) => ({
      month: i + 1,
      totalSales: val,
    }));
  }

  /* ================= YEARLY ================= */
  async yearly() {
    return this.saleRepo.query(`
      SELECT 
        YEAR(sale_date) as year,
        SUM(quantity * price) as totalSales
      FROM sales
      GROUP BY YEAR(sale_date)
      ORDER BY year ASC
    `);
  }

  /* ================= PROFIT DAILY ================= */
  async profitDaily(start: string, end: string) {
    return this.saleRepo.query(
      `
      SELECT 
        DATE(CONVERT_TZ(s.sale_date, '+00:00', '+08:00')) as date,
        SUM((s.price - p.price) * s.quantity) as profit
      FROM sales s
      JOIN products p ON p.product_id = s.product_id
      WHERE DATE(CONVERT_TZ(s.sale_date, '+00:00', '+08:00'))
            BETWEEN ? AND ?
      GROUP BY DATE(CONVERT_TZ(s.sale_date, '+00:00', '+08:00'))
      ORDER BY date ASC
      `,
      [start, end],
    );
  }

  /* ================= RANGE SALES ================= */
  async rangeSales(start: string, end: string) {
    return this.saleRepo.query(
      `
      SELECT 
        DATE(CONVERT_TZ(sale_date, '+00:00', '+08:00')) as date,
        SUM(quantity * price) as totalSales
      FROM sales
      WHERE DATE(CONVERT_TZ(sale_date, '+00:00', '+08:00'))
            BETWEEN ? AND ?
      GROUP BY DATE(CONVERT_TZ(sale_date, '+00:00', '+08:00'))
      ORDER BY date ASC
      `,
      [start, end],
    );
  }
}