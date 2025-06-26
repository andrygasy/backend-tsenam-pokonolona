import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RequestProfessionalDto {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  accountType: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEmail()
  email: string;
}
