import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { Product } from '@prisma/client';
import { UpdateProductDTO } from './dto/update-product.dto';
import { isRecordNotFoundError } from '../../utils/database.util';

@Injectable()
export class ProductsRepository {
  constructor(private database: DatabaseService) {}

  async create(data: CreateProductDTO): Promise<Product> {
    return await this.database.product.create({
      data,
    });
  }

  async findAll(): Promise<Product[]> {
    return await this.database.product.findMany();
  }

  async findById(id: string): Promise<Product> {
    const product = await this.database.product.findUnique({
      where: { id },
    });

    if (!product) throw new NotFoundException(`Product with id ${id} not found.`);

    return product;
  }

  async update(id: string, data: UpdateProductDTO): Promise<Product> {
    try {
      return await this.database.product.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (isRecordNotFoundError(error)) throw new NotFoundException(`Product with id ${id} not found.`);
      else throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.database.product.delete({
        where: { id },
      });
    } catch (error) {
      if (isRecordNotFoundError(error)) throw new NotFoundException(`Product with id ${id} not found.`);
      else throw error;
    }
  }
}
