import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products.service';
import { ProductsRepository } from '../products.repository';
import { ProductDTO } from '../dto/product.dto';
import { DatabaseService } from '../../../database/database.service';
import { createFakeProduct } from '../factories/product.factory';
import { faker } from '@faker-js/faker';

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: ProductsRepository;
  let mockProducts: ProductDTO[];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, ProductsRepository, DatabaseService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<ProductsRepository>(ProductsRepository);
    mockProducts = Array.from({ length: 3 }, () => createFakeProduct());
  });

  it('should get all products', async () => {
    jest.spyOn(ProductsRepository.prototype, 'findAll').mockResolvedValueOnce(mockProducts);
    const products = await service.getAll();

    expect(ProductsRepository.prototype.findAll).toHaveBeenCalledTimes(1);
    expect(products).toEqual(mockProducts);
  });

  it('should get product by id', async () => {
    const product = mockProducts[0];
    jest.spyOn(ProductsRepository.prototype, 'findById').mockResolvedValueOnce(product);
    const result = await service.getById(product.id);

    expect(ProductsRepository.prototype.findById).toHaveBeenCalledWith(product.id);
    expect(result).toEqual(product);
  });

  it('should create a product', async () => {
    const newProduct = createFakeProduct();
    jest.spyOn(ProductsRepository.prototype, 'create').mockResolvedValueOnce(newProduct);
    const result = await service.create(newProduct);

    expect(ProductsRepository.prototype.create).toHaveBeenCalledWith(newProduct);
    expect(result).toEqual(newProduct);
  });

  it('should update a product', async () => {
    const product = mockProducts[0];
    const updatedData = { price: faker.number.float({ min: 10, max: 100, fractionDigits: 2 }) };
    jest.spyOn(ProductsRepository.prototype, 'update').mockResolvedValueOnce({ ...product, ...updatedData });
    const result = await service.update(product.id, updatedData);

    expect(ProductsRepository.prototype.update).toHaveBeenCalledWith(product.id, updatedData);
    expect(result).toEqual({ ...product, ...updatedData });
  });

  it('should delete a product', async () => {
    const { id } = mockProducts[0];
    jest.spyOn(ProductsRepository.prototype, 'delete').mockResolvedValueOnce(undefined);
    await service.delete(id);

    expect(ProductsRepository.prototype.delete).toHaveBeenCalledWith(id);
  });
});
