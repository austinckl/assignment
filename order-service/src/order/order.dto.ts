import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty()
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
