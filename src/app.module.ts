import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { QueryModule } from './query/query.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    // envFilePath: '.env',
  }),
  TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,  // Set to false in production
  }), QueryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
