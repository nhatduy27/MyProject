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

@Module({
  imports: [
    // Pino logger — pino-pretty ở dev cho dễ đọc, JSON thuần ở production
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const isDev = config.get<string>('NODE_ENV') !== 'production';
        return {
          pinoHttp: {
            // Mức log tối thiểu: debug ở dev, info ở production
            level: isDev ? 'debug' : 'info',
            transport: isDev
              ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  singleLine: true,        // mỗi log 1 dòng, dễ đọc hơn
                  translateTime: 'HH:MM:ss', // giờ local thay vì epoch
                  ignore: 'pid,hostname',  // bỏ bớt trường ít dùng
                },
              }
              : undefined, // production — JSON thuần để đẩy vào Datadog/Loki
            // Ghi đè serializer mặc định để request log gọn hơn
            serializers: {
              req: (req) => ({ method: req.method, url: req.url }),
              res: (res) => ({ statusCode: res.statusCode }),
            },
            // Không log route health check để giảm noise
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
        synchronize: true, // Use only for dev/prototype
      }),
      inject: [ConfigService],
    }),
    // ====== BULLMQ - DÙNG REDIS_URL (FIX: dùng object connection) ======
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL') ?? 'redis://localhost:6379';
        // Parse URL để lấy host, port, password
        const url = new URL(redisUrl);
        return {
          connection: {
            host: url.hostname,
            port: parseInt(url.port || '6379'),
            password: url.password || undefined,
            maxRetriesPerRequest: 3,
            retryStrategy: (times: number) => {
              if (times > 5) return null;
              return Math.min(times * 100, 3000);
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    // ====== REDIS MODULE - DÙNG REDIS_URL ======
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL') ?? 'redis://localhost:6379';
        return {
          type: 'single',
          url: redisUrl,
          options: {
            lazyConnect: false,
            maxRetriesPerRequest: 3,
            enableReadyCheck: true,
          },
        };
      },
      inject: [ConfigService],
    }),
    // ====== THROTTLER - DÙNG REDIS_URL ======
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const redisUrl = config.get<string>('REDIS_URL') ?? 'redis://localhost:6379';
        return {
          throttlers: [
            {
              ttl: 1000,
              limit: 10,
            },
          ],
          storage: new ThrottlerStorageRedisService(
            new Redis(redisUrl, {
              maxRetriesPerRequest: 3,
              retryStrategy: (times) => {
                if (times > 5) return null;
                return Math.min(times * 100, 3000);
              },
            })
          ),
        };
      },
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
    { provide: APP_GUARD, useClass: JwtAuthGuard }
  ],
})
export class AppModule {}