import Grid from './dijkstra';

function info() {
    console.log("INFO")
    const response = {
        apiversion: "1",
        author: "Priyanshu",
        color: "#75cdfe",
        head: "all-seeing",
        tail: "mystic-moon"
    }
    return response
}

function start(gameState) {
    console.log(`${gameState.game.id} START`)
}

function end(gameState) {
    console.log(`${gameState.game.id} END\n`)
}

function move(gameState) {
    let possibleMoves = {
        up: true,
        down: true,
        left: true,
        right: true
    }

    // Step 0: Don't let your Battlesnake move back on its own neck
    const myHead = gameState.you.head
    const myNeck = gameState.you.body[1]
    if (myNeck.x < myHead.x) {
        possibleMoves.left = false
    } else if (myNeck.x > myHead.x) {
        possibleMoves.right = false
    } else if (myNeck.y < myHead.y) {
        possibleMoves.down = false
    } else if (myNeck.y > myHead.y) {
        possibleMoves.up = false
    }

    // TODO: Step 1 - Don't hit walls.
    // Use information in gameState to prevent your Battlesnake from moving beyond the boundaries of the board.
    const boardWidth = gameState.board.width
    const boardHeight = gameState.board.height
    if (myHead.y === 0) {
        possibleMoves.down = false
    }
    if (myHead.y === boardHeight -1) {
        possibleMoves.up = false
    }
    if (myHead.x === boardWidth - 1 ) {
        possibleMoves.right = false
    }
    if (myHead.x === 0) {
        possibleMoves.left = false
    }


    // TODO: Step 2 - Don't hit yourself.
    // Use information in gameState to prevent your Battlesnake from colliding with itself.
    const mybody = gameState.you.body;

    mybody.forEach((b) => {
        if (myHead.x === b.x - 1 && myHead.y === b.y) {
            possibleMoves.right = false;
        }
        if (myHead.x === b.x + 1 && myHead.y === b.y) {
            possibleMoves.left = false;
        }
        if (myHead.y === b.y - 1 && myHead.x === b.x) {
            possibleMoves.up = false;
        }
        if (myHead.y === b.y + 1 && myHead.x === b.x) {
            possibleMoves.down = false;
        }
    });

    // TODO: Step 3 - Don't collide with others.
    // Use information in gameState to prevent your Battlesnake from colliding with others.
    const snakes = gameState.board.snakes;

    snakes.forEach((s) => {
        const snakeBody= s.body;

        snakeBody.forEach((b) => {
            if (myHead.x === b.x - 1 && myHead.y === b.y) {
                possibleMoves.right = false;
              }
              if (myHead.x === b.x + 1 && myHead.y === b.y) {
                possibleMoves.left = false;
              }
              if (myHead.y === b.y - 1 && myHead.x === b.x) {
                possibleMoves.up = false;
              }
              if (myHead.y === b.y + 1 && myHead.x === b.x) {
                possibleMoves.down = false;
              }
        });
    });


    const grid = new Grid(gameState, myHead);
    let chosenPath = [];
    // Find the closest food
    gameState.board.food.forEach((food) => {
        try {
            const path = grid.findPath(myHead, food);
            if (!chosenPath.length || path.length < chosenPath.length) {
                chosenPath = path;
            }
        }
        catch (error) {
            // console.log(`${gameState.game.id} ${gameState.you.id} no path to food`)
        }
    });
    // Move to my own tail otherwise
    if (!chosenPath.length) {
        try {
            const path = grid.findPath(myHead, gameState.you.body[gameState.you.length - 1]);
            if (path.length > 1) { // Gotta have space
                // TODO: Make sure we don't hit our tail right after eating
                chosenPath = path;
            }
        }
        catch (error) {
            // console.log(`${gameState.game.id} ${gameState.you.id} no path to my tail`)
        }
    }
    if (chosenPath.length > 1) {
        const direction = getDirection(myHead, chosenPath[1], gameState);
        response.move = direction;
    }

    /*
    Gets a direction string from the coordinate we receive from dijkstra's function
*/
function getDirection(start, key) {
    const [keyX, keyY] = key.split(',');
    const end = { x: parseInt(keyX), y: parseInt(keyY) };
    if (start.x === end.x) {
        // same row
        if (start.y + 1 === end.y)
            return 'up';
        if (start.y - 1 === end.y)
            return 'down';
    }
    if (start.y === end.y) {
        // same column
        if (start.x + 1 === end.x)
            return 'right';
        if (start.x - 1 === end.x)
            return 'left';
    }
}


    // TODO: Step 4 - Find food.
    // Use information in gameState to seek out and find food.

    //     // Avoid food until we need to eat

    // if(Object.values(possibleMoves).filter(Boolean).length > 1) {
    //     const food = gameState.board.food

    //     if (gameState.you.health > 10){
    //         food.forEach(f => {
    //             if (myHead.x === f.x - 1 && myHead.y === f.y) {
    //                 possibleMoves.right = false
    //             }
    //             if (myHead.x === f.x + 1 && myHead.y === f.y) {
    //                 possibleMoves.left = false
    //             }
    //             if (myHead.y === f.y + 1 && myHead.x === f.x) {
    //                 possibleMoves.up = false
    //             }
    //             if (myHead.y === f.y - 1 && myHead.x === f.x) {
    //                 possibleMoves.down = false
    //             }
    //         });
    //     } else {
    //         food.forEach(f => {
    //             if (myHead.x === f.x - 1 && myHead.y === f.y) {
    //                 possibleMoves.right = true
    //                 possibleMoves.left = false
    //                 possibleMoves.up = false
    //                 possibleMoves.down = false
    //             }
    //             if (myHead.x === f.x + 1 && myHead.y === f.y) {
    //                 possibleMoves.left = true
    //                 possibleMoves.right = false
    //                 possibleMoves.up = false
    //                 possibleMoves.down = false
    //             }
    //             if (myHead.y === f.y + 1 && myHead.x === f.x) {
    //                 possibleMoves.up = true
    //                 possibleMoves.left = false
    //                 possibleMoves.down = false
    //                 possibleMoves.right = false
    //             }
    //             if (myHead.y === f.y - 1 && myHead.x === f.x) {
    //                 possibleMoves.down = true
    //                 possibleMoves.left = false
    //                 possibleMoves.up = false
    //                 possibleMoves.right = false
    //             }
    //         });
    //     }
    // }

    // Finally, choose a move from the available safe moves.
    // TODO: Step 5 - Select a move to make based on strategy, rather than random.
    const safeMoves = Object.keys(possibleMoves).filter(key => possibleMoves[key])
    const response = {
        move: safeMoves[Math.floor(Math.random() * safeMoves.length)],
    }

    console.log(`${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`)
    return response
}



module.exports = {
    info: info,
    start: start,
    move: move,
    end: end
}
