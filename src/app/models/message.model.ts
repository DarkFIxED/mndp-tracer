import * as uuid from 'uuid-random';

export class MessageModel {
	public id: string;

	constructor(public sender: number,
				public receiver: number,
				public transmitter: number,
				public payload: any,
				public hop = 0,
				id?: string) {
		if (!id) {
			this.id = uuid();
		} else {
			this.id = id;
		}
	}

	static copy(message: MessageModel, transmitter: number): MessageModel {
		return new MessageModel(message.sender, message.receiver, transmitter, message.payload, message.hop + 1, message.id);
	}
}
