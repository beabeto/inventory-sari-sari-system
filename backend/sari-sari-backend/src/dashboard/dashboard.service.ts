import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(private dataSource: DataSource) {}

  async getDashboard() {
    const totalProducts = await this.dataSource.query(
      `SELECT COUNT(*) as total FROM products`
    );

    const totalCategories = await this.dataSource.query(
      `SELECT COUNT(*) as total FROM categories`
    );

    const lowStock = await this.dataSource.query(
      `SELECT COUNT(*) as total FROM products WHERE stock <= 5`
    );

    const salesToday = await this.dataSource.query(
      `SELECT COALESCE(SUM(total), 0) as total 
       FROM sales 
       WHERE DATE(sale_date) = CURDATE()`
    );

    return {
      totalProducts: Number(totalProducts[0].total) || 0,
      totalCategories: Number(totalCategories[0].total) || 0,
      lowStock: Number(lowStock[0].total) || 0,
      salesToday: Number(salesToday[0].total) || 0,
    };
  }
}