import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { UtangModule } from './utang/utang.module';
import { ExpensesModule } from './expenses/expenses.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'beto',
      password: 'beto2004',
      database: 'sari_sari_db',
      autoLoadEntities: true, // 👈 cleaner than listing entities manually
      synchronize: true,
    }),

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'YOUR_SECRET_KEY',
      signOptions: { expiresIn: '1h' },
    }),

    AuthModule,
    UsersModule, // 👈 THIS IS ENOUGH for /users routes
    DashboardModule,
    CategoriesModule,
    ProductsModule,
    SalesModule,
    UtangModule,
    ExpensesModule,
  ],
})
export class AppModule {}