import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateOrderDTO, ProductWithQuantityDTO } from './dto/create-order.dto';
import { ORDERS_STATUS } from './constants/orders.constants';
import { UpdateOrderDTO } from './dto/update-orders.dto';
import { isRecordNotFoundError } from '../../utils/database.util';
import { OrderDTO } from './dto/order.dto';
import { Order, Product } from '@prisma/client';
import { GetAllOrdersDTO } from './dto/get-all-orders.dto';

@Injectable()
export class OrdersRepository {
  constructor(private database: DatabaseService) {}

  calculateTotalPrice({
    productsWithPrices,
    orderedProducts,
  }: {
    productsWithPrices: Partial<Product>[];
    orderedProducts: ProductWithQuantityDTO[];
  }): number {
    let total = 0;
    for (const product of productsWithPrices) {
      total +=
        product.price * orderedProducts.find((orderedProduct) => orderedProduct.productId === product.id).quantity;
    }

    return total;
  }

  async create(data: CreateOrderDTO): Promise<OrderDTO> {
    const { restaurantId, orderProducts: products } = data;

    const productsWithPrices = await this.database.product.findMany({
      where: { id: { in: products.map((product) => product.productId) } },
      select: { id: true, price: true },
    });

    return await this.database.order.create({
      data: {
        restaurantId,
        status: ORDERS_STATUS.SUBMITTED,
        totalPrice: this.calculateTotalPrice({ productsWithPrices, orderedProducts: products }),
        orderProducts: {
          create: products,
        },
      },
      include: { orderProducts: true },
    });
  }

  // assume that the orders will be a lot (millions of records)
  // so we will paginate our results to prevent the extra load on both the client and the server
  async findAll(query: GetAllOrdersDTO): Promise<OrderDTO[]> {
    const { restaurants, page, limit } = query;
    const offset = (page - 1) * limit;

    let orders = await this.database.order.findMany({
      where: restaurants ? { restaurant: { name: { in: restaurants } } } : {},
      include: {
        orderProducts: { select: { product: true, quantity: true } },
      },
      skip: offset,
      take: limit,
    });

    return orders;
  }

  async findById(id: string): Promise<OrderDTO> {
    const order = await this.database.order.findUnique({
      where: { id },
      include: {
        orderProducts: true,
      },
    });

    if (!order) throw new NotFoundException(`Order with id ${id} not found.`);

    return order;
  }

  async update(id: string, data: UpdateOrderDTO): Promise<Order> {
    try {
      return await this.database.order.update({ where: { id }, data });
    } catch (error) {
      if (isRecordNotFoundError(error)) throw new NotFoundException(`Order with id ${id} not found.`);
    }
  }
}
