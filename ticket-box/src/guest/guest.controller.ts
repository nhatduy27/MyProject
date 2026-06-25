import { Controller, Get, Patch, Delete, Body, Param, Query, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GuestService } from './guest.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/entities/user.entity';
import {  GetAdminGuestsQueryDto, AdminCreateGuestDto, AdminUpdateGuestDto } from './dto/guest.dto';

@Controller('admin')
@Roles(UserRole.ORGANIZER)
export class GuestController {
  constructor(private readonly guestService: GuestService) {}


  @Post('guests')
  createGuest(@Body() body: AdminCreateGuestDto) {
    return this.guestService.createGuest(body);
  }

  @Get('guests')
  getGuests(@Query() query: GetAdminGuestsQueryDto) {
    return this.guestService.getGuests(query);
  }

  @Patch('guests/:id')
  updateGuest(@Param('id') id: string, @Body() body: AdminUpdateGuestDto) {
    return this.guestService.updateGuest(id, body);
  }

  @Delete('guests/:id')
  deleteGuest(@Param('id') id: string) {
    return this.guestService.deleteGuest(id);
  }

  @Post('guests/import-csv/:concertId')
  @UseInterceptors(FileInterceptor('file'))
  importGuestsCSV(
    @Param('concertId') concertId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('File không được upload');
    }
    return this.guestService.importGuestsFromCSV(concertId, file.buffer);
  }
}
