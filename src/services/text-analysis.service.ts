import { Service } from 'typedi';

@Service()
export class TextAnalysisService {
  getWordCount(content: string = '') {
    const word_count = (content ?? '').trim().split(/\s+/).filter(Boolean).length;
    return { word_count };
  }

  getCharacterCount(content: string, include_whitespace: boolean = false) {
    if (!content) return 0;

    if (include_whitespace) return content.length;

    const withOutWhiteSpace = content.replace(/\s+/g, '');
    return withOutWhiteSpace.length;
  }

  getSentenceCount(content: string) {
    if (!content) return 0;

    const sentences = content
      .trim()
      .split(/[.!?]+/)
      .filter(Boolean);

    return sentences.length;
  }

  getParagraphCount(content: string) {
    const paragraphs = this.getParagraphs(content);
    return paragraphs.length;
  }

  private getParagraphs(content: string) {
    if (!content) return [];
    return content.trim().split(/\n+/).filter(Boolean);
  }
}
