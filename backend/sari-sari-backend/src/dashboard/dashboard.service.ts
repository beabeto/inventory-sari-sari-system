import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(private dataSource: DataSource) {}

  async getDashboard() {
    const totalProducts = await this.dataSource.query(
      `SELECT COUNT(*) as totalProducts FROM products`
    );

    const lowStock = await this.dataSource.query(
      `SELECT COUNT(*) as lowStock FROM products WHERE quantity <= reorder_level`
    );

    const salesToday = await this.dataSource.query(
      `SELECT SUM(total_amount) as salesToday FROM sales WHERE DATE(created_at) = CURDATE()`
    );

    return {
      totalProducts: totalProducts[0].totalProducts,
      lowStock: lowStock[0].lowStock,
      salesToday: salesToday[0].salesToday || 0,
    };
  }
}