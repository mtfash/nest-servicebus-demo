import { Controller, Get, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller({
  path: 'notifications',
  version: '1',
})
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('/all/:username')
  async findAll(@Param('username') username: string) {
    return this.notificationsService.findAll(username);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return this.notificationsService.find(id);
  }
}
