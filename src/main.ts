import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { TransformationInterception } from './common/interceptors/resposeInterceptor';
import { HttpExceptionFilter } from './common/exceptions/http-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Global configurations
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformationInterception());
  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('ARB - Back End')
    .setDescription('ARB - Back End')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);

  app.use(
    bodyParser.json({
      limit: '50mb',
    }),
  );

  app.use(
    bodyParser.urlencoded({
      limit: '50mb',
      extended: true,
    }),
  );

  // //Compress response
  app.use(compression());

  //Activate CORS
  app.enableCors();

  app.use(morgan('dev'));

  //Exceptions filter
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen(process.env.PORT, async () => {
    Logger.log(`App listening on port ${process.env.PORT}`, await app.getUrl());
  });
}

bootstrap();
