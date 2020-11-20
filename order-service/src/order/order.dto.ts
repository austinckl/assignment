import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  item: string;
}

export interface OrderResponseDto {
  id: string;
  item: string;
  state: string;
  user: {
    name: string;
    phone: string;
  };
}
