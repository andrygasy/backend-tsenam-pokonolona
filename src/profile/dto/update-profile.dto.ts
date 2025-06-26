import { IsNotEmpty, IsOptional, IsPhoneNumber, IsUrl, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsPhoneNumber(null)
  phone?: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;
}
