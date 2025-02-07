import { Service } from 'typedi';

@Service()
export class TextAnalysisService {
  getWordCount(content: string = '') {
    const word_count = (content ?? '').trim().split(/\s+/).filter(Boolean).length;
    return { word_count };
  }
}
