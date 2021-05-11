import React from 'react'

function Help() {
    return (
        <div>
            <p> The game is simple, maneuver the snake with the arrow keys to eat as many of red apples as you can</p>

            <p>If you touch the walls with the head of the snake, you die. If the head of the snake touches any part of the snakes body, you die. If you press an arrow key in the opposite direction that the snake is moving, the snake will colide with itself and you die.</p>

            <p>Press the start game button when you are ready to play and make sure to click on the board if the arrow keys are not mving the snake for you.</p>
        </div>
    )
}

export default Help;