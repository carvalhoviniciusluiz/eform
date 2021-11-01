import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { useContainer } from 'typeorm';
import { AppModule } from 'app.module';
import { AppLogger } from 'app.logger';
import { enableCors } from 'cors.service';
import { enableSwagger } from 'swagger.service';
import * as ENV from './constants';
import { DefaultExceptionsFilter } from './common';

class Main {
  static async bootstrap() {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(), {
      logger: new AppLogger()
    });
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        disableErrorMessages: ENV.IS_PROD,
        forbidUnknownValues: true
      })
    );
    app.use(helmet());
    app.use(rateLimit({ windowMs: 60 * 1000, max: 1000 }));
    app.useGlobalFilters(new DefaultExceptionsFilter());
    enableCors(app);
    enableSwagger(app);
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    const port = process.env.PORT || ENV.APP_PORT;

    await app
      .listen(port, () => {
        Logger.verbose(`Listen on ${port} 🙌 `, Main.name);
      })
      .catch(error => Logger.error(error));
  }
}
Main.bootstrap();
