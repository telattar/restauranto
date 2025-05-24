import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../orders.controller';
import { OrdersService } from '../orders.service';
import { OrderDTO } from '../dto/order.dto';
import { OrdersRepository } from '../orders.repository';
import { DatabaseService } from '../../../database/database.service';
import { OrdersGateway } from '../gateways/orders.gateway';
import { createFakeOrder } from '../factories/orders.factory';
import { CreateOrderDTO } from '../dto/create-order.dto';
import { ORDERS_STATUS } from '../constants/orders.constants';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;
  let mockOrders: OrderDTO[];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrdersService, OrdersRepository, DatabaseService, OrdersGateway],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
    mockOrders = Array.from({ length: 5 }, () => createFakeOrder());
  });

  it('should return all orders', async () => {
    jest.spyOn(service, 'getAll').mockResolvedValueOnce(mockOrders);
    const result = await controller.getAllOrders({ page: 1, limit: 5 });

    expect(service.getAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ orders: mockOrders });
  });

  it('should return order by id', async () => {
    const order = mockOrders[0];
    jest.spyOn(service, 'getById').mockResolvedValueOnce(order);
    const result = await controller.getOrderById(order.id);

    expect(service.getById).toHaveBeenCalledWith(order.id);
    expect(result).toEqual({ order });
  });

  it('should create an order', async () => {
    const newOrder = createFakeOrder();
    jest.spyOn(service, 'create').mockResolvedValueOnce(newOrder);
    const result = await controller.createOrder(newOrder as CreateOrderDTO);

    expect(service.create).toHaveBeenCalledWith(newOrder);
    expect(result).toEqual({ createdOrder: newOrder });
  });

  it('should update an order', async () => {
    const order = mockOrders[0];
    const updatedData = { status: ORDERS_STATUS.DELIVERED };
    jest.spyOn(service, 'update').mockResolvedValueOnce({ ...order, ...updatedData });
    const result = await controller.updateOrder(order.id, updatedData);

    expect(service.update).toHaveBeenCalledWith(order.id, updatedData);
    expect(result).toEqual({ updatedOrder: { ...order, ...updatedData } });
  });
});
