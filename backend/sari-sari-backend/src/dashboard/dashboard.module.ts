import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

import { Product } from '../products/product.entity';
import { Sale } from '../sales/sale.entity';
import { Utang } from '../utang/utang.entity';
import { Expense } from '../expenses/expenses.entity';
import { Category } from '../categories/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Sale,
      Utang,
      Expense,
      Category, 
    ]),
  ],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}