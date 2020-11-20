import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { PaymentSuccess } from '../common/domain-event/payment-success.event';
import { PaymentFailed } from '../common/domain-event/payment-failed.event';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('PAYMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  async processPayment(orderId: string) {
    // 50% success rate
    const randomInt = Math.floor(Math.random() * 10);
    if (randomInt % 2 === 0) {
      // Success
      // Publish event
      this.client.emit('PaymentSuccess', new PaymentSuccess({ orderId }));
    } else {
      // Failed
      // Publish event
      this.client.emit('PaymentFailed', new PaymentFailed({ orderId }));
    }

    return;
  }
}
