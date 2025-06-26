import { IsNotEmpty, IsOptional, IsPhoneNumber, IsUrl, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsPhoneNumber('MG')
  phone?: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;
}
