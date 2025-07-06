import { SanitizeHtml } from '@/decorators/sanitizeHtml.decorator';
import { IsString, IsNumber, ValidateIf, IsOptional, IsNotEmpty } from 'class-validator';

export class TextDto {
  @ValidateIf(body => !body.text_id)
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @SanitizeHtml()
  text: string;

  @ValidateIf(body => !body.text)
  @IsNumber()
  @IsOptional()
  text_id: number;
}
