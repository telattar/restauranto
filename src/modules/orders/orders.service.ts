import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDTO } from './dto/create-order.dto';
import { OrderDTO } from './dto/order.dto';
import { UpdateOrderDTO } from './dto/update-orders.dto';
import { OrdersGateway } from './gateways/orders.gateway';
import { GetAllOrdersDTO } from './dto/get-all-orders.dto';

@Injectable()
export class OrdersService {
  constructor(
    private ordersRepository: OrdersRepository,
    private ordersGateway: OrdersGateway,
  ) {}

  async create(data: CreateOrderDTO): Promise<OrderDTO> {
    const createdOrder = await this.ordersRepository.create(data);
    this.ordersGateway.notifyOfCreation();
    return createdOrder;
  }

  async getAll(query: GetAllOrdersDTO): Promise<OrderDTO[]> {
    return this.ordersRepository.findAll(query);
  }

  async getById(id: string): Promise<OrderDTO> {
    return this.ordersRepository.findById(id);
  }

  async update(id: string, data: UpdateOrderDTO): Promise<Partial<OrderDTO>> {
    const updatedOrder = await this.ordersRepository.update(id, data);
    this.ordersGateway.statusUpdate(id, data.status);
    return updatedOrder;
  }
}
