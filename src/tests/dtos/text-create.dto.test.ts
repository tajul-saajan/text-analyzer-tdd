import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { TextCreateDto } from '@/dtos/create-text.dto';

describe('TextCreateDto', () => {
  describe('HTML Sanitization', () => {
    it('should sanitize script tags from content', async () => {
      const maliciousInput = {
        content: 'Hello <script>alert("xss")</script> World',
      };

      const dto = plainToClass(TextCreateDto, maliciousInput);
      expect(dto.content).toBe('Hello  World');
    });

    it('should remove all HTML tags', async () => {
      const htmlInput = {
        content: '<div>Hello <b>World</b></div>',
      };

      const dto = plainToClass(TextCreateDto, htmlInput);
      expect(dto.content).toBe('Hello World');
    });

    it('should remove javascript: protocols', async () => {
      const jsInput = {
        content: 'Click <a href="javascript:alert(\'xss\')">here</a>',
      };

      const dto = plainToClass(TextCreateDto, jsInput);
      expect(dto.content).toBe('Click here');
    });

    it('should remove event handlers', async () => {
      const eventInput = {
        content: 'Text with onclick="alert(\'xss\')" handler',
      };

      const dto = plainToClass(TextCreateDto, eventInput);
      expect(dto.content).toBe('Text with "alert(\'xss\')" handler');
    });

    it('should preserve clean text content', async () => {
      const cleanInput = {
        content: 'This is clean text with numbers 123 and symbols !@#',
      };

      const dto = plainToClass(TextCreateDto, cleanInput);
      expect(dto.content).toBe('This is clean text with numbers 123 and symbols !@#');
    });
  });

  describe('Validation', () => {
    it('should pass validation for valid content', async () => {
      const validInput = {
        content: 'Valid text content',
      };

      const dto = plainToClass(TextCreateDto, validInput);
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation for empty content', async () => {
      const emptyInput = {
        content: '',
      };

      const dto = plainToClass(TextCreateDto, emptyInput);
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isNotEmpty).toBe('Content must not be empty');
    });

    it('should fail validation for content exceeding 5000 characters', async () => {
      const longInput = {
        content: 'a'.repeat(5001),
      };

      const dto = plainToClass(TextCreateDto, longInput);
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isLength).toBe('Content must be between 1 and 5000 characters');
    });

    it('should fail validation for non-string content', async () => {
      const invalidInput = {
        content: 123,
      };

      const dto = plainToClass(TextCreateDto, invalidInput);
      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isString).toBeDefined();
    });
  });

  describe('Combined Sanitization and Validation', () => {
    it('should sanitize HTML and still pass validation', async () => {
      const htmlInput = {
        content: '<p>This is <strong>valid</strong> content after sanitization</p>',
      };

      const dto = plainToClass(TextCreateDto, htmlInput);
      const errors = await validate(dto);

      expect(dto.content).toBe('This is valid content after sanitization');
      expect(errors).toHaveLength(0);
    });

    it('should sanitize HTML but fail validation if result is empty', async () => {
      const onlyHtmlInput = {
        content: '<script></script><div></div>',
      };

      const dto = plainToClass(TextCreateDto, onlyHtmlInput);
      const errors = await validate(dto);

      expect(dto.content).toBe('');
      expect(errors).toHaveLength(1);
      expect(errors[0].constraints?.isNotEmpty).toBe('Content must not be empty');
    });
  });
});
