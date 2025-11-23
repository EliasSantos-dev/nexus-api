import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  // Cria um novo cliente
  async create(dto: CreateClientDto) {
    // Verifica se e-mail ou PIX já existem para dar erro amigável
    const exists = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email },
          { pixKey: dto.pixKey }
        ]
      }
    });

    if (exists) {
      throw new ConflictException('Email ou Chave PIX já cadastrados.');
    }

    return this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        pixKey: dto.pixKey,
        balance: 0, // Começa com zero
      },
    });
  }

  // Busca por Chave PIX (A mágica do "Transferir para...")
  async findByPix(key: string) {
    const client = await this.prisma.user.findUnique({
      where: { pixKey: key },
      select: {
        id: true,
        fullName: true,
        pixKey: true,
        // NÃO retornamos o saldo ou email por privacidade na busca pública
      },
    });

    if (!client) {
      throw new NotFoundException('Chave PIX não encontrada.');
    }

    return client;
  }

  // Lista todos (útil para debug)
  findAll() {
    return this.prisma.user.findMany();
  }
}