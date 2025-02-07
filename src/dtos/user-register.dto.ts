import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UserRegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'name can not be empty' })
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'password can not be empty' })
  @Length(6)
  password: string;
}
