import { Injectable, Logger } from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name)
  private client: Redis | null = null
  private isConnected = false

  constructor() {
    const url = process.env.REDIS_URL
    if (url) {
      try {
        this.client = new Redis(url, {
          maxRetriesPerRequest: 3,
          retryStrategy(times) {
            if (times > 3) return null
            return Math.min(times * 200, 2000)
          },
          lazyConnect: true,
        })
        this.client.on('connect', () => {
          this.isConnected = true
          this.logger.log('Redis connected')
        })
        this.client.on('error', (err) => {
          this.isConnected = false
          this.logger.warn(`Redis error: ${err.message}`)
        })
        this.client.connect().catch(() => {
          this.logger.warn('Redis connection failed — running without cache')
        })
      } catch {
        this.logger.warn('Redis not available — running without cache')
      }
    } else {
      this.logger.warn('REDIS_URL not set — running without cache')
    }
  }

  private isAvailable(): boolean {
    return this.isConnected && this.client !== null
  }

  async get<T = string>(key: string): Promise<T | null> {
    if (!this.isAvailable()) return null
    try {
      const val = await this.client!.get(key)
      if (!val) return null
      try { return JSON.parse(val) as T } catch { return val as unknown as T }
    } catch { return null }
  }

  async set(key: string, value: any, ttlSeconds = 300): Promise<void> {
    if (!this.isAvailable()) return
    try {
      const str = typeof value === 'string' ? value : JSON.stringify(value)
      await this.client!.setex(key, ttlSeconds, str)
    } catch {}
  }

  async del(key: string): Promise<void> {
    if (!this.isAvailable()) return
    try { await this.client!.del(key) } catch {}
  }

  async delPattern(pattern: string): Promise<void> {
    if (!this.isAvailable()) return
    try {
      const keys = await this.client!.keys(pattern)
      if (keys.length > 0) await this.client!.del(...keys)
    } catch {}
  }

  // Hot search — increment search count
  async incrementSearch(keyword: string): Promise<void> {
    if (!this.isAvailable()) return
    const key = `hot:search:${new Date().toISOString().slice(0, 10)}`
    try {
      await this.client!.zincrby(key, 1, keyword)
      await this.client!.expire(key, 86400) // 24h TTL
    } catch {}
  }

  // Get today's hot searches
  async getHotSearches(limit = 10): Promise<string[]> {
    if (!this.isAvailable()) return []
    const key = `hot:search:${new Date().toISOString().slice(0, 10)}`
    try {
      const results = await this.client!.zrevrange(key, 0, limit - 1)
      return results
    } catch { return [] }
  }

  // Cache wrapper
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlSeconds = 300,
  ): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached !== null) return cached

    const fresh = await fetchFn()
    await this.set(key, fresh, ttlSeconds)
    return fresh
  }
}
