import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { Order, OrderProps } from './order.entity';
import { OrderMapper } from './order.mapper';
import { IOrderRepository } from './repository/order.repository.interface';
import { OrderCreated } from '../common/domain-event/order-created.event';

@Injectable()
export class OrderService {
  constructor(
    @Inject('IOrderRepository') private readonly orderRepo: IOrderRepository,
    @Inject('ORDER_SERVICE') private readonly client: ClientProxy,
  ) {}

  async createOrder(orderProps: OrderProps) {
    const order = new Order(orderProps);
    await this.orderRepo.save(order);

    // Publish order created event
    this.client.emit(
      'OrderCreated',
      new OrderCreated({
        id: order.id,
        item: order.item,
        user: order.user,
      }),
    );

    return OrderMapper.toDto(order);
  }

  async getOrder(id: string) {
    const order = await this.orderRepo.getById(id);

    return OrderMapper.toDto(order);
  }

  async cancelOrder(id: string) {
    const order = await this.orderRepo.getById(id);
    order.cancelOrder();
    await this.orderRepo.update(order);

    return OrderMapper.toDto(order);
  }

  async confirmOrder(id: string) {
    const order = await this.orderRepo.getById(id);
    order.confirmOrder();
    await this.orderRepo.update(order);

    return OrderMapper.toDto(order);
  }

  async deliverOrder(id: string) {
    const order = await this.orderRepo.getById(id);
    order.deliverOrder();
    await this.orderRepo.update(order);

    return OrderMapper.toDto(order);
  }
}
