import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Request,
} from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

import { OrderService } from './order.service';
import { CreateOrderDto } from './order.dto';
import { OrderProps } from './order.entity';
import { PaymentSuccess } from '../common/domain-event/payment-success.event';
import { PaymentFailed } from '../common/domain-event/payment-failed.event';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/api/orders')
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    const orderProps: OrderProps = {
      item: createOrderDto.item,
      user: {
        name: req.user.name, // FakeUserMiddler
        phone: req.user.phone, // FakeUserMiddler
      },
    };

    return await this.orderService.createOrder(orderProps);
  }

  @Delete('/api/orders/:id')
  async cancelOrder(@Param('id') id: string) {
    return await this.orderService.cancelOrder(id);
  }

  @Get('/api/orders/:id')
  async getOrder(@Param('id') id: string) {
    return await this.orderService.getOrder(id);
  }

  @EventPattern('PaymentSuccess')
  async handlePaymentSuccess({ data }: PaymentSuccess) {
    this.orderService.confirmOrder(data.orderId);

    setTimeout(() => {
      this.orderService.deliverOrder(data.orderId);
    }, 15000);
  }

  @EventPattern('PaymentFailed')
  async handlerPaymentFailed({ data }: PaymentFailed) {
    this.orderService.cancelOrder(data.orderId);
  }
}
