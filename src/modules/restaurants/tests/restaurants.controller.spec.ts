import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsController } from '../restaurants.controller';
import { RestaurantsService } from '../restaurants.service';
import { RestaurantDTO } from '../dto/restaurant.dto';
import { createFakeRestaurant } from '../factories/restaurants.factory';
import { RestaurantsRepository } from '../restaurants.repository';
import { DatabaseService } from '../../../database/database.service';
import { faker } from '@faker-js/faker';

describe('RestaurantsController', () => {
  let controller: RestaurantsController;
  let service: RestaurantsService;
  let mockRestaurants: RestaurantDTO[];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantsController],
      providers: [RestaurantsService, RestaurantsRepository, DatabaseService],
    }).compile();

    controller = module.get<RestaurantsController>(RestaurantsController);
    service = module.get<RestaurantsService>(RestaurantsService);
    mockRestaurants = Array.from({ length: 5 }, () => createFakeRestaurant());
  });

  it('should return all restaurants', async () => {
    jest.spyOn(service, 'getAll').mockResolvedValueOnce(mockRestaurants);
    const result = await controller.getAllRestaurants();

    expect(service.getAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ restaurants: mockRestaurants });
  });

  it('should return restaurant by id', async () => {
    const restaurant = mockRestaurants[0];
    jest.spyOn(service, 'getById').mockResolvedValueOnce(restaurant);
    const result = await controller.getRestaurant(restaurant.id);

    expect(service.getById).toHaveBeenCalledWith(restaurant.id);
    expect(result).toEqual({ restaurant });
  });

  it('should create a restaurant', async () => {
    const newRestaurant = createFakeRestaurant();
    jest.spyOn(service, 'create').mockResolvedValueOnce(newRestaurant);
    const result = await controller.createRestaurant(newRestaurant);

    expect(service.create).toHaveBeenCalledWith(newRestaurant);
    expect(result).toEqual({ createdRestaurant: newRestaurant });
  });

  it('should update a restaurant', async () => {
    const restaurant = mockRestaurants[0];
    const updatedData = { description: faker.lorem.paragraph() };
    jest.spyOn(service, 'update').mockResolvedValueOnce({ ...restaurant, ...updatedData });
    const result = await controller.updateRestaurant(restaurant.id, updatedData);

    expect(service.update).toHaveBeenCalledWith(restaurant.id, updatedData);
    expect(result).toEqual({ updatedRestaurant: { ...restaurant, ...updatedData } });
  });

  it('should delete a restaurant', async () => {
    const { id } = mockRestaurants[0];
    jest.spyOn(service, 'delete').mockResolvedValueOnce();
    const result = await controller.deleteRestaurant(id);

    expect(service.delete).toHaveBeenCalledWith(id);
    expect(result).toBeUndefined();
  });
});
