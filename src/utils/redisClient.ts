import { Redis } from 'ioredis';
import { CacheInterface } from '@interfaces/cache.interface';
import { Service } from 'typedi';
import { REDIS_HOST, REDIS_PORT } from '@/config';

@Service()
class RedisClient implements CacheInterface {
  private readonly redis: Redis;
  public constructor() {
    this.redis = new Redis({
      host: REDIS_HOST,
      port: +REDIS_PORT,
    });
  }

  async get(key: string) {
    return this.redis.get(key);
  }

  async set(key: string, value: any, ttl: number) {
    return this.redis.setex(key, ttl, value);
  }
}

export default RedisClient;
