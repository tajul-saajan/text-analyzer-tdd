import { TextAnalysisService } from '@services/text-analysis.service'; // Assuming the correct path

describe('Word Count Tests', () => {
  let textAnalysisService: TextAnalysisService;

  beforeEach(() => {
    textAnalysisService = new TextAnalysisService();
  });

  it('should count words in a non-empty string', () => {
    const text = 'This is a test sentence';
    const data = textAnalysisService.getWordCount(text);
    expect(data.word_count).toBe(5);
  });

  it('should return 0 for an empty string', () => {
    const text = '';
    const data = textAnalysisService.getWordCount(text);
    expect(data.word_count).toBe(0);
  });

  it('should return 0 for a string with only spaces', () => {
    const text = '    ';
    const data = textAnalysisService.getWordCount(text);
    expect(data.word_count).toBe(0);
  });

  it('should count words correctly with multiple spaces', () => {
    const text = '  This    is   a   sentence   with  multiple spaces  ';
    const data = textAnalysisService.getWordCount(text);
    expect(data.word_count).toBe(7);
  });

  it('should count words correctly with leading and trailing spaces', () => {
    const text = '   Hello world   ';
    const data = textAnalysisService.getWordCount(text);
    expect(data.word_count).toBe(2);
  });

  it('should return 0 for null input', () => {
    const data = textAnalysisService.getWordCount(null as unknown as string);
    expect(data.word_count).toBe(0);
  });
});
