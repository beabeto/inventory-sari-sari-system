import { Controller, Get, Post, Body, Query, BadRequestException } from "@nestjs/common";
import { SalesService } from "./sales.service";

@Controller("sales")
export class SalesController {
  constructor(private readonly service: SalesService) {}

  @Get("today")
  getToday() {
    return this.service.getToday();
  }

  @Post("today")
  create(@Body() body: { product_id: number; quantity: number }) {
    return this.service.create(body);
  }

  @Get("history/daily")
  daily(@Query("date") date: string) {
    if (!date) throw new BadRequestException("date is required");
    return this.service.daily(date);
  }

  @Get("history/weekly")
  weekly() {
    return this.service.weekly();
  }

  @Get("history/last-week")
  lastWeek() {
    return this.service.lastWeek();
  }

  @Get("history/monthly")
monthly(@Query("year") year?: string) {
  const parsedYear = Number(year);

  if (!year || isNaN(parsedYear)) {
    return this.service.monthly(new Date().getFullYear());
  }

  return this.service.monthly(parsedYear);
}

  @Get("history/yearly")
  yearly() {
    return this.service.yearly();
  }

  @Get("best-selling")
  bestSelling() {
    return this.service.bestSelling();
  }

  @Get("profit-per-product")
  profitPerProduct() {
    return this.service.profitPerProduct();
  }

  @Get("profit-range")
  profitRange(@Query("start") start: string, @Query("end") end: string) {
    if (!start || !end) {
      throw new BadRequestException("start and end date required");
    }
    return this.service.profitDaily(start, end);
  }
}