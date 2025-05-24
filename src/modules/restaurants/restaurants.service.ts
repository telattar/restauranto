import { Injectable } from '@nestjs/common';
import { RestaurantsRepository } from './restaurants.repository';
import { RestaurantDTO } from './dto/restaurant.dto';
import { CreateRestaurantDTO } from './dto/create-restaurant.dto';
import { UpdateRestaurantDTO } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(private readonly restaurantsRepository: RestaurantsRepository) {}

  async getById(id: string): Promise<RestaurantDTO> {
    return this.restaurantsRepository.findOne(id);
  }

  async getAll(): Promise<RestaurantDTO[]> {
    return this.restaurantsRepository.findAll();
  }

  async create(createRestaurantDto: CreateRestaurantDTO): Promise<RestaurantDTO> {
    return this.restaurantsRepository.create(createRestaurantDto);
  }

  async update(id: string, data: UpdateRestaurantDTO): Promise<RestaurantDTO> {
    return this.restaurantsRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    this.restaurantsRepository.delete(id);
  }
}
