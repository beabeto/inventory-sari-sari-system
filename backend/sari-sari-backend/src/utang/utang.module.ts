import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Utang } from './utang.entity';
import { UtangItem } from './utang-item.entity';
import { UtangService } from './utang.service';
import { UtangController } from './utang.controller';

// 1. You must import the actual class from its file path
import { ProductsModule } from '../products/products.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Utang, UtangItem]),
    ProductsModule, // 2. This allows UtangService to use the ProductRepository
  ],
  providers: [UtangService],
  controllers: [UtangController],
})
export class UtangModule {}