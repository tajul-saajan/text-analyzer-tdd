import { Redis } from 'ioredis';
import { CacheInterface } from '@interfaces/cache.interface';
import { Service } from 'typedi';

@Service()
class RedisClient implements CacheInterface {
  private redis: Redis;
  public constructor() {
    this.redis = new Redis({
      host: 'localhost',
      port: 6379,
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
