import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { DashboardModule } from './dashboard/dashboard.module';
// future imports
// import { CategoriesModule } from './categories/categories.module';
// import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'beto',
      password: 'beto2004',
      database: 'sari_sari_db',
      entities: [
        User,
        __dirname + '/**/*.entity{.ts,.js}', // this will automatically load all entities
      ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'YOUR_SECRET_KEY',
      signOptions: { expiresIn: '1h' },
    }),
    DashboardModule,
    CategoriesModule,
    ProductsModule,
  ],
  controllers: [AuthController],
  providers: [UsersService, AuthService],
})
export class AppModule {}