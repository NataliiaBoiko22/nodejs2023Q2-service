import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { parse } from 'yaml';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  applyGlobalInterceptors(app);
  applyGlobalPipes(app);
  const document = await loadSwaggerDocument();
  SwaggerModule.setup('doc', app, document);
  const port = process.env.PORT || 4000;
  await app.listen(port);
}
function applyGlobalInterceptors(app) {
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
}
function applyGlobalPipes(app) {
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
}
async function loadSwaggerDocument() {
  const rootDirname = dirname(__dirname);
  const docFile = await readFile(join(rootDirname, 'doc', 'api.yaml'), 'utf-8');
  return parse(docFile);
}

bootstrap();
