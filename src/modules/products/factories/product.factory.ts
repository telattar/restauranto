import { faker } from '@faker-js/faker';
import { ProductDTO } from '../dto/product.dto';

export function createFakeProduct(): ProductDTO {
  const product = {
    id: faker.string.uuid(),
    restaurantId: faker.string.uuid(),
    name: faker.string.alpha(),
    price: faker.number.float({ min: 10, max: 100, fractionDigits: 2 }),
    createdAt: faker.date.recent(),
  };

  return product;
}
