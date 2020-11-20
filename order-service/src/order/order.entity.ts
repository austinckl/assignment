import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface OrderProps {
  item: string;
  state?: 'created' | 'confirmed' | 'cancelled' | 'delivered';
  user: {
    name: string;
    phone: string;
  };
}

export class Order {
  private _id: string;
  private props: OrderProps;

  constructor(orderProps: OrderProps, id?: string) {
    this._id = id ? id : uuidv4();
    this.props = orderProps;

    if (!this.props.state) {
      this.props.state = 'created'; // Default value
    }
  }

  get id() {
    return this._id;
  }

  get item() {
    return this.props.item;
  }

  get state() {
    return this.props.state;
  }

  get user() {
    return this.props.user;
  }

  cancelOrder() {
    if (this.props.state === 'cancelled') {
      throw new BadRequestException('Order already cancelled');
    }

    if (this.props.state === 'delivered') {
      throw new BadRequestException('Order already delivered');
    }

    this.props.state = 'cancelled';
  }

  confirmOrder() {
    if (this.props.state === 'cancelled') {
      throw new BadRequestException('Order already cancelled');
    }

    if (this.props.state === 'confirmed') {
      throw new BadRequestException('Order already confirmed');
    }

    if (this.props.state === 'delivered') {
      throw new BadRequestException('Order already delivered');
    }

    this.props.state = 'confirmed';
  }

  deliverOrder() {
    if (this.props.state === 'created') {
      throw new BadRequestException('Order is not confirmed yet');
    }

    if (this.props.state === 'cancelled') {
      throw new BadRequestException('Order already cancelled');
    }

    if (this.props.state === 'delivered') {
      throw new BadRequestException('Order already delivered');
    }

    this.props.state = 'delivered';
  }
}
