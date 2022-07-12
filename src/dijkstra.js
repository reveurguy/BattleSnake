import * as dijkstra from 'dijkstrajs';
export default class Grid {
    constructor(gameState) {
        this.game = gameState.game;
        this.graph = {};
        this.board = gameState.board;
        this.you = gameState.you;
        this.buildGrid();
    }
    buildGrid() {
        // Initial variables
        this.graph = {};
        const graph = this.graph;
        const boardWidth = this.board.width;
        const boardHeight = this.board.height;
        // For every tile in the board, set the default weight of every edge
        for (let y = 0; y < boardHeight; y++) {
            for (let x = 0; x < boardWidth; x++) {
                const key = this.keyName({ x, y });
                const edges = {};
                if (x > 0)
                    edges[`${x - 1},${y}`] = boardWidth - x + 10; // to the left
                if (x < boardWidth - 1)
                    edges[`${x + 1},${y}`] = x + 10; // to the right
                if (y > 0)
                    edges[`${x},${y - 1}`] = boardHeight - y + 10;
                if (y < boardHeight - 1)
                    edges[`${x},${y + 1}`] = y + 10;
                graph[key] = edges;
            }
        }
        // Increase the weight of edges to Hazard tiles
        const hazardDamagePerTurn = this.game.ruleset.settings.hazardDamagePerTurn;
        this.board.hazards.forEach((hazard) => {
            this.setAllEdges(hazard, hazardDamagePerTurn * 10);
        });
        // Increase the weight of edges to other snake bodies
        this.board.snakes.forEach((snake) => {
            // If the snake's gonna die this turn, ignore it
            if (snake.id !== this.you.id
                && snake.health === 1
                && !this.board.food.some((food) => this.findDistance(snake.head, food) === 1)) {
                return;
            }
            snake.body.forEach((coord, i) => {
                const distance = this.findDistance(snake.head, coord);
                if (distance >= (snake.length - i))
                    return; // It's gonna be gone then
                // There's a miniscule chance that the snake might run out of health or
                // Move out of bounds and be removed before our move resolves
                // So it's better to move into another snake than into a wall.
                const weight = (snake.id === this.you.id) ? -1 : 1000000 + snake.health;
                this.setAllEdges(coord, weight);
            });
        });
        this.graph = graph;
    }
    /*
        Uniformly name the key based on its coordinate
    */
    keyName(coord) {
        return `${coord.x},${coord.y}`;
    }
    /*
        Get all the adjacent keys of a coordinate
    */
    adjKeys(coord) {
        const boardWidth = this.board.width;
        const boardHeight = this.board.height;
        return [
            { x: coord.x, y: coord.y + 1 },
            { x: coord.x, y: coord.y - 1 },
            { x: coord.x + 1, y: coord.y },
            { x: coord.x - 1, y: coord.y }
        ];
    }
    /*
        Set all the edges going to a key
    */
    setAllEdges(coord, value) {
        const graph = this.graph;
        const adjCoords = this.adjKeys(coord);
        const coordKey = this.keyName(coord);
        adjCoords.forEach((adjCoord) => {
            const adjKey = this.keyName(adjCoord);
            if (graph[adjKey] && graph[adjKey][coordKey]) {
                const edges = graph[adjKey];
                if (!edges[coordKey])
                    return;
                if (value === -1)
                    delete edges[coordKey];
                else
                    edges[coordKey] = value;
            }
        });
    }
    findPath(start, coord) {
        return dijkstra.find_path(this.graph, this.keyName(this.start), this.keyName(coord));
    }
    findDistance(start, coord) {
        return dijkstra.find_path(this.graph, this.keyName(start), this.keyName(coord)).length - 1;
    }
}
