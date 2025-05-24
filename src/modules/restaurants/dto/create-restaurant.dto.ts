import { IsOptional, IsString } from 'class-validator';

export class CreateRestaurantDTO {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
