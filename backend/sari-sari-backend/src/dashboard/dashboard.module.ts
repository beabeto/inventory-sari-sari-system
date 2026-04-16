import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

import { Product } from '../products/product.entity';
import { Sale } from '../sales/sale.entity';
import { Utang } from '../utang/utang.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Sale, Utang])],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}