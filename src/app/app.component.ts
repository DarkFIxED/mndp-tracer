import {Component, OnInit} from '@angular/core';
import {Edge, Node} from '@swimlane/ngx-graph';
import {SandboxService} from './services/sandbox.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	title = 'LoRa-Modeling';

	private readonly devicesCount = 10;
	private readonly connectionProbability = 0.3;
	private readonly maxSignalPropagationTime = 130;

	nodes: Node[] = [];
	links: Edge[] = [];

	constructor(private sandbox: SandboxService) {
	}

	ngOnInit() {
		this.sandbox.initialize(this.devicesCount, this.connectionProbability, this.maxSignalPropagationTime);

		console.log(this.sandbox.adjacencyMatrix);

		this.nodes = this.buildNodes(this.sandbox.adjacencyMatrix);
		this.links = this.buildLinks(this.sandbox.adjacencyMatrix);

		this.sandbox.trace(2, 8);
	}

	private buildNodes(adjacencyMatrix: any[]) {
		return adjacencyMatrix.map((row, index) => {
			return {
				id: `${index}`,
				label: `${index}`
			};
		});
	}

	private buildLinks(adjacencyMatrix: any[]) {
		let result: Edge[] = [];

		for (let row = 0; row < adjacencyMatrix.length; row++) {
			for (let column = row + 1; column < adjacencyMatrix.length; column++) {
				let signal = adjacencyMatrix[row][column];

				if (signal) {
					result.push({
						id: `link-${row}-${column}`,
						label: `${signal}`,
						source: `${row}`,
						target: `${column}`
					});
				}
			}
		}

		return result;
	}
}
