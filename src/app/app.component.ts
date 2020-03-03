import {Component, OnInit} from '@angular/core';
import {Edge, Node} from '@swimlane/ngx-graph';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'LoRa-Modeling';
  devicesCount = 10;
  adjacencyMatrix = [];

  nodes: Node[] = [];
  links: Edge[] = [];

  private readonly connectionProbability = 0.3;
  private readonly minSensitivity = -130;

  ngOnInit() {
    console.log('init');
    this.adjacencyMatrix = this.fillAdjacencyMatrix(this.devicesCount, this.connectionProbability, this.minSensitivity);
    console.log(this.adjacencyMatrix);

    this.nodes = this.buildNodes(this.adjacencyMatrix);
    this.links = this.buildLinks(this.adjacencyMatrix);
  }

  private fillAdjacencyMatrix(devicesCount: number, connectionProbability: number, minSensitivity: number): Array<number> {
    const matrix = [];
    for (let i = 0; i < devicesCount; i++) {
      let array = new Array(devicesCount).fill(0);
      matrix.push(array);
    }

    for (let row = 0; row < devicesCount; row++) {
      for (let column = row + 1; column < devicesCount; column++) {

        if (this.shouldBeConnected(connectionProbability)) {
          let signalStrength = Math.floor(this.generateSignalStrength(minSensitivity));
          matrix[row][column] = signalStrength;
          matrix[column][row] = signalStrength;
        }
      }
    }

    return matrix;
  }

  private shouldBeConnected(connectionProbability: number): boolean {
    return Math.random() <= connectionProbability;
  }

  private generateSignalStrength(minSensitivity: number): number {
    return Math.random() * minSensitivity;
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
