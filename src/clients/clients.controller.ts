import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@ApiTags('Clientes')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService, private readonly prisma: PrismaService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Busca dados completos do cliente (Saldo)' })
  findOne(@Param('id') id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  @Post()
  @ApiOperation({ summary: 'Cadastra um novo correntista' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso.' })
  @ApiResponse({ status: 409, description: 'Conflito: Chave PIX ou Email já existem.' })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os clientes' })
  findAll() {
    return this.clientsService.findAll();
  }

  @Get('pix/:key')
  @ApiOperation({ summary: 'Busca dados de um recebedor pela Chave PIX' })
  @ApiResponse({ status: 200, description: 'Retorna ID e Nome para confirmação.' })
  @ApiResponse({ status: 404, description: 'Chave não encontrada.' })
  findByPix(@Param('key') key: string) {
    return this.clientsService.findByPix(key);
  }


}