import { CreateRestaurantDTO } from './create-restaurant.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateRestaurantDTO extends PartialType(CreateRestaurantDTO) {}
