import { Test, TestingModule } from '@nestjs/testing';
import { HeartbeatService } from './heartbeat.service';
import { MqttModule } from '../mqtt/mqtt.module';

describe('HeartbeatService', () => {
  let service: HeartbeatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MqttModule],
      providers: [HeartbeatService],
    }).compile();

    service = module.get<HeartbeatService>(HeartbeatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
