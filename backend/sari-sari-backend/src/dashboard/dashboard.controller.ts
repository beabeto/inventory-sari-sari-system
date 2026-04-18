import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /* ================= MAIN DASHBOARD ================= */
  @Get()
  getDashboard() {
    return this.dashboardService.getDashboard();
  }

  /* ================= RECENT SALES ================= */
  @Get('recent-today')
  recentToday() {
    return this.dashboardService.recentSalesToday();
  }

  /* ================= WEEKLY ================= */
  @Get('weekly')
  weekly() {
    return this.dashboardService.weekly();
  }

  /* ================= MONTHLY ================= */
  @Get('monthly')
  monthly() {
    return this.dashboardService.monthly();
  }

  /* ================= YEARLY ================= */
  @Get('yearly')
  yearly() {
    return this.dashboardService.yearly();
  }
}