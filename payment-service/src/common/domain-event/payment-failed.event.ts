export class PaymentFailed {
  constructor(public readonly data: { orderId: string }) {}
}
