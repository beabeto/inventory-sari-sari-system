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
  async getToday() {
    return this.saleRepo.query(`
      SELECT IFNULL(SUM(total), 0) as total
      FROM sales
      WHERE DATE(sale_date) = CURDATE()
    `);
  }

  /* ================= RECENT SALES (FIXED FOR FRONTEND) ================= */
  async recentToday() {
    return this.saleRepo.query(`
      SELECT 
        sale_id,
        product_id,
        quantity,
        price,
        total,
        sale_date
      FROM sales
      WHERE DATE(sale_date) = CURDATE()
      ORDER BY sale_date DESC
    `);
  }

  /* ================= CREATE SALE ================= */
  async create(data: { product_id: number; quantity: number }) {
    const product = await this.saleRepo.query(
      `SELECT price, stock FROM products WHERE product_id = ?`,
      [data.product_id]
    );

    if (!product.length) throw new Error("Product not found");

    const price = Number(product[0].price);

    if (product[0].stock < data.quantity) {
      throw new Error("Not enough stock");
    }

    await this.saleRepo.query(
      `INSERT INTO sales (product_id, quantity, price, total, sale_date)
       VALUES (?, ?, ?, ?, NOW())`,
      [data.product_id, data.quantity, price, price * data.quantity]
    );

    await this.saleRepo.query(
      `UPDATE products
       SET stock = stock - ?
       WHERE product_id = ?`,
      [data.quantity, data.product_id]
    );

    return { message: "Sale created successfully" };
  }

  /* ================= DAILY ================= */
  async daily(date: string) {
    const safeDate = date
      ? new Date(date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    return this.saleRepo.query(
      `
      SELECT 
        DATE(sale_date) as date,
        IFNULL(SUM(total), 0) as totalSales
      FROM sales
      WHERE DATE(sale_date) = ?
      GROUP BY DATE(sale_date)
      `,
      [safeDate]
    );
  }

  /* ================= WEEKLY ================= */
  async weekly() {
    const raw = await this.saleRepo.query(`
      SELECT 
        DAYOFWEEK(sale_date) as dayIndex,
        IFNULL(SUM(total), 0) as totalSales
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
      { day: "MON", totalSales: week[0] },
      { day: "TUE", totalSales: week[1] },
      { day: "WED", totalSales: week[2] },
      { day: "THU", totalSales: week[3] },
      { day: "FRI", totalSales: week[4] },
      { day: "SAT", totalSales: week[5] },
      { day: "SUN", totalSales: week[6] },
    ];
  }

  /* ================= MONTHLY ================= */
  async monthly(year?: number) {
    const safeYear =
      typeof year === "number" && !isNaN(year)
        ? year
        : new Date().getFullYear();

    const raw = await this.saleRepo.query(
      `
      SELECT 
        MONTH(sale_date) as month,
        IFNULL(SUM(total), 0) as totalSales
      FROM sales
      WHERE YEAR(sale_date) = ?
      GROUP BY MONTH(sale_date)
      ORDER BY month ASC
      `,
      [safeYear]
    );

    const months = Array(12).fill(0);

    raw.forEach((d: any) => {
      const index = Number(d.month) - 1;
      if (index >= 0 && index < 12) {
        months[index] = Number(d.totalSales || 0);
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
        IFNULL(SUM(total), 0) as totalSales
      FROM sales
      GROUP BY YEAR(sale_date)
      ORDER BY year ASC
    `);
  }
}