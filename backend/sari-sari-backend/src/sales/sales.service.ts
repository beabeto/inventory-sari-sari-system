import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Sale } from "./sale.entity";

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private saleRepo: Repository<Sale>
  ) {}

  /* ================= TODAY TOTAL ================= */
  async getToday(userId?: number) {
    if (typeof userId === 'number') {
      return this.saleRepo.query(`
        SELECT IFNULL(SUM(total), 0) as total
        FROM sales
        WHERE DATE(sale_date) = CURDATE() AND user_id = ?
      `, [userId]);
    }

    return this.saleRepo.query(`
      SELECT IFNULL(SUM(total), 0) as total
      FROM sales
      WHERE DATE(sale_date) = CURDATE()
    `);
  }

  /* ================= DAILY ================= */
  async daily(date: string, userId?: number) {
    if (typeof userId === 'number') {
      return this.saleRepo.query(
        `
        SELECT 
          DATE(sale_date) as date,
          IFNULL(SUM(total), 0) as totalSales
        FROM sales
        WHERE DATE(sale_date) = ? AND user_id = ?
        GROUP BY DATE(sale_date)
        `,
        [date, userId]
      );
    }

    return this.saleRepo.query(
      `
      SELECT 
        DATE(sale_date) as date,
        IFNULL(SUM(total), 0) as totalSales
      FROM sales
      WHERE DATE(sale_date) = ?
      GROUP BY DATE(sale_date)
      `,
      [date]
    );
  }

  /* ================= WEEKLY ================= */
  async weekly(userId?: number) {
    if (typeof userId === 'number') {
      return this.saleRepo.query(`
        SELECT 
          DAYNAME(sale_date) as day,
          IFNULL(SUM(total), 0) as totalSales
        FROM sales
        WHERE YEARWEEK(sale_date, 1) = YEARWEEK(CURDATE(), 1) AND user_id = ?
        GROUP BY DAYNAME(sale_date)
      `, [userId]);
    }

    return this.saleRepo.query(`
      SELECT 
        DAYNAME(sale_date) as day,
        IFNULL(SUM(total), 0) as totalSales
      FROM sales
      WHERE YEARWEEK(sale_date, 1) = YEARWEEK(CURDATE(), 1)
      GROUP BY DAYNAME(sale_date)
    `);
  }

  /* ================= MONTHLY ================= */
  async monthly(year: number, userId?: number) {
    if (typeof userId === 'number') {
      return this.saleRepo.query(
        `
        SELECT 
          MONTH(sale_date) as month,
          IFNULL(SUM(total), 0) as totalSales
        FROM sales
        WHERE YEAR(sale_date) = ? AND user_id = ?
        GROUP BY MONTH(sale_date)
        ORDER BY month ASC
        `,
        [year, userId]
      );
    }

    return this.saleRepo.query(
      `
      SELECT 
        MONTH(sale_date) as month,
        IFNULL(SUM(total), 0) as totalSales
      FROM sales
      WHERE YEAR(sale_date) = ?
      GROUP BY MONTH(sale_date)
      ORDER BY month ASC
      `,
      [year]
    );
  }

  /* ================= YEARLY (FIXED) ================= */
  async yearly(userId?: number) {
    if (typeof userId === 'number') {
      return this.saleRepo.query(`
        SELECT 
          YEAR(sale_date) as year,
          IFNULL(SUM(total), 0) as totalSales
        FROM sales
        WHERE user_id = ?
        GROUP BY YEAR(sale_date)
        ORDER BY year ASC
      `, [userId]);
    }

    return this.saleRepo.query(`
      SELECT 
        YEAR(sale_date) as year,
        IFNULL(SUM(total), 0) as totalSales
      FROM sales
      GROUP BY YEAR(sale_date)
      ORDER BY year ASC
    `);
  }

  async create(data: { product_id: number; quantity: number; user_id?: number }) {
  const product = await this.saleRepo.query(
    `SELECT price, stock FROM products WHERE product_id = ?`,
    [data.product_id]
  );

  if (!product.length) {
    throw new Error("Product not found");
  }

  const price = Number(product[0].price);

  if (product[0].stock < data.quantity) {
    throw new Error("Not enough stock");
  }

  await this.saleRepo.query(
    `INSERT INTO sales (product_id, quantity, price, total, sale_date, user_id)
     VALUES (?, ?, ?, ?, NOW(), ?)`,
    [data.product_id, data.quantity, price, price * data.quantity, (data as any).user_id ?? null]
  );

  await this.saleRepo.query(
    `UPDATE products
     SET stock = stock - ?
     WHERE product_id = ?`,
    [data.quantity, data.product_id]
  );

  return { message: "Sale created successfully" };
}
}