import { faker } from '@faker-js/faker/.';
import { OrderDTO } from '../dto/order.dto';
import { ORDERS_STATUS } from '../constants/orders.constants';

export function createFakeOrder(): OrderDTO {
  const order = {
    id: faker.string.uuid(),
    status: ORDERS_STATUS.SUBMITTED,
    totalPrice: faker.number.float(),
    createdAt: faker.date.recent(),
    restaurantId: faker.string.uuid(),
    orderProducts: [{ productId: faker.string.uuid(), quantity: faker.number.int({ min: 1 }) }],
  };

  return order;
}
