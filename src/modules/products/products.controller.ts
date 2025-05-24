import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Patch, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { ProductDTO } from './dto/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async createProduct(@Body() data: CreateProductDTO): Promise<{ createdProduct: ProductDTO }> {
    const createdProduct = await this.productsService.create(data);
    return { createdProduct };
  }

  @Get()
  async getAllProducts(): Promise<{ products: ProductDTO[] }> {
    const products = await this.productsService.getAll();
    return { products };
  }

  @Get(':id')
  async getProductById(@Param('id', ParseUUIDPipe) id: string): Promise<{ product: ProductDTO }> {
    const product = await this.productsService.getById(id);
    return { product };
  }

  @Patch(':id')
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateProductDTO,
  ): Promise<{ updatedProduct: ProductDTO }> {
    const updatedProduct = await this.productsService.update(id, data);
    return { updatedProduct };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.productsService.delete(id);
  }
}
