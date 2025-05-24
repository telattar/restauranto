import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDTO } from './dto/create-restaurant.dto';
import { RestaurantDTO } from './dto/restaurant.dto';
import { UpdateRestaurantDTO } from './dto/update-restaurant.dto';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  async createRestaurant(@Body() createRestaurantDto: CreateRestaurantDTO): Promise<{
    createdRestaurant: RestaurantDTO;
  }> {
    const createdRestaurant = await this.restaurantsService.create(createRestaurantDto);
    return { createdRestaurant };
  }

  //lets assume that this API gets called at some website's homepage,
  //and that website is used by 1m users
  //we can cache the response of the api for 30s to save time and improve performance
  //assuming restaurants only get created/updated once every now and then
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30)
  @Get()
  @CacheKey('all_restaurants')
  async getAllRestaurants(): Promise<{ restaurants: RestaurantDTO[] }> {
    const restaurants = await this.restaurantsService.getAll();
    return { restaurants };
  }

  @Get(':id')
  async getRestaurant(@Param('id', ParseUUIDPipe) id: string): Promise<{ restaurant: RestaurantDTO }> {
    const restaurant = await this.restaurantsService.getById(id);
    return { restaurant };
  }

  @Patch(':id')
  async updateRestaurant(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDTO,
  ): Promise<{ updatedRestaurant: RestaurantDTO }> {
    const updatedRestaurant = await this.restaurantsService.update(id, updateRestaurantDto);
    return { updatedRestaurant };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRestaurant(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.restaurantsService.delete(id);
  }
}
