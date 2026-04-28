import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Product } from '../products/product.entity';
import { Sale } from '../sales/sale.entity';
import { Utang } from '../utang/utang.entity';
import { Expense } from '../expenses/expenses.entity';
import { Category } from '../categories/category.entity';

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,

        { provide: getRepositoryToken(Product), useValue: {} },
        { provide: getRepositoryToken(Sale), useValue: {} },
        { provide: getRepositoryToken(Utang), useValue: {} },
        { provide: getRepositoryToken(Expense), useValue: {} },
        { provide: getRepositoryToken(Category), useValue: {} },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
