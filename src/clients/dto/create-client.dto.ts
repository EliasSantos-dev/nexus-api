
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ example: 'Elias Santos' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'elias@nexus.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'elias@nexus.com', description: 'Chave PIX única (Email, CPF, etc)' })
  @IsString()
  @IsOptional() // Pode ser criado sem, e adicionado depois
  pixKey?: string;
}