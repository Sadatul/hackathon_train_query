import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URL],
      queue: process.env.RMQ_QUEUE,
      queueOptions: {
        durable: false
      },
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.HEALTH_CHECK_PORT, ()=>{console.log(`Health check service is running on ${process.env.HEALTH_CHECK_PORT}`)});
}
bootstrap();
