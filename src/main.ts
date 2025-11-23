import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ativa validação automática dos DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove campos que não estão no DTO
    forbidNonWhitelisted: true, // Erro se enviar campo extra
  }));

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Nexus API - Core Banking')
    .setDescription('API de alta integridade para transações financeiras.')
    .setVersion('1.0')
    .addTag('Transações')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();