import { faker } from '@faker-js/faker';
import { RestaurantDTO } from '../dto/restaurant.dto';

export function createFakeRestaurant(): RestaurantDTO {
  const restaurant = {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    createdAt: faker.date.recent(),
  };

  return restaurant;
}
