import { Controller, Get, Post, Body, Query, BadRequestException } from "@nestjs/common";
import { SalesService } from "./sales.service";

@Controller("sales")
export class SalesController {
  constructor(private readonly service: SalesService) {}

  @Get("today")
  getToday() {
    return this.service.getToday();
  }

  // ✅ ADD THIS (IMPORTANT FOR FRONTEND)
  @Get("today/list")
  getTodayList() {
    return this.service.recentToday();
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

  @Get("history/monthly")
  monthly(@Query("year") year?: string) {
    const parsedYear = Number(year);

    if (!year || isNaN(parsedYear)) {
      return this.service.monthly(new Date().getFullYear());
    }

    return this.service.monthly(parsedYear);
  }
}