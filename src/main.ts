import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:8080',
    credentials: true,
  });

  app.use(
    helmet({
      contentSecurityPolicy: true,
      referrerPolicy: { policy: 'no-referrer' },
      hidePoweredBy: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
