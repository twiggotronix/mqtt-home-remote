import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, IClientOptions, MqttClient, IPublishPacket } from 'mqtt';

@Injectable()
export class MqttService  implements OnModuleInit{
    private mqttClient: MqttClient;
    private messageCallbacks = {};
    constructor(private configService: ConfigService) {}

    public onModuleInit() {
        const host = this.configService.get<string>('MQTT_HOST');
        const port = this.configService.get<string>('MQTT_PORT');
        const protocol = this.configService.get<'mqtt' | 'ws' | 'mqtts'>('MQTT_PROTOCOL');

        const connectUrl = `${protocol}://${host}:${port}`;
        const mqttConfigOptions = this.mqttConfigOptions();

        this.mqttClient = connect(connectUrl, mqttConfigOptions);

        this.mqttClient.on("connect", function () {
            console.log(`Connected to ${connectUrl} with user ${mqttConfigOptions.username}`);
        });

        this.mqttClient.on("error", function () {
            console.error(`Error in connecting to ${connectUrl}`);
        });

        this.mqttClient.on('message', (topic, payload, packet) =>  {
            console.log(`message recieved on ${topic}`, payload.toString())
            if(this.messageCallbacks[topic]) {
                this.messageCallbacks[topic](payload, packet);
            }
        });
    }
    
    public publish(topic: string, payload: string, retain = false): Promise<void> {
        console.log(`Publishing to ${topic}`);
        return new Promise((resolve, reject) => {
            this.mqttClient.publish(topic, payload, { retain }, (err) => {
                !err ? resolve() : reject(err);
            });
        });
    }
    
    public subscribe(topic: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.mqttClient.subscribe(topic, null, (err) => {                
                !err ? resolve() : reject(err);
            })
        });
    }
    
    public unsubscribe(topic: string): void {
        console.log(`Unsubscibe from ${topic}`);
        this.mqttClient.unsubscribe(topic);
    }

    public registerMessageCallback(topic: string, callback: (payload: Buffer, packet: IPublishPacket) => void): void {
        this.messageCallbacks[topic] = callback ;
    }

    private mqttConfigOptions(): IClientOptions {
        const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

        return {
            clientId,
            clean: true,
            connectTimeout: 4000,
            username: this.configService.get<string>('MQTT_USER'),
            password: this.configService.get<string>('MQTT_PASSWORD'),
            reconnectPeriod: 1000,
        };
    }
}
