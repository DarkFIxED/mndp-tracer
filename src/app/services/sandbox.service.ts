import {Injectable} from '@angular/core';
import {DeviceModel} from '../models/device.model';
import {GraphsService} from './graphs.service';
import {MessageModel} from '../models/message.model';

@Injectable({
	providedIn: 'root'
})
export class SandboxService {

	deviceCount = 0;
	devices: DeviceModel[] = [];
	adjacencyMatrix = [];
	timer = 0;

	signals: {
		message: MessageModel,
		time: number,
		receiver: number
	}[] = [];

	constructor(private graphsService: GraphsService) {
	}

	initialize(deviceCount: number, connectionProbability: number, maxSignalPropagationTime: number) {
		this.deviceCount = deviceCount;

		let self = this;

		let connectionProbabilityFunc = function() {
			return self.graphsService.shouldBeConnected(connectionProbability);
		};

		let valueGenerationFunc = function() {
			return self.graphsService.generateSignalPropagationTime(maxSignalPropagationTime);
		};

		this.adjacencyMatrix = this.graphsService.generateRandomAdjacencyMatrix(this.deviceCount,
			connectionProbabilityFunc, valueGenerationFunc);

		for (let i = 0; i < deviceCount; i++) {
			let device = new DeviceModel(i);
			device.messageSent$.subscribe(message => this.onMessageSent(message, device));
			device.messageDelivered$.subscribe(message => this.onMessageDelivered(message, device));
			this.devices.push(device);
		}
	}

	trace(from: number, to: number, payload?: any) {
		this.timer = 0;
		this.signals = [];

		let message = new MessageModel(from, to, from, payload);
		let startDevice = this.getDevice(from);

		startDevice.transmit(message);

		while (this.signals.length > 0) {
			this.tick();
		}
	}

	private onMessageSent(message: MessageModel, device: DeviceModel) {
		let connections = this.graphsService.getAllConnections(this.adjacencyMatrix, device.deviceNumber);

		this.signals.push(
			...connections.map(connection => {
				return {
					message,
					time: this.timer + connection.value,
					receiver: connection.num
				};
			}));
	}

	private onMessageDelivered(message: MessageModel, device: DeviceModel) {
		console.log(`Delivered: timer: ${this.timer}`);
		console.log(message);
	}

	private getDevice(num: number): DeviceModel {
		return this.devices.filter(device => device.deviceNumber === num)[0];
	}

	private tick() {
		if (this.signals.length === 0) {
			return;
		}

		this.signals = this.signals.sort((a, b) => a.time - b.time);

		console.log(JSON.parse(JSON.stringify(this.signals)));

		let currentSignal = this.signals[0];
		this.timer = currentSignal.time;

		this.signals.splice(0, 1);

		console.log(`Id: ${currentSignal.message.id}. From: ${currentSignal.message.transmitter}. To: ${currentSignal.receiver}. Hop: ${currentSignal.message.hop}. Time: ${currentSignal.time}`);

		let receiver = this.getDevice(currentSignal.receiver);
		receiver.receive(currentSignal.message);
	}
}
