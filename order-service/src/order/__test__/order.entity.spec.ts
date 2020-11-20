import { v4 as uuidv4 } from 'uuid';

import { Order, OrderProps } from '../order.entity';

const uuid = uuidv4();
const orderPropsWithoutState: OrderProps = {
  item: 'Fake item',
  user: {
    name: 'Fake User',
    phone: '0123456789',
  },
};

describe('Order Entity Business Rules', () => {
  it('generate random uuid if no id passed to constructor', async () => {
    const order = new Order({ ...orderPropsWithoutState });

    expect(order.id).toBeDefined();
    expect(order.state).toEqual('created');
  });

  describe('cancel order function', () => {
    it('not allow to cancel order if order state = "cancelled"', async () => {
      const order = new Order(
        {
          ...orderPropsWithoutState,
          state: 'cancelled',
        },
        uuid,
      );

      expect(() => {
        order.cancelOrder();
      }).toThrow('Order already cancelled');
    });

    it('not allow to cancel order if order state = "delivered"', async () => {
      const order = new Order(
        {
          ...orderPropsWithoutState,
          state: 'delivered',
        },
        uuid,
      );

      expect(() => {
        order.cancelOrder();
      }).toThrow('Order already delivered');
    });

    it('successfully cancel order if state = "created"', async () => {
      const order = new Order({ ...orderPropsWithoutState }, uuid);

      expect(order.state).toEqual('created');
      order.cancelOrder();
      expect(order.state).toEqual('cancelled');
    });

    it('successfully cancel order if state = "confirmed"', async () => {
      const order = new Order(
        { ...orderPropsWithoutState, state: 'confirmed' },
        uuid,
      );

      expect(order.state).toEqual('confirmed');
      order.cancelOrder();
      expect(order.state).toEqual('cancelled');
    });
  });

  describe('confirm order function', () => {
    it('not allow to confirm order if order state = "confirmed"', async () => {
      const order = new Order(
        {
          ...orderPropsWithoutState,
          state: 'confirmed',
        },
        uuid,
      );

      expect(() => {
        order.confirmOrder();
      }).toThrow('Order already confirmed');
    });

    it('not allow to confirm order if order state = "cancelledstate =', async () => {
      const order = new Order(
        {
          ...orderPropsWithoutState,
          state: 'cancelled',
        },
        uuid,
      );

      expect(() => {
        order.confirmOrder();
      }).toThrow('Order already cancelled');
    });

    it('not allow to confirm order if order state = "delivered"', async () => {
      const order = new Order(
        {
          ...orderPropsWithoutState,
          state: 'delivered',
        },
        uuid,
      );

      expect(() => {
        order.confirmOrder();
      }).toThrow('Order already delivered');
    });

    it('successfully confirm order if state = "created"', async () => {
      const order = new Order(
        {
          ...orderPropsWithoutState,
        },
        uuid,
      );

      expect(order.state).toEqual('created');
      order.confirmOrder();
      expect(order.state).toEqual('confirmed');
    });
  });

  describe('deliver order function', () => {
    it('not allow to deliver order if order state = "created"', async () => {
      const order = new Order(
        {
          ...orderPropsWithoutState,
        },
        uuid,
      );

      expect(() => {
        order.deliverOrder();
      }).toThrow('Order is not confirmed yet');
    });

    it('not allow to deliver order if order state = "cancelled"', async () => {
      const order = new Order(
        {
          ...orderPropsWithoutState,
          state: 'cancelled',
        },
        uuid,
      );

      expect(() => {
        order.deliverOrder();
      }).toThrow('Order already cancelled');
    });

    it('not allow to deliver order if order already "delivered"', async () => {
      const order = new Order(
        {
          ...orderPropsWithoutState,
          state: 'delivered',
        },
        uuid,
      );

      expect(() => {
        order.deliverOrder();
      }).toThrow('Order already delivered');
    });

    it('successfully deliver order if state = "confirmed"', async () => {
      const order = new Order(
        {
          ...orderPropsWithoutState,
          state: 'confirmed',
        },
        uuid,
      );

      expect(order.state).toEqual('confirmed');
      order.deliverOrder();
      expect(order.state).toEqual('delivered');
    });
  });
});
