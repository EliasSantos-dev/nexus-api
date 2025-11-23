import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsUUID, Min } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ example: 'uuid-do-remetente' })
  @IsUUID()
  @IsNotEmpty()
  senderId: string;

  @ApiProperty({ example: 'uuid-do-recebedor' })
  @IsUUID()
  @IsNotEmpty()
  receiverId: string;

  @ApiProperty({ example: 100.50, description: 'Valor deve ser positivo' })
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  amount: number;
}