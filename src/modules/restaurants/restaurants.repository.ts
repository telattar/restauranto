import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateRestaurantDTO } from './dto/create-restaurant.dto';
import { UpdateRestaurantDTO } from './dto/update-restaurant.dto';
import { Restaurant } from '@prisma/client';
import { isRecordNotFoundError } from '../../utils/database.util';

@Injectable()
export class RestaurantsRepository {
  constructor(private database: DatabaseService) {}

  async create(createRestaurantDto: CreateRestaurantDTO) {
    return await this.database.restaurant.create({
      data: createRestaurantDto,
    });
  }

  async findOne(id: string): Promise<Restaurant> {
    const restaurant = await this.database.restaurant.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!restaurant) throw new NotFoundException(`Restaurant with id ${id} not found.`);

    return restaurant;
  }

  async findAll(): Promise<Restaurant[]> {
    return await this.database.restaurant.findMany();
  }

  async update(id: string, data: UpdateRestaurantDTO): Promise<Restaurant> {
    try {
      return await this.database.restaurant.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (isRecordNotFoundError(error)) throw new NotFoundException(`Restaurant with id ${id} not found.`);
      else throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const deleteRestaurant = this.database.restaurant.delete({
        where: { id },
      });

      const deleteRestaurantProudcts = this.database.product.deleteMany({
        where: { restaurantId: id },
      });

      await this.database.$transaction([deleteRestaurant, deleteRestaurantProudcts]);
    } catch (error) {
      if (isRecordNotFoundError(error)) throw new NotFoundException(`Restaurant with id ${id} not found.`);
      else throw error;
    }
  }
}
