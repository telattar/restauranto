import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class GetAllOrdersDTO {
  @IsString({ each: true })
  @MinLength(1, { message: 'restaurants must have at least one restaurant name' })
  @IsOptional()
  restaurants?: string[];

  @Type(() => Number)
  @IsInt()
  @Min(0)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  limit: number = 10;
}
