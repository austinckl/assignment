import { Order } from './order.entity';
import { OrderResponseDto } from './order.dto';

export class OrderMapper {
  public static toInMemoryPersistence(order: Order): any {
    return {
      id: order.id,
      item: order.item,
      state: order.state,
      user: order.user,
    };
  }

  public static toDto(order: Order): OrderResponseDto {
    return {
      id: order.id,
      item: order.item,
      state: order.state,
      user: order.user,
    };
  }
}
