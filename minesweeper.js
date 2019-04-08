class Minesweeper {
  constructor (row, col, mines) {
    this.row = row
    this.col = col
    this.mineList = randomMines(mines, row, col)
    this.board = new Board(row, col, () => this.mineList.pop() === 1)
    this.canvas = document.getElementById('canvas')
    this.context = this.canvas.getContext('2d')
    this.startGame()
  }
  startGame () {
    this.canvas.setAttribute('width', this.row * 32)
    this.canvas.setAttribute('height', this.col * 32)
    this.draw()
  }
  endGame () {
    console.log('you lose, fuckboi')
  }
  draw () {
    let grass = new Image()df
    grass.onload = () => this.context.drawImage(grass, 0, 0, 32, 32)
    grass.src = 'images/grass_tile_mid_no_border.png'

    let container = document.getElementById('container')
    for (let i = 0; i < this.row; i++) {
      let r = document.createElement('div')
      for (let j = 0; j < this.col; j++) {
        let c = document.createElement('div')
        let cText = document.createTextNode(`(${i}, ${j})`)
        c.appendChild(cText)
        if (this.board.field[i][j].isMine) {
          c.setAttribute('class', 'red')
        }
        r.appendChild(c)
      }
      r.setAttribute('class', 'left')
      container.appendChild(r)
    }
  }
}

class Node {
  constructor (x, y, isMine) {
    this.x = x
    this.y = y
    this.escavated = false
    this.isMine = isMine
    this.surroundingMines = 0
  }

  click () {
    if (this.isMine) {
      mineSweeper.endGame()
    } else {
      console.log('Getting surrounding mines!')
      this.surroundingMines = this.getSurroundingMines()
      return this.surroundingMines
    }
  }

  getSurroundingMines () {
    let xStart = this.x - 1
    let xEnd = this.x + 1
    let yStart = this.y - 1
    let yEnd = this.y + 1
    let surroundingMines = 0

    if (this.x === 0) { // is node against the left wall?
      xStart++
      console.log('along left wall')
    } else if (this.x === mineSweeper.row - 1) { // is node against the right wall?
      xEnd--
      console.log('along right wall')
    }

    if (this.y === 0) { // is node against the top wall?
      yStart++
      console.log('along top wall')
    } else if (this.y === mineSweeper.col - 1) { // is node against the bottom wall?
      yEnd--
      console.log('along bottom wall')
    }

    for (let x = xStart; x <= xEnd; x++) {
      for (let y = yStart; y <= yEnd; y++) {
        console.log(`(${x},${y})`)
        if (mineSweeper.board.field[x][y].isMine) {
          surroundingMines++
        }
      }
    }
    return surroundingMines
  }
}

class Board {
  constructor (row, col, value) {
    this.field = []
    this.row = row
    this.col = col
    this.value = value
    this.generateBoard()
  }

  generateBoard () {
    for (let i = 0; i < this.row; i++) {
      this.field.push([]) // creates row
      for (let j = 0; j < this.col; j++) {
        this.field[i][j] = new Node(i, j, this.value()) // populates each row with a new Node object
      }
    }
  }
}

let mineSweeper = new Minesweeper(10, 10, 30)

function randomMines (mines, row, col) {
  let mineList = Array(mines).fill(1) // create an array of 1s, with a length of the number of mines we want to place on the board
  mineList = mineList.concat(Array(row * col - (mines)).fill(0)) // add the board's empty spaces to the list of mines
  for (let i = mineList.length - 1; i > 0; i--) { // randomize the spaces
    const j = Math.floor(Math.random() * (i + 1));
    [mineList[i], mineList[j]] = [mineList[j], mineList[i]]
  }
  return mineList
}
