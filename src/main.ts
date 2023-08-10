import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { parse } from 'yaml';
import { AppModule } from './app.module';
import { resolve } from 'path';
import { cwd } from 'process';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  applyGlobalInterceptors(app);
  applyGlobalPipes(app);
  const document = await loadSwaggerDocument();
  SwaggerModule.setup('doc', app, document);
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Server ready at http://localhost:${port}`);
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
  const docFile = await readFile(resolve(cwd(), 'doc', 'api.yaml'), {
    encoding: 'utf8',
  });
  return parse(docFile);
}

bootstrap();
