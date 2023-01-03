import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HeartbeatService } from '../heartbeat/heartbeat.service';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttModule } from './mqtt/mqtt.module';

@Module({
  imports: [ConfigModule.forRoot(), MqttModule],
  controllers: [AppController],
  providers: [AppService, HeartbeatService],
})
export class AppModule {}
