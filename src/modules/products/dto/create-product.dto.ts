import { IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateProductDTO {
  @IsString()
  name: string;

  @IsString()
  @IsUUID('4')
  restaurantId: string;

  @IsNumber()
  @Min(0)
  price: number;
}
