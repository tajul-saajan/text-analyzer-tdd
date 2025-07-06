import { SanitizeHtml } from '@/decorators/sanitizeHtml.decorator';
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

const USER_PASSWORD_REGEX = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
export class UserRegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'name can not be empty' })
  @SanitizeHtml()
  name: string;

  @IsEmail()
  @SanitizeHtml()
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'password can not be empty' })
  @SanitizeHtml()
  @Length(8, 50)
  @Matches(USER_PASSWORD_REGEX, {
    message: 'Password must include uppercase, lowercase, and number',
  })
  password: string;
}
