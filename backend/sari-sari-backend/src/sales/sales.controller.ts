import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  /* ================= TODAY ================= */
  @Get('today')
  getTodaySales() {
    return this.salesService.getTodaySales();
  }

  @Post('today')
  createTodaySale(
    @Body() body: { product_id: number; quantity: number },
  ) {
    return this.salesService.createTodaySale(
      body.product_id,
      body.quantity,
    );
  }

  /* ================= DAILY ================= */
  @Get('history/daily')
  getDaily(@Query('date') date: string) {
    return this.salesService.getDailySales(date);
  }

  /* ================= WEEKLY ================= */
  @Get('history/weekly')
  getWeekly(
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.salesService.getWeeklySales(
      Number(month),
      Number(year),
    );
  }

  /* ================= MONTHLY ================= */
  @Get('history/monthly')
  getMonthly(@Query('year') year: string) {
    return this.salesService.getMonthlySales(Number(year));
  }

  /* ================= YEARLY ================= */
  @Get('history/yearly')
  getYearly() {
    return this.salesService.getYearlySales();
  }
}