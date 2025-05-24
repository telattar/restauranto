import { IsIn, IsString } from 'class-validator';
import { ORDERS_STATUS } from '../constants/orders.constants';

export class UpdateOrderDTO {
  @IsString()
  @IsIn([ORDERS_STATUS.PROCESSING, ORDERS_STATUS.OUT_FOR_DELIVERY, ORDERS_STATUS.DELIVERED], {
    message: 'Invalid order status',
  })
  status: string;
}
