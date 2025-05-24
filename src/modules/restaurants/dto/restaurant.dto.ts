import { ProductDTO } from '../../products/dto/product.dto';

export class RestaurantDTO {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  products?: ProductDTO[];
}
