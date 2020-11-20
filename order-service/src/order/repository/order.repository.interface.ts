import { Order } from '../order.entity';

export abstract class IOrderRepository {
  abstract save(order: Order): Promise<Order>;
  abstract update(order: Order): Promise<Order>;
  abstract getById(id: string): Promise<Order>;
}
