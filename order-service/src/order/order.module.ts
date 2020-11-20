import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { IOrderRepository } from './repository/order.repository.interface';
import { InMemoryOrderRepository } from './repository/in-memory-order.repository';
import { FakeUserMiddleware } from '../common/middleware/fake-user.middleware';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORDER_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: process.env.REDIS_URL || 'redis://localhost:6379',
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: IOrderRepository,
      useClass: InMemoryOrderRepository,
    },
  ],
})
export class OrderModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FakeUserMiddleware).forRoutes('api/orders');
  }
}
