import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { JwtAuthGuard } from './common/guards/jwt.strategy';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConcertModule } from './concert/concert.module';
import { BookingModule } from './booking/booking.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { User } from './entities/user.entity';
import { Otp } from './entities/otp.entity';
import { Concert } from './entities/concert.entity';
import { TicketType } from './entities/ticket-type.entity';
import { Order } from './entities/order.entity';
import { Ticket } from './entities/ticket.entity';
import { Guest } from './entities/guest.entity';
import { PaymentModule } from './payment/payment.module';
import { TicketModule } from './ticket/ticket.module';
import { MailModule } from './mail/mail.module';
import { RolesGuard } from './common/guards/roles.guard';

// ====== TẠO 1 REDIS CLIENT DUY NHẤT ======
const createRedisClient = (configService: ConfigService) => {
  const url = configService.get<string>('REDIS_URL');
  return new Redis(url, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      if (times > 5) return null;
      return Math.min(times * 100, 3000);
    },
    lazyConnect: false,
    enableReadyCheck: true,
  });
};

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const isDev = config.get<string>('NODE_ENV') !== 'production';
        return {
          pinoHttp: {
            level: isDev ? 'debug' : 'info',
            transport: isDev
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    singleLine: true,
                    translateTime: 'HH:MM:ss',
                    ignore: 'pid,hostname',
                  },
                }
              : undefined,
            serializers: {
              req: (req) => ({ method: req.method, url: req.url }),
              res: (res) => ({ statusCode: res.statusCode }),
            },
            autoLogging: {
              ignore: (req) => req.url === '/health',
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [User, Otp, Concert, TicketType, Order, Ticket, Guest],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    // ====== BULLMQ - DÙNG REDIS_URL ======
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: new Redis(configService.get<string>('REDIS_URL') ?? 'redis://localhost:6379', {
          maxRetriesPerRequest: 3,
          retryStrategy: (times) => {
            if (times > 5) return null;
            return Math.min(times * 100, 3000);
          },
        }),
      }),
      inject: [ConfigService],
    }),
    // ====== REDIS MODULE - DÙNG REDIS_URL ======
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: configService.get<string>('REDIS_URL') ?? 'redis://localhost:6379',
        options: {
          lazyConnect: false,
          maxRetriesPerRequest: 3,
          enableReadyCheck: true,
        },
      }),
      inject: [ConfigService],
    }),
    // ====== THROTTLER - DÙNG CHUNG REDIS_URL ======
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: 1000,
            limit: 10,
          },
        ],
        storage: new ThrottlerStorageRedisService(
          new Redis(config.get<string>('REDIS_URL') ?? 'redis://localhost:6379', {
            maxRetriesPerRequest: 3,
            retryStrategy: (times) => {
              if (times > 5) return null;
              return Math.min(times * 100, 3000);
            },
          })
        ),
      }),
    }),
    AuthModule,
    ConcertModule,
    BookingModule,
    PaymentModule,
    TicketModule,
    MailModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}