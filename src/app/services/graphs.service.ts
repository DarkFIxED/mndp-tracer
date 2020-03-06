import {Injectable} from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class GraphsService {

	constructor() {
	}

	public generateRandomAdjacencyMatrix(devicesCount: number,
										 connectionTriggerFunc: () => boolean,
										 valueGenerationFunc: () => number): Array<number> {
		const matrix = [];

		for (let i = 0; i < devicesCount; i++) {
			let array = new Array(devicesCount).fill(0);
			matrix.push(array);
		}

		for (let row = 0; row < devicesCount; row++) {
			for (let column = row + 1; column < devicesCount; column++) {

				if (connectionTriggerFunc()) {
					let value = Math.floor(valueGenerationFunc());
					matrix[row][column] = value;
					matrix[column][row] = value;
				}
			}
		}

		return matrix;
	}

	public shouldBeConnected(connectionProbability: number): boolean {
		return Math.random() <= connectionProbability;
	}

	public generateSignalPropagationTime(maxValue: number): number {
		return Math.random() * maxValue;
	}

	public getAllConnections(adjacencyMatrix: any[][], num: number): { num: number, value: number }[] {
		return adjacencyMatrix[num]
			.map((value, index) => {
				return {
					num: index,
					value
				};
			})
			.filter(data => !!data.value);
	}

}
