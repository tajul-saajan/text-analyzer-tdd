import RedisClient from '@utils/redisClient';
import { TextAnalysisService } from '@/services/text-analysis.service';
import { CacheInterface } from '@interfaces/cache.interface';
import { Container, Service } from 'typedi';

@Service()
export class TextAnalysisProxy {
  private readonly cache: CacheInterface;
  private readonly textAnalysisService: TextAnalysisService;

  constructor() {
    this.cache = Container.get(RedisClient);
    this.textAnalysisService = Container.get(TextAnalysisService);
  }

  public async analyzeText(text: string) {
    const cacheKey = this.getCacheKey(text);

    const cachedResult = await this.cache.get(cacheKey);
    if (cachedResult) {
      console.log('cache hit');
      return JSON.parse(cachedResult);
    }

    console.log('cache miss');

    const analysisResult = this.textAnalysisService.performFullAnalysis(text);

    await this.cache.set(cacheKey, JSON.stringify(analysisResult), 3600);

    return analysisResult;
  }

  private getCacheKey(text: string): string {
    return `text-analysis:${Buffer.from(text).toString('base64')}`;
  }
}
