const createPlayer = (name, mark) => {
    return {
        name,
        mark
    }
}

const DisplayMessages = (() => {
    const messageSpan = document.querySelector("#message");

        const gameOverMessage = (message) => {
            messageSpan.innerText = message
        }

        const playerTurnMessage = (message) => {
            messageSpan.innerText = message
        }
    
    return {
        gameOverMessage,
        playerTurnMessage
    }
})();

const Game = (() => {
        let players = [];
        let currentPlayerIndex;
        let gameOver;

        const messageSpan = document.querySelector("#message");
        const boxs = document.querySelectorAll(".box");

        let boardState = ["", "", "", "", "", "", "", "", ""]

        const handleClick = (e) => {
            if (gameOver) return; // if game is over it will do nothing

            let index = parseInt(e.target.id);
            if (boardState[index] !== "") return; // If the box is already filled, do nothing.

            // Update the board state
            boardState[index] = players[currentPlayerIndex].mark;
            e.target.innerText = players[currentPlayerIndex].mark;

            // Check if the current player won
            if (checkForWin(boardState, players[currentPlayerIndex].mark)) {
                gameOver = true;
                DisplayMessages.gameOverMessage(`${players[currentPlayerIndex].name} won!`)
            } else if (checkForTie(boardState)) {
                gameOver = true
                DisplayMessages.gameOverMessage(`it's a tie!`)
            }

            // Color the box if it's "O"
            if (e.target.innerText === "O") {
                e.target.classList.add("red-box");
            } else {
                e.target.classList.remove("red-box");
            }

            if (!gameOver) {
                // Switch player
                currentPlayerIndex = currentPlayerIndex ? 0 : 1;
                
                if (currentPlayerIndex === 0) {
                    DisplayMessages.playerTurnMessage(`${players[0].name}'s turn!`);
                    messageSpan.classList.remove("red-message");
                } else {
                    DisplayMessages.playerTurnMessage(`${players[1].name}'s turn!`);
                    messageSpan.classList.add("red-message");
                }
            }
            
        }

        const playGame = () => {
            boxs.forEach((box) => {
                box.addEventListener("click", handleClick);
            })
        }

        const player1 = document.querySelector("#form1");
        const player2 = document.querySelector("#form2");
        const form = document.querySelector(".game-form");

        const start = () => {
            players = [
                createPlayer(player1.value, "X"),
                createPlayer(player2.value, "O")
            ]
            
            currentPlayerIndex = 0;
            gameOver = false;
            
            // can't play if player's name empty
            if (player1.value === "" || player2.value === "") return;

            form.style.display = "none";
            document.querySelector(".overlay").style.display = "none";
            
            // will display messages when game start
            DisplayMessages.playerTurnMessage(`${players[0].name}'s turn!`)

            playGame()
        }

        const restart = () => {
            // Reset the board state
            boardState = ["", "", "", "", "", "", "", "", ""];

            // clear box(DOM)
            boxs.forEach((box) => {
                box.innerHTML = ""
            })

            //reset the game state
            currentPlayerIndex = 0;
            gameOver = false;

            // reattach event listeners
            playGame()

            messageSpan.classList.remove("red-message"); // restart the color of message to blue(normal)
            DisplayMessages.playerTurnMessage(`${players[0].name}'s turn!`) // Display player's 1 turn  in the first turn
        }

        const newGame = () => {
            player1.value = "";
            player2.value = "";

            form.style.display = "block";
            document.querySelector(".overlay").style.display = "block";
            
            restart();
        }
    return {
        start,
        restart,
        newGame
    }
})();

function checkForWin(board) {
    const winningCombination = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < winningCombination.length; i++) {
        const [a, b, c] = winningCombination[i];

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true
        }
    }
    return false
}

function checkForTie(board) {
    return board.every(cell => cell !== "");
}

const startGameBtn = document.querySelector(".start-btn");
startGameBtn.addEventListener('click', (e) => {
    e.preventDefault();
    Game.start();
})

const restartBtn = document.querySelector("#restart-btn");
restartBtn.addEventListener('click', () => {
    Game.restart();
})

const newGameBtn = document.querySelector("#new-game-btn");
newGameBtn.addEventListener("click", () => {
    Game.newGame();
})