import { IsArray, IsInt, IsString, IsUUID, Min } from 'class-validator';

export class CreateOrderDTO {
  @IsString()
  @IsUUID('4')
  restaurantId: string;

  @IsArray()
  orderProducts: ProductWithQuantityDTO[];
}

export class ProductWithQuantityDTO {
  @IsUUID('4')
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
