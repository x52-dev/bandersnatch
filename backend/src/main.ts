import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express'; 
import { join } from 'path'; 
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve the 'uploads' folder publicly
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', 
  });

  // CORS setup
  app.enableCors({
    origin: [
      'http://localhost:5173', 
      'http://localhost:8080', 
      'http://127.0.0.1:5173',
      'http://127.0.0.1:8080',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, 
  });

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('LMS Platform API') 
    .setDescription('The API documentation for the Video Learning platform') 
    .setVersion('1.0') 
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // SDE II FIX: Moved Swagger to '/api-docs' to prevent collision with the global prefix
  SwaggerModule.setup('api-docs', app, document);

  // All backend routes will now cleanly start with /api
  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();