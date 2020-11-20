import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.REDIS,
        options: {
          url: process.env.REDIS_URL || 'redis://localhost:6379',
        },
      },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
