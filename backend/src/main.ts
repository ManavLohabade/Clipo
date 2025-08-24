import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Swagger documentation - temporarily disabled due to versioning issues
  // const config = new DocumentBuilder()
  //   .setTitle('Clipper DApp API')
  //   .setDescription('Blockchain-powered campaign engagement platform API')
  //   .setVersion('1.0')
  //   .addBearerAuth()
  //   .addTag('auth', 'Authentication endpoints')
  //   .addTag('users', 'User management endpoints')
  //   .addTag('campaigns', 'Campaign management endpoints')
  //   .addTag('engagements', 'Engagement tracking endpoints')
  //   .addTag('web3', 'Blockchain integration endpoints')
  //   .addTag('social-media', 'Social media integration endpoints')
  //   .build();

  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Clipo Backend running on port ${port}`);
  console.log(`