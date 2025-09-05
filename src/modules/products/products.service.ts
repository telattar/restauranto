import { ProductsRepository } from './products.repository';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { ProductDTO } from './dto/product.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async create(data: CreateProductDTO): Promise<ProductDTO> {
    return this.productsRepository.create(data);
  }

  async getById(id: string): Promise<ProductDTO> {
    return this.productsRepository.findById(id);
  }

  async update(id: string, data: UpdateProductDTO): Promise<ProductDTO> {
    return this.productsRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.productsRepository.delete(id);
  }
}
