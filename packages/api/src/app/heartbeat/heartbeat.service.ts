import { Injectable } from '@nestjs/common';
import { MqttService } from '../mqtt/mqtt.service';

@Injectable()
export class HeartbeatService {
    private static TOPIC = '/heartbeat';
    private static RESPONSE_TOPIC = '/heartbeat-response';
    constructor(private readonly mqttService: MqttService) {}

    public get(): Promise<string> {
        return this.subscribe() 
        .then(() => new Promise<string>(resolve => {
                this.mqttService.registerMessageCallback(HeartbeatService.RESPONSE_TOPIC, (payload, packet) => {
                        console.log(HeartbeatService.RESPONSE_TOPIC, payload.toString(), packet.qos)
                
                        resolve(payload.toString());
                });
                this.mqttService.publish(HeartbeatService.TOPIC, null, false).then();
        }))
        .finally(() => {
            this.mqttService.unsubscribe(HeartbeatService.RESPONSE_TOPIC);            
        });
    }

    

    private subscribe(): Promise<void> {
        return this.mqttService.subscribe(HeartbeatService.RESPONSE_TOPIC);
    }
}
