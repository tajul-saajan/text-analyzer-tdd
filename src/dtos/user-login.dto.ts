import { SanitizeHtml } from '@/decorators/sanitizeHtml.decorator';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UserLoginDto {
  @IsEmail()
  @SanitizeHtml()
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'password can not be empty' })
  @Length(6)
  @SanitizeHtml()
  password: string;
}
