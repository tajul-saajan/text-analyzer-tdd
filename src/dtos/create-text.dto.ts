import { IsString, IsNotEmpty, Length } from 'class-validator';

export class TextCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'Content must not be empty' })
  @Length(1, 5000, { message: 'Content must be between 1 and 5000 characters' })
  content: string;
}
