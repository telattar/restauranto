import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { OrdersGateway } from './gateways/orders.gateway';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, OrdersGateway],
})
export class OrdersModule {}
