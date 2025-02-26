import { Service } from 'typedi';

@Service()
export class TextAnalysisService {
  getWordCount(content: string = '') {
    return this.getWords(content).length;
  }

  private getWords(content: string) {
    return (content ?? '').trim().split(/\s+/).filter(Boolean);
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

  getLongestWordForEachParagraph(content: string) {
    const paragraphs = this.getParagraphs(content);

    return paragraphs.map((paragraph, index) => {
      const words = this.getWords(paragraph);

      const longest_word = words.reduce((lWord, word) => {
        if (word.length > lWord.length) return word;
        return lWord;
      }, '');

      return {
        para_no: index + 1,
        longest_word,
        length: longest_word.length,
      };
    });
  }

  performFullAnalysis(content: string) {
    const word_count = this.getWordCount(content);
    const character_count = this.getCharacterCount(content);
    const sentence_count = this.getSentenceCount(content);
    const paragraph_count = this.getParagraphCount(content);
    const largest_words = this.getLongestWordForEachParagraph(content);

    return {
      word_count,
      character_count,
      sentence_count,
      paragraph_count,
      largest_words,
    };
  }
}
