import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { CreateOrderDTO } from './dto/create-order.dto';
import { UpdateOrderDTO } from './dto/update-orders.dto';
import { OrdersService } from './orders.service';
import { OrderDTO } from './dto/order.dto';
import { GetAllOrdersDTO } from './dto/get-all-orders.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() data: CreateOrderDTO): Promise<{ createdOrder: OrderDTO }> {
    const createdOrder = await this.ordersService.create(data);
    return { createdOrder };
  }

  @Get()
  async getAllOrders(@Query() query: GetAllOrdersDTO): Promise<{ orders: OrderDTO[] }> {
    const orders = await this.ordersService.getAll(query);
    return { orders };
  }

  @Get(':id')
  async getOrderById(@Param('id', ParseUUIDPipe) id: string): Promise<{ order: OrderDTO }> {
    const order = await this.ordersService.getById(id);
    return { order };
  }

  @Patch(':id')
  async updateOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateOrderDTO,
  ): Promise<{ updatedOrder: Partial<OrderDTO> }> {
    const updatedOrder = await this.ordersService.update(id, data);
    return { updatedOrder };
  }
}
