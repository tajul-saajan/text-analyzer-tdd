export class CacheInterface {
  public get(key: string): any {}
  public set(key: string, value: any, ttl: number): any {}
}
