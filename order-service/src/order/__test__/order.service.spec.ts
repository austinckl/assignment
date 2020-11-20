import { v4 as uuidv4 } from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';

import { OrderService } from '../order.service';
import { IOrderRepository } from '../repository/order.repository.interface';
import { InMemoryOrderRepository } from '../repository/in-memory-order.repository';

describe('OrderService', () => {
  let app: TestingModule;
  let orderService: OrderService;

  const mockClientProxy = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [],
      providers: [
        OrderService,
        {
          provide: IOrderRepository,
          useClass: InMemoryOrderRepository,
        },
        {
          provide: 'ORDER_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    }).compile();
    orderService = app.get<OrderService>(OrderService);
  });

  it('create new order', async () => {
    const order = await orderService.createOrder({
      item: 'Fake item',
      user: {
        name: 'Fake User',
        phone: '0123456789',
      },
    });

    expect(order.id).toBeDefined();
    expect(order.item).toBe('Fake item');
    expect(order.state).toBe('created');
    expect(order.user.name).toBe('Fake User');
    expect(order.user.phone).toBe('0123456789');
    expect(mockClientProxy.emit).toHaveBeenCalledTimes(1);
  });

  it('get order', async () => {
    const { id } = await orderService.createOrder({
      item: 'Fake item',
      user: {
        name: 'Fake User',
        phone: '0123456789',
      },
    });

    const order = await orderService.getOrder(id);
    expect(order.id).toBeDefined();
    expect(order.item).toBe('Fake item');
    expect(order.state).toBe('created');
    expect(order.user.name).toBe('Fake User');
    expect(order.user.phone).toBe('0123456789');
  });

  it('order not found', async () => {
    const uuid = uuidv4();

    await expect(async () => {
      await orderService.getOrder(uuid);
    }).rejects.toThrow('Record not found');
  });

  it('confirm order', async () => {
    const order = await orderService.createOrder({
      item: 'Fake item',
      user: {
        name: 'Fake User',
        phone: '0123456789',
      },
    });

    expect(order.state).toBe('created');
    const orderAfterConfirmed = await orderService.confirmOrder(order.id);
    expect(orderAfterConfirmed.state).toBe('confirmed');
  });

  it('deliver order', async () => {
    const order = await orderService.createOrder({
      item: 'Fake item',
      user: {
        name: 'Fake User',
        phone: '0123456789',
      },
    });

    expect(order.state).toBe('created');
    const orderAfterConfirmed = await orderService.confirmOrder(order.id);
    expect(orderAfterConfirmed.state).toBe('confirmed');
    const orderAfterDelivered = await orderService.deliverOrder(order.id);
    expect(orderAfterDelivered.state).toBe('delivered');
  });
});
