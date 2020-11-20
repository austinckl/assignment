export class OrderCreated {
  constructor(
    public readonly data: {
      id: string;
      item: string;
      user: {
        name: string;
        phone: string;
      };
    },
  ) {}
}
