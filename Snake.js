const width = 640
const height = 480
const tileSize = 32
const verticalTiles = height / tileSize
const horizontalTiles = width / tileSize
const snakeColor = 'green'
const foodColor = 'red'
const collisionColor = 'red'
const tick = 200

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const input = []
let direction
let food
let looper
let collision = false

class Snake {
  constructor (initialX, initialY) {
    this.parts = []
    this.parts.push(new Position(initialX, initialY))
    this.hasEaten = false
  }

  move () {
    // Prepare new piece position
    const lastPiece = Object.assign({}, this.parts[this.parts.length - 1])

    // Prepare tail movement
    for (let i = this.parts.length - 1; i > 0; i--) {
      this.parts[i].xPos = this.parts[i - 1].xPos
      this.parts[i].yPos = this.parts[i - 1].yPos
    }

    // Evaluate input
    if (input.length > 0) {
      if ((input[0] === 'up' && direction !== 'down') ||
                (input[0] === 'down' && direction !== 'up') ||
                (input[0] === 'left' && direction !== 'right') ||
                (input[0] === 'right' && direction !== 'left')) {
        direction = input.shift()
      } else {
        input.shift()
      }
    }

    // Change direction of head
    switch (direction) {
      case 'up':
        this.parts[0].yPos = (this.parts[0].yPos - 1) >= 0 ? (this.parts[0].yPos - 1) : verticalTiles - 1
        break
      case 'down':
        this.parts[0].yPos = (this.parts[0].yPos + 1) % verticalTiles
        break
      case 'left':
        this.parts[0].xPos = (this.parts[0].xPos - 1) >= 0 ? (this.parts[0].xPos - 1) : horizontalTiles - 1
        break
      case 'right':
        this.parts[0].xPos = (this.parts[0].xPos + 1) % horizontalTiles
        break
      default:
        break
    }

    // Check for food
    if (this.parts[0].xPos === food.xPos && this.parts[0].yPos === food.yPos) {
      this.hasEaten = true
      spawnFood()
    }

    // Append new piece
    if (this.hasEaten) {
      this.parts.push(new Position(lastPiece.xPos, lastPiece.yPos))
      this.hasEaten = false
    }

    // Check for collision
    const [head, ...tail] = this.parts
    for (const part of tail) {
      if (head.xPos === part.xPos && head.yPos === part.yPos) {
        collision = true
      }
    }
  }
}

// Snake pieces as classes for ease of use
class Position {
  constructor (xPos, yPos) {
    this.xPos = xPos
    this.yPos = yPos
  }
}

function spawnFood () {
  food = undefined
  food = new Position(Math.floor(Math.random() * horizontalTiles),
    Math.floor(Math.random() * verticalTiles))
  for (const part of snake.parts) {
    if (part.xPos === food.xPos && part.yPos === food.yPos) {
      spawnFood()
    }
  }
}

function init () {
  document.addEventListener('keydown', (e) => {
    switch (e.code) {
      case 'ArrowUp':
        input.push('up')
        break
      case 'ArrowDown':
        input.push('down')
        break
      case 'ArrowLeft':
        input.push('left')
        break
      case 'ArrowRight':
        input.push('right')
        break
    }
  })

  spawnFood()
  looper = setInterval(loop, tick)
}

function loop () {
  if (collision == false) {
    snake.move()
    draw()
  } else {
    clearInterval(looper)
  }
}

function draw () {
  // Clear old screen
  ctx.clearRect(0, 0, width, height)

  // Draw food
  ctx.fillStyle = foodColor
  ctx.fillRect(food.xPos * tileSize, food.yPos * tileSize, tileSize, tileSize)

  // Draw snake
  ctx.fillStyle = snakeColor
  const [head, ...tail] = snake.parts
  ctx.fillRect(head.xPos * tileSize - 5, head.yPos * tileSize - 5, tileSize + 10, tileSize + 10)
  for (const part of tail) {
    ctx.fillRect(part.xPos * tileSize, part.yPos * tileSize, tileSize, tileSize)
  }

  // Draw Game Over
  if (collision === true) {
    ctx.fillStyle = collisionColor
    ctx.font = '40px Comic Sans MS'
    ctx.textAlign = 'center'
    ctx.fillText('GAME OVER!', width / 2, height / 2)
  }
}

const snake = new Snake(Math.floor(horizontalTiles / 2), Math.floor(verticalTiles / 2))
init()
