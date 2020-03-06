import {Subject} from 'rxjs';
import {MessageModel} from './message.model';

export class DeviceModel {

	public buffer: MessageModel[] = [];
	private messageSent = new Subject<MessageModel>();
	messageSent$ = this.messageSent.asObservable();
	private messageDelivered = new Subject<MessageModel>();
	messageDelivered$ = this.messageDelivered.asObservable();
	private readonly maxBufferSize = 16;

	constructor(public deviceNumber: number) {
	}

	receive(message: MessageModel) {
		this.processMessage(message);
	}

	transmit(message: MessageModel) {
		this.saveMessageToBuffer(message);
		this.messageSent.next(message);
	}

	private processMessage(message: MessageModel) {
		if (this.buffer.some(messageInBuffer => messageInBuffer.id === message.id && messageInBuffer.hop < message.hop)) {
			console.log('Declined');
			return;
		}

		this.saveMessageToBuffer(message);

		if (message.receiver === this.deviceNumber) {
			this.messageDelivered.next(message);

			console.log('Matched');
			return;
		}

		console.log('Transmitted');
		let copyOfMessage = MessageModel.copy(message, this.deviceNumber);
		this.transmit(copyOfMessage);
	}

	private saveMessageToBuffer(message: MessageModel) {
		if (this.buffer.length === this.maxBufferSize) {
			this.buffer.splice(0, 1);
		}

		this.buffer.push(message);
	}
}

