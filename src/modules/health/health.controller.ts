import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { DiskHealthIndicator, HealthCheck, HttpHealthIndicator, MemoryHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus'

@ApiTags('Health - 健康检查')
@Controller('health')
export class HealthController {
  constructor(private http: HttpHealthIndicator, private db: TypeOrmHealthIndicator, private memory: MemoryHealthIndicator, private disk: DiskHealthIndicator,

  ) {}

  @Get('network')
  @HealthCheck()
  async checkNetwork() {
    return this.http.pingCheck('lucy', 'https://www.baidu.com')
  }

  @Get('database')
  @HealthCheck()
  async checkDatabase() {
    return this.db.pingCheck('database')
  }

  @Get('memory-heap')
  @HealthCheck()
  async checkMemoryHeap() {
    return this.memory.checkHeap('memory-heap', 200 * 1024 * 1024)
  }

  @Get('memory-rss')
  @HealthCheck()
  async checkMemoryRSS() {
    return this.memory.checkRSS('memory-rss', 200 * 1024 * 1024)
  }

  @Get('disk')
  @HealthCheck()
  async checkDisk() {
    return this.disk.checkStorage('disk', {
      thresholdPercent: 0.75,
      path: '/',
    })
  }
}
