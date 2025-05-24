import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../orders.service';
import { OrdersRepository } from '../orders.repository';
import { OrderDTO } from '../dto/order.dto';
import { DatabaseService } from '../../../database/database.service';
import { createFakeOrder } from '../factories/orders.factory';
import { OrdersGateway } from '../gateways/orders.gateway';
import { CreateOrderDTO } from '../dto/create-order.dto';
import { ORDERS_STATUS } from '../constants/orders.constants';

describe('OrdersService', () => {
  let service: OrdersService;
  let repository: OrdersRepository;
  let mockOrders: OrderDTO[];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService, OrdersRepository, OrdersGateway, DatabaseService],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repository = module.get<OrdersRepository>(OrdersRepository);
    mockOrders = Array.from({ length: 5 }, () => createFakeOrder());
  });

  it('should get all orders', async () => {
    jest.spyOn(OrdersRepository.prototype, 'findAll').mockResolvedValueOnce(mockOrders);
    const orders = await service.getAll({ page: 1, limit: 5 });

    expect(OrdersRepository.prototype.findAll).toHaveBeenCalledTimes(1);
    expect(orders).toEqual(mockOrders);
  });

  it('should get order by id', async () => {
    const order = mockOrders[0];
    jest.spyOn(OrdersRepository.prototype, 'findById').mockResolvedValueOnce(order);
    const result = await service.getById(order.id);

    expect(OrdersRepository.prototype.findById).toHaveBeenCalledWith(order.id);
    expect(result).toEqual(order);
  });

  it('should create an order', async () => {
    const newOrder = createFakeOrder();
    jest.spyOn(OrdersRepository.prototype, 'create').mockResolvedValueOnce(newOrder);
    jest.spyOn(OrdersGateway.prototype, 'notifyOfCreation').mockImplementation(() => {});
    const result = await service.create(newOrder as CreateOrderDTO);

    expect(OrdersRepository.prototype.create).toHaveBeenCalledWith(newOrder);
    expect(OrdersGateway.prototype.notifyOfCreation).toHaveBeenCalledTimes(1);
    expect(result).toEqual(newOrder);
  });

  it('should update an order', async () => {
    const order = mockOrders[0];
    const updatedData = { status: ORDERS_STATUS.OUT_FOR_DELIVERY };
    jest.spyOn(OrdersRepository.prototype, 'update').mockResolvedValueOnce({ ...order, ...updatedData });
    jest.spyOn(OrdersGateway.prototype, 'statusUpdate').mockImplementation(() => {});
    const result = await service.update(order.id, updatedData);

    expect(OrdersRepository.prototype.update).toHaveBeenCalledWith(order.id, updatedData);
    expect(OrdersGateway.prototype.statusUpdate).toHaveBeenCalledWith(order.id, updatedData.status);
    expect(result).toEqual({ ...order, ...updatedData });
  });
});
