import { TextAnalysisService } from '@services/text-analysis.service';

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

describe('Character Count Tests', () => {
  let textAnalysisService: TextAnalysisService;

  beforeEach(() => {
    textAnalysisService = new TextAnalysisService();
  });

  it('should count characters in a non-empty string', () => {
    const text = 'This is a test sentence';
    const characterCount = textAnalysisService.getCharacterCount(text, true);
    expect(characterCount).toBe(23);
  });

  it('should return 0 for an empty string', () => {
    const text = '';
    const characterCount = textAnalysisService.getCharacterCount(text);
    expect(characterCount).toBe(0);
  });

  it('should return 0 for a string with only spaces when white space is not considered as character', () => {
    const text = '    ';
    const characterCount = textAnalysisService.getCharacterCount(text, false);
    expect(characterCount).toBe(0);
  });

  it('should return 0 for a string with only spaces when white space not considered as character', () => {
    const text = '    ';
    const characterCount = textAnalysisService.getCharacterCount(text, true);
    expect(characterCount).toBe(4);
  });

  it('should count characters correctly with multiple spaces', () => {
    const text = '  This    is   a   sentence   with  multiple spaces  ';
    const characterCount = textAnalysisService.getCharacterCount(text);
    expect(characterCount).toBe(33);
  });

  it('should count characters correctly with leading and trailing spaces', () => {
    const text = '   Hello world   ';
    const characterCount = textAnalysisService.getCharacterCount(text);
    expect(characterCount).toBe(10); // 10 characters, excluding spaces
  });

  it('should return 0 for null input', () => {
    const characterCount = textAnalysisService.getCharacterCount(null as unknown as string);
    expect(characterCount).toBe(0); // Null input should return 0
  });
});
