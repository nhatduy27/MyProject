import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concert } from '../entities/concert.entity';
import { Order } from '../entities/order.entity';
import { Ticket } from '../entities/ticket.entity';
import { User } from '../entities/user.entity';
import { Guest } from '../entities/guest.entity';
import { GuestService } from './guest.service';
import { GuestController } from './guest.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Concert, Order, Ticket, User, Guest])],
  providers: [GuestService],
  controllers: [GuestController],
})
export class GuestModule {}
