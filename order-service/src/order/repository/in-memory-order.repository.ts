import { Injectable, NotFoundException } from '@nestjs/common';

import { IOrderRepository } from './order.repository.interface';
import { Order, OrderProps } from '../order.entity';
import { OrderMapper } from '../order.mapper';

@Injectable()
export class InMemoryOrderRepository implements IOrderRepository {
  private orders: any = {}; // hash map

  async save(order: Order): Promise<Order> {
    this.orders[order.id] = OrderMapper.toInMemoryPersistence(order);

    return order;
  }

  async update(order: Order): Promise<Order> {
    const inmemoryOrder = this.orders[order.id];
    if (!inmemoryOrder) {
      throw new NotFoundException('Record not found');
    }

    this.orders[order.id] = OrderMapper.toInMemoryPersistence(order);

    return order;
  }

  async getById(id: string): Promise<Order> {
    const inmemoryOrder = this.orders[id];
    if (!inmemoryOrder) {
      throw new NotFoundException('Record not found');
    }

    const orderProps: OrderProps = {
      item: inmemoryOrder.item,
      state: inmemoryOrder.state,
      user: inmemoryOrder.user,
    };

    const order = new Order(orderProps, inmemoryOrder.id);

    return order;
  }
}
