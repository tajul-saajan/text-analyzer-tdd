export class CacheInterface {
  public get(key: string): any {
    throw new Error(`Implement the method with params: ${key}`);
  }
  public set(key: string, value: any, ttl: number): any {
    throw new Error(`Implement the method with params: ${key},${value},${ttl}`);
  }
}
