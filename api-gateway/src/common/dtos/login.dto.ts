import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    type: 'string',
    example: 'youremail@example.com',
    description: "User's email address to receive notifications.",
  })
  @IsEmail({}, { message: 'The email address provided must be a valid one.' })
  @IsNotEmpty({ message: 'The email field is required.' })
  email: string;
}