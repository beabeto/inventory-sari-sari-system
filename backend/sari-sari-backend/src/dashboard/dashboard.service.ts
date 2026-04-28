import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../products/product.entity';
import { Sale } from '../sales/sale.entity';
import { Utang } from '../utang/utang.entity';
import { Expense } from '../expenses/expenses.entity';
import { Category } from '../categories/category.entity';

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

    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  /* ================= DASHBOARD ================= */
  async getDashboard(userId?: number) {
    // Count products owned by user if userId provided
    const totalProducts =
      typeof userId === 'number'
        ? await this.productRepo.count({
            where: { user_id: userId } as any,
          })
        : await this.productRepo.count();

    // Count categories owned by user if provided
    const totalCategories =
      typeof userId === 'number'
        ? await this.categoryRepo.count({
            where: { user_id: userId } as any,
          })
        : await this.categoryRepo.count();

    // Low stock for user
    const lowStockQuery = this.productRepo
      .createQueryBuilder('p')
      .where('p.stock <= :limit', { limit: 10 });

    if (typeof userId === 'number') {
      lowStockQuery.andWhere('p.user_id = :userId', { userId });
    }

    const lowStock = await lowStockQuery.getCount();

    /* ================= SALES ================= */
    const salesTodayRaw =
      typeof userId === 'number'
        ? await this.saleRepo.query(
            `
            SELECT IFNULL(SUM(quantity * price), 0) as total
            FROM sales
            WHERE user_id = ?
            AND DATE(sale_date) = CURDATE()
            `,
            [userId],
          )
        : await this.saleRepo.query(`
            SELECT IFNULL(SUM(quantity * price), 0) as total
            FROM sales
            WHERE DATE(sale_date) = CURDATE()
          `);

    const sales = Number(salesTodayRaw?.[0]?.total || 0);

    /* ================= EXPENSES ================= */
    let expenses = 0;

    try {
      if (typeof userId === 'number') {
        const expensesTodayRaw = await this.expenseRepo.query(
          `
          SELECT IFNULL(SUM(amount), 0) as total
          FROM expenses
          WHERE user_id = ?
          AND date >= CURDATE()
          AND date < CURDATE() + INTERVAL 1 DAY
          `,
          [userId],
        );

        expenses = Number(expensesTodayRaw?.[0]?.total || 0);
      } else {
        const expensesTodayRaw = await this.expenseRepo.query(`
          SELECT IFNULL(SUM(amount), 0) as total
          FROM expenses
          WHERE date >= CURDATE()
          AND date < CURDATE() + INTERVAL 1 DAY
        `);

        expenses = Number(expensesTodayRaw?.[0]?.total || 0);
      }
    } catch (err) {
      console.warn('Expense table not found, defaulting to 0');
      expenses = 0;
    }

    /* ================= UTANG ================= */
    const totalUtangRaw =
      typeof userId === 'number'
        ? await this.utangRepo.query(
            `
            SELECT IFNULL(SUM(total_debt), 0) as total
            FROM utang
            WHERE user_id = ?
            AND is_paid = false
            `,
            [userId],
          )
        : await this.utangRepo.query(`
            SELECT IFNULL(SUM(total_debt), 0) as total
            FROM utang
            WHERE is_paid = false
          `);

    return {
      totalProducts,
      totalCategories,
      lowStock,
      salesToday: sales,
      expensesToday: expenses,
      profitToday: sales - expenses,
      totalUtang: Number(totalUtangRaw?.[0]?.total || 0),
    };
  }

  /* ================= RECENT SALES TODAY ================= */
  async recentSalesToday(userId?: number) {
    if (typeof userId === 'number') {
      return this.saleRepo.query(
        `
        SELECT
          s.sale_id AS sale_id,
          s.sale_date AS sale_date,
          s.quantity AS quantity,
          s.price AS price,
          (s.quantity * s.price) AS total
        FROM sales s
        WHERE s.user_id = ?
        AND DATE(s.sale_date) = CURDATE()
        ORDER BY s.sale_date DESC
        LIMIT 20
        `,
        [userId],
      );
    }

    return this.saleRepo.query(`
      SELECT
        s.sale_id AS sale_id,
        s.sale_date AS sale_date,
        s.quantity AS quantity,
        s.price AS price,
        (s.quantity * s.price) AS total
      FROM sales s
      WHERE DATE(s.sale_date) = CURDATE()
      ORDER BY s.sale_date DESC
      LIMIT 20
    `);
  }

  /* ================= WEEKLY ================= */
  async weekly(userId?: number) {
    const raw =
      typeof userId === 'number'
        ? await this.saleRepo.query(
            `
            SELECT
              DAYOFWEEK(sale_date) as dayIndex,
              IFNULL(SUM(quantity * price), 0) as totalSales
            FROM sales
            WHERE user_id = ?
            AND YEARWEEK(sale_date, 1) = YEARWEEK(CURDATE(), 1)
            GROUP BY DAYOFWEEK(sale_date)
            `,
            [userId],
          )
        : await this.saleRepo.query(`
            SELECT
              DAYOFWEEK(sale_date) as dayIndex,
              IFNULL(SUM(quantity * price), 0) as totalSales
            FROM sales
            WHERE YEARWEEK(sale_date, 1) = YEARWEEK(CURDATE(), 1)
            GROUP BY DAYOFWEEK(sale_date)
          `);

    const week = Array(7).fill(0);

    const map: Record<number, number> = {
      1: 6, // Sunday
      2: 0, // Monday
      3: 1,
      4: 2,
      5: 3,
      6: 4,
      7: 5,
    };

    raw.forEach((d: any) => {
      const index = map[d.dayIndex];

      if (index !== undefined) {
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

  /* ================= MONTHLY ================= */
  async monthly(year?: number, userId?: number) {
    const safeYear =
      !year || isNaN(year)
        ? new Date().getFullYear()
        : year;

    const raw =
      typeof userId === 'number'
        ? await this.saleRepo.query(
            `
            SELECT
              MONTH(sale_date) as month,
              IFNULL(SUM(quantity * price), 0) as totalSales
            FROM sales
            WHERE YEAR(sale_date) = ?
            AND user_id = ?
            GROUP BY MONTH(sale_date)
            ORDER BY month ASC
            `,
            [safeYear, userId],
          )
        : await this.saleRepo.query(
            `
            SELECT
              MONTH(sale_date) as month,
              IFNULL(SUM(quantity * price), 0) as totalSales
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
  async yearly(userId?: number) {
    if (typeof userId === 'number') {
      return this.saleRepo.query(
        `
        SELECT
          YEAR(sale_date) as year,
          IFNULL(SUM(quantity * price), 0) as totalSales
        FROM sales
        WHERE user_id = ?
        GROUP BY YEAR(sale_date)
        ORDER BY year ASC
        `,
        [userId],
      );
    }

    return this.saleRepo.query(`
      SELECT
        YEAR(sale_date) as year,
        IFNULL(SUM(quantity * price), 0) as totalSales
      FROM sales
      GROUP BY YEAR(sale_date)
      ORDER BY year ASC
    `);
  }
}