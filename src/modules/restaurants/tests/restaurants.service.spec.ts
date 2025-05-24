import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from '../restaurants.service';
import { RestaurantsRepository } from '../restaurants.repository';
import { RestaurantDTO } from '../dto/restaurant.dto';
import { createFakeRestaurant } from '../factories/restaurants.factory';
import { DatabaseService } from '../../../database/database.service';
import { faker } from '@faker-js/faker';

describe('RestaurantsService', () => {
  let service: RestaurantsService;
  let repository: RestaurantsRepository;
  let mockRestaurants: RestaurantDTO[];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestaurantsService, RestaurantsRepository, DatabaseService],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
    repository = module.get<RestaurantsRepository>(RestaurantsRepository);
    mockRestaurants = Array.from({ length: 5 }, () => createFakeRestaurant());
  });

  it('should get all restaurant', async () => {
    jest.spyOn(RestaurantsRepository.prototype, 'findAll').mockResolvedValueOnce(mockRestaurants);
    const restaurants = await service.getAll();

    expect(RestaurantsRepository.prototype.findAll).toHaveBeenCalledTimes(1);
    expect(restaurants).toEqual(mockRestaurants);
  });

  it('should get restaurant by id', async () => {
    const restaurant = mockRestaurants[0];
    jest.spyOn(RestaurantsRepository.prototype, 'findOne').mockResolvedValueOnce(restaurant);
    const result = await service.getById(restaurant.id);

    expect(RestaurantsRepository.prototype.findOne).toHaveBeenCalledWith(restaurant.id);
    expect(result).toEqual(restaurant);
  });

  it('should create a restaurant', async () => {
    const newRestaurant = createFakeRestaurant();
    jest.spyOn(RestaurantsRepository.prototype, 'create').mockResolvedValueOnce(newRestaurant);
    const result = await service.create(newRestaurant);

    expect(RestaurantsRepository.prototype.create).toHaveBeenCalledWith(newRestaurant);
    expect(result).toEqual(newRestaurant);
  });

  it('should update a restaurant', async () => {
    const restaurant = mockRestaurants[0];
    const updatedData = { name: faker.commerce.productName() };
    jest.spyOn(RestaurantsRepository.prototype, 'update').mockResolvedValueOnce({ ...restaurant, ...updatedData });
    const result = await service.update(restaurant.id, updatedData);

    expect(RestaurantsRepository.prototype.update).toHaveBeenCalledWith(restaurant.id, updatedData);
    expect(result).toEqual({ ...restaurant, ...updatedData });
  });

  it('should delete a restaurant', async () => {
    const { id } = mockRestaurants[0];
    jest.spyOn(RestaurantsRepository.prototype, 'delete').mockResolvedValueOnce(undefined);
    await service.delete(id);

    expect(RestaurantsRepository.prototype.delete).toHaveBeenCalledWith(id);
  });
});
