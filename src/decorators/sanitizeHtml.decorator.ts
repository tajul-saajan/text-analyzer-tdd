import { registerDecorator, ValidationOptions } from 'class-validator';
import { Transform } from 'class-transformer';

// Custom sanitization function
function sanitizeHtml(value: string): string {
  if (typeof value !== 'string') return value;

  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
}

// Custom decorator
export function SanitizeHtml(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'sanitizeHtml',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string';
        },
      },
    });

    // Apply transformation
    Transform(({ value }) => sanitizeHtml(value))(object, propertyName);
  };
}
