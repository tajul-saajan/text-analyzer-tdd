import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UserLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'password can not be empty' })
  @Length(6)
  password: string;
}
