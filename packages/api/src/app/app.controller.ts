import { Controller, Get, Post } from '@nestjs/common';
import { HeartbeatService } from '../heartbeat/heartbeat.service';


@Controller()
export class AppController {
  constructor(private readonly heartbeatService: HeartbeatService) {}

  @Post("heartbeat")
  async callForHeartbeat(): Promise<string> {
    return this.heartbeatService.get();
  }

}
