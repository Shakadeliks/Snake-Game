import React, { useState, useRef, useEffect } from 'react';
import { useInterval } from './useInterval';
import { CANVAS_SIZE, SNAKE_START, APPLE_START, SCALE, SPEED, DIRECTIONS} from './Constants';
import { BrowserRouter as Router, Link, Switch, Route} from 'react-router-dom';
import Help  from './Help'

const SnakeGame = () => {

    const canvasRef = useRef();
    const [snake, setSnake] = useState(SNAKE_START);
    const [apple, setApple] = useState(APPLE_START);
    const [dir, setDir] = useState([0, -1]);
    const [speed, setSpeed] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [helpDisplay, setHelpDisplay] = useState(false);

    useInterval(() => gameLoop(), speed);

    const endGame = () => {
        setSpeed(null);
        setGameOver(true);
    };
// FUNCTION TO MOVE THE SNAKE UPON PRESSING ANY OF THE DIRECTION BUTTONS

    const moveSnake = ({ keyCode }) =>
        keyCode >= 37 && keyCode <= 40 && setDir(DIRECTIONS[keyCode]);
//FUNCTION TO CREATE A NEW APPLE ON A RANDOM POSITION ON THE BOARD ONCE THE PREVIOUS HAS BEEN EATEN

    const createApple = () =>
        apple.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));
    //function checks if the snake head has collided with a wall and to prevent the snake from colliding with itself

    const checkCollision = (piece, snk = snake) => {
        if (
        piece[0] * SCALE >= CANVAS_SIZE[0] ||
        piece[0] < 0 ||
        piece[1] * SCALE >= CANVAS_SIZE[1] ||
        piece[1] < 0
        )
        return true;

        for (const segment of snk) {
        if (piece[0] === segment[0] && piece[1] === segment[1]) return true;
        }
        return false;
    };
//checks if the snakes head has collided with the apple
    const checkAppleCollision = newSnake => {
        if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
        let newApple = createApple();
        while (checkCollision(newApple, newSnake)) {
            newApple = createApple();
        }
        setApple(newApple);
        return true;
        }
        return false;
    };

    const gameLoop = () => {
        // clone of the snake is needed as the snake is represented by the array and its state cannot be modified

        const snakeCopy = JSON.parse(JSON.stringify(snake));
        const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]];
        snakeCopy.unshift(newSnakeHead);
        if (checkCollision(newSnakeHead)) endGame();
        if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
        setSnake(snakeCopy);
    };

    const startGame = () => {
        setSnake(SNAKE_START);
        setApple(APPLE_START);
        setDir([0, -1]);
        setSpeed(SPEED);
        setGameOver(false);
    };
// useeffect for the cnvas ref allows for the dimensions needed to make the different parts of the game
    useEffect(() => {
        const context = canvasRef.current.getContext("2d");
        context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        context.fillStyle = "black";
        snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
        context.fillStyle = "red";
        context.fillRect(apple[0], apple[1], 1, 1);
    }, [snake, apple, gameOver]);

    return (
        <Router>
            <div role="button" tabIndex="0" onKeyDown={e => moveSnake(e)}>
            <canvas
                style={{ border: "1px solid black" }}
                ref={canvasRef}
                width={`${CANVAS_SIZE[0]}px`}
                height={`${CANVAS_SIZE[1]}px`}
            />
            {gameOver && <div>GAME OVER!</div>}
            <button onClick={startGame}>Start Game</button>
            
            </div>

            <button onClick={ () => setHelpDisplay(!helpDisplay) }>Help</button>

            { helpDisplay ? 
            <div>
                <p> The game is simple, maneuver the snake with the arrow keys to eat as many of red apples as you can</p>

                <p>If you touch the walls with the head of the snake, you die. If the head of the snake touches any part of the snakes body, you die. If you press an arrow key in the opposite direction that the snake is moving, the snake will colide with itself and you die.</p>

                <p>Press the start game button when you are ready to play and make sure to click on the board if the arrow keys are not mving the snake for you.</p>
            </div> : null }
            
        
        </Router>
        
    );
};

export default SnakeGame;
