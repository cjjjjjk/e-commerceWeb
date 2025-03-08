import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  app.setGlobalPrefix('api', { exclude: [''] }); 
  //   app.useGlobalPipes(new ValidationPipe({
  //   whitelist: true
  // }));

  await app.listen(port);
  console.log(`Server running on port: ${port}`)
}
bootstrap();
