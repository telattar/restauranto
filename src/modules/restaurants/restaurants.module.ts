import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsRepository } from './restaurants.repository';

@Module({
  controllers: [RestaurantsController],
  providers: [RestaurantsService, RestaurantsRepository],
})
export class RestaurantsModule {}
