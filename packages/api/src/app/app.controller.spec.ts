import { Test, TestingModule } from '@nestjs/testing';
import { HeartbeatService } from './heartbeat/heartbeat.service';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttModule } from './mqtt/mqtt.module';

describe('AppController', () => {
  let app: TestingModule;
  let heartbeatService: HeartbeatService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [MqttModule],
      controllers: [AppController],
      providers: [AppService, HeartbeatService],
    }).compile();

    heartbeatService = app.get<HeartbeatService>(HeartbeatService);
  });

  describe('callForHeartbeat', () => {
    it('should call get on heartbeatService', () => {
      const appController = app.get<AppController>(AppController);
      const mockedResult = 'test';
      jest.spyOn(heartbeatService, 'get').mockImplementation(() => Promise.resolve(mockedResult))
      appController.callForHeartbeat().then(result => {
      expect(result).toEqual(mockedResult);
      });
    });
  });
});
