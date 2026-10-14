import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './shared/filters/http-exception.filter.js';
async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new AllExceptionsFilter());
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    logger.log(`🚀 GYM Backend corriendo exitosamente en: http://localhost:${port}`);
    logger.log(`📌 Documentación de endpoints disponible en el README`);
}
await bootstrap();
//# sourceMappingURL=main.js.map