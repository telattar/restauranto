import { Test, TestingModule } from '@nestjs/testing';
import { OrdersGateway } from '../gateways/orders.gateway';
import { faker } from '@faker-js/faker';
import { ORDERS_STATUS } from '../constants/orders.constants';
import { Logger } from '@nestjs/common';

describe('OrdersGateway', () => {
  let gateway: OrdersGateway;

  // mocking socket.io server
  const mockServer = {
    emit: jest.fn(),
  } as any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersGateway],
    }).compile();

    gateway = module.get<OrdersGateway>(OrdersGateway);
    gateway.server = mockServer;
  });

  it('should emit an event order-status with payload', () => {
    const orderId = faker.string.uuid();
    const updatedStatus = ORDERS_STATUS.DELIVERED;
    gateway.statusUpdate(orderId, updatedStatus);

    expect(mockServer.emit).toHaveBeenCalledWith('order-status', {
      orderId: orderId.split('-')[0],
      status: updatedStatus,
    });
  });

  it('should emit an event for a created-order', () => {
    gateway.notifyOfCreation();

    expect(mockServer.emit).toHaveBeenCalledWith('created-order');
  });

  it('should log client connection', () => {
    jest.spyOn(Logger, 'log').mockImplementationOnce(() => {});
    const fakeClient = { id: faker.string.ulid() };

    gateway.handleConnection(fakeClient);

    expect(Logger.log).toHaveBeenCalledWith(`Client id: ${fakeClient.id} connected`);
  });

  it('should log client disconnection', () => {
    jest.spyOn(Logger, 'log').mockImplementationOnce(() => {});
    const fakeClient = { id: faker.string.ulid() };

    gateway.handleDisconnect(fakeClient);

    expect(Logger.log).toHaveBeenCalledWith(`Cliend id:${fakeClient.id} disconnected`);
  });
});
