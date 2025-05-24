import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../products.controller';
import { ProductsService } from '../products.service';
import { ProductDTO } from '../dto/product.dto';
import { createFakeProduct } from '../factories/product.factory';
import { faker } from '@faker-js/faker';
import { ProductsRepository } from '../products.repository';
import { DatabaseService } from '../../../database/database.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;
  let mockProducts: ProductDTO[];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService, ProductsRepository, DatabaseService],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
    mockProducts = Array.from({ length: 3 }, () => createFakeProduct());
  });

  it('should return all products', async () => {
    jest.spyOn(service, 'getAll').mockResolvedValueOnce(mockProducts);
    const result = await controller.getAllProducts();

    expect(service.getAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ products: mockProducts });
  });

  it('should return product by id', async () => {
    const product = mockProducts[0];
    jest.spyOn(service, 'getById').mockResolvedValueOnce(product);
    const result = await controller.getProductById(product.id);

    expect(service.getById).toHaveBeenCalledWith(product.id);
    expect(result).toEqual({ product });
  });

  it('should create a product', async () => {
    const newProduct = createFakeProduct();
    jest.spyOn(service, 'create').mockResolvedValueOnce(newProduct);
    const result = await controller.createProduct(newProduct);

    expect(service.create).toHaveBeenCalledWith(newProduct);
    expect(result).toEqual({ createdProduct: newProduct });
  });

  it('should update a product', async () => {
    const product = mockProducts[0];
    const updatedData = { price: faker.number.float() };
    jest.spyOn(service, 'update').mockResolvedValueOnce({ ...product, ...updatedData });
    const result = await controller.updateProduct(product.id, updatedData);

    expect(service.update).toHaveBeenCalledWith(product.id, updatedData);
    expect(result).toEqual({ updatedProduct: { ...product, ...updatedData } });
  });

  it('should delete a product', async () => {
    const product = mockProducts[0];
    jest.spyOn(service, 'delete').mockResolvedValueOnce();
    const result = await controller.deleteProduct(product.id);

    expect(service.delete).toHaveBeenCalledWith(product.id);
    expect(result).toBeUndefined();
  });
});
