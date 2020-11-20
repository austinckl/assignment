import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

import { PaymentService } from './payment.service';
import { OrderCreated } from '../common/domain-event/order-created.event';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @EventPattern('OrderCreated')
  async handleOrderCreated({ data }: OrderCreated) {
    this.paymentService.processPayment(data.id);
  }
}
