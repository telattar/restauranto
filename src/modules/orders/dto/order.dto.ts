import { ProductDTO } from '../../products/dto/product.dto';

export class OrderDTO {
  id: string;
  status: string;
  totalPrice: number;
  createdAt: Date;
  restaurantId: string;
  orderProducts: Partial<{
    productId: string;
    quantity: number;
    product: ProductDTO;
  }>[];
}
