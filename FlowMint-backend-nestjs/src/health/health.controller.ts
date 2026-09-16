import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../auth/public.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Liveness + DB readiness probe. Used by uptime monitors (UptimeRobot,
   * cron-job.org, etc.) to keep the Render free tier and Supabase awake.
   * Public: no JWT required; global throttler gives it 100 req/min headroom.
   */
  @Public()
  @Get()
  @ApiOperation({ summary: 'Health check: service + database readiness' })
  async check() {
    const started = Date.now();
    let db = 'down';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      db = 'up';
    } catch {
      // DB unreachable — report degraded, monitor will alert
    }
    return {
      status: db === 'up' ? 'ok' : 'degraded',
      db,
      latencyMs: Date.now() - started,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}