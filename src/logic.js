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
    //              - Don't hit yourself.
    // Use information in gameState to prevent your Battlesnake from colliding with others.
    const allSnakes = gameState.board.snakes;

    snakes.forEach((s) => {
        const snakeBody= s.body;

        snakeBody.forEach((coord, i) => {
            if (i === snakeBody.length - 1) return // You can move onto people's tails
            if (coord.x === myHead.x - 1 && coord.y === myHead.y) {
                possibleMoves.left = 0
            } else if (coord.x === myHead.x + 1 && coord.y === myHead.y) {
                possibleMoves.right = 0
            } else if (coord.y === myHead.y - 1 && coord.x === myHead.x) {
                possibleMoves.down = 0
            } else if (coord.y === myHead.y + 1 && coord.x === myHead.x) {
                possibleMoves.up = 0
            }
        });
    });

    // TODO: Step 4 - Find food.
    // Use information in gameState to seek out and find food.

        // Avoid food until we need to eat

    if(Object.values(possibleMoves).filter(Boolean).length > 1) {
        const food = gameState.board.food

        if (gameState.you.health > 10){
            food.forEach(f => {
                if (myHead.x === f.x - 1 && myHead.y === f.y) {
                    possibleMoves.right = false
                }
                if (myHead.x === f.x + 1 && myHead.y === f.y) {
                    possibleMoves.left = false
                }
                if (myHead.y === f.y + 1 && myHead.x === f.x) {
                    possibleMoves.up = false
                }
                if (myHead.y === f.y - 1 && myHead.x === f.x) {
                    possibleMoves.down = false
                }
            });
        } else {
            food.forEach(f => {
                if (myHead.x === f.x - 1 && myHead.y === f.y) {
                    possibleMoves.right = true
                    possibleMoves.left = false
                    possibleMoves.up = false
                    possibleMoves.down = false
                }
                if (myHead.x === f.x + 1 && myHead.y === f.y) {
                    possibleMoves.left = true
                    possibleMoves.right = false
                    possibleMoves.up = false
                    possibleMoves.down = false
                }
                if (myHead.y === f.y + 1 && myHead.x === f.x) {
                    possibleMoves.up = true
                    possibleMoves.left = false
                    possibleMoves.down = false
                    possibleMoves.right = false
                }
                if (myHead.y === f.y - 1 && myHead.x === f.x) {
                    possibleMoves.down = true
                    possibleMoves.left = false
                    possibleMoves.up = false
                    possibleMoves.right = false
                }
            });
        }
    }

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
