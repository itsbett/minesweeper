const container = document.getElementById('container')
let mousePosition = null
let mineSweeper = 'haha'
let grass = new Image()
grass.src = 'tiles/grass_center.png'

class Minesweeper {
  constructor (row, col, mines) {
    this.row = row
    this.col = col
    this.canvas = this.buildCanvas()
    this.context = this.canvas.getContext('2d')
    this.canvas.addEventListener('mousedown', mouseClick, false)
    this.canvas.addEventListener('mousemove', moveMouse, false)
    this.mineList = randomMines(mines, row, col)
    this.board = new Board(row, col, () => this.mineList.pop() === 1)
    this.startGame()
  }
  startGame () {
    // this.draw()
  }
  endGame () {
    console.log('you lose, fuckboi')
  }
  buildCanvas () {
    for (let i = 0; i < this.row + 2; i++) {
      let div = document.createElement('div')
      for (let j = 0; j < this.col + 5; j++) {
        if (i === 1 && j === 1) {
          let div2 = document.createElement('div')
          let canvas1 = document.createElement('canvas')
          canvas1.setAttribute('id', 'generatedCanvas')
          canvas1.height = 32 * this.col
          canvas1.width = 32 * this.row
          canvas1.style.backgroundColor = 'white'
          div2.appendChild(canvas1)
          div.appendChild(div2)
        } else {
          let div2 = document.createElement('div')
          let tilepos = this.getTile(i, j)
          div2.setAttribute('id', tilepos)
          div.appendChild(div2)
        }
      }
      container.appendChild(div)
    }
    return document.getElementById('generatedCanvas')
  }
  getTile (i, j) {
    if (j > this.col + 1) { // should we draw the cliff?
      if (i === 0) {
        if (j === this.col + 4) {
          return 'rockbotleft'
        }
        return 'rockleft'
      }
      if (i === this.row + 1) {
        if (j === this.col + 4) {
          return 'rockbotright'
        }
        return 'rockright'
      }
      if (j === this.col + 4) {
        return 'rockbotmid'
      }
      return 'rockmid'
    }
    if (i === 1 && j === 1) {
      return 'canvascontainer'
    }
    if (i === 0) { // are we on the left side?
      if (j === 0) {
        return 'topleft' // is this the top left tile?
      }
      if (j === this.col + 1) { // is this bottom left tile?
        return 'botleft'
      }
      return 'left' // otherwise it's a left tile
    }
    if (j === 0) { // are we on top side?
      if (i === this.row + 1) { // is this top right tile?
        return 'topright'
      }
      return 'top'
    }
    if (j === this.col + 1) { // is this right side?
      if (i === this.row + 1) { // is this bottom right tile?
        return 'botright'
      }
      return 'bottom'
    }
    if (i === this.row + 1) {
      return 'right'
    }
    return 'center'
  }
  draw () {
    let container1 = document.getElementById('container1')
    for (let i = 0; i < this.row; i++) {
      let r = document.createElement('div')

      for (let j = 0; j < this.col; j++) {
        this.board.field[i][j].draw()

        let c = document.createElement('div')
        let cText = document.createTextNode(`(${i}, ${j})`)
        c.appendChild(cText)

        if (this.board.field[i][j].isMine) {
          c.setAttribute('class', 'red')
        }
        r.appendChild(c)
      }
      r.setAttribute('class', 'left')
      container1.appendChild(r)
    }
  }
}

class Node {
  constructor (x, y, isMine, tile) {
    this.x = x
    this.y = y
    this.escavated = false
    this.isMine = isMine
    this.tile = tile
    this.surroundingMines = null
    this.selected = false
  }

  click () {
    if (!this.escavated) {
      mineSweeper.context.font = '30px Arial'
      this.escavated = true
      if (this.isMine) {
        this.surroundingMines = this.getSurroundingMines() // delete this later
        mineSweeper.endGame()
      } else {
        this.surroundingMines = this.getSurroundingMines()
        if (this.surroundingMines[0] === 0) {
          this.surroundingMines[1].forEach((e) => e.click())
        }
      }
      this.draw()
    }
  }

  draw () {
    if (this.selected) {
      mineSweeper.context.strokeRect(this.x * 32 + 1, this.y * 32 + 1, 29, 29)
    } else {
      mineSweeper.context.clearRect(this.x * 32, this.y * 32, 32, 32)
      mineSweeper.context.drawImage(grass, this.x * 32, this.y * 32, 32, 32)
    }
    if (this.escavated) {
      mineSweeper.context.fillStyle = '#000000'
      mineSweeper.context.fillText(this.surroundingMines[0], this.x * 32 + 32 / 4, this.y * 32 + 32)
      if (this.isMine) {
        mineSweeper.context.fillStyle = '#FF0000'
        mineSweeper.context.fillRect(this.x * 32, this.y * 32, 32, 32)
      }
    }
  }

  getSurroundingMines () {
    let xStart = this.x - 1
    let xEnd = this.x + 1
    let yStart = this.y - 1
    let yEnd = this.y + 1
    let surroundingMines = 0
    let checkedMines = []

    if (this.x === 0) { // is node against the left wall?
      xStart++
    } else if (this.x === mineSweeper.row - 1) { // is node against the right wall?
      xEnd--
    }

    if (this.y === 0) { // is node against the top wall?
      yStart++
    } else if (this.y === mineSweeper.col - 1) { // is node against the bottom wall?
      yEnd--
    }

    for (let x = xStart; x <= xEnd; x++) {
      for (let y = yStart; y <= yEnd; y++) {
        if (mineSweeper.board.field[x][y].escavated === false) {
          checkedMines.push(mineSweeper.board.field[x][y])
        }
        if (mineSweeper.board.field[x][y].isMine) {
          surroundingMines++
        }
      }
    }
    return [surroundingMines, checkedMines]
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
        this.field[i][j] = new Node(i, j, this.value(), this.getTile(i, j)) // populates each row with a new Node object
      }
    }
  }
  getTile (i, j) {
    if (i === 0) { // are we on the left side?
      if (j === 0) {
        return 'topleft' // is this the top left tile?
      }
      if (j === this.col - 1) { // is this bottom left tile?
        return 'botleft'
      }
      return 'left' // otherwise it's a left tile
    }
    if (j === 0) { // are we on top side?
      if (i === this.row - 1) { // is this top right tile?
        return 'topright'
      }
      return 'top'
    }
    if (j === this.col - 1) { // is this right side?
      if (i === this.row - 1) { // is this bottom right tile?
        return 'botright'
      }
      return 'bottom'
    }
    if (i === this.col - 1) {
      return 'right'
    }
    return 'center'
  }
}

function randomMines (mines, row, col) {
  let mineList = Array(mines).fill(1) // create an array of 1s, with a length of the number of mines we want to place on the board
  mineList = mineList.concat(Array(row * col - (mines)).fill(0)) // add the board's empty spaces to the list of mines
  for (let i = mineList.length - 1; i > 0; i--) { // randomize the spaces
    const j = Math.floor(Math.random() * (i + 1));
    [mineList[i], mineList[j]] = [mineList[j], mineList[i]]
  }
  return mineList
}

function getMousePos (canvas, event) {
  var rect = canvas.getBoundingClientRect()
  return {
    x: Math.floor((event.clientX - rect.left) / 32),
    y: Math.floor((event.clientY - rect.top) / 32)
  }
}

function moveMouse (event) {
  let pos = getMousePos(mineSweeper.canvas, event)
  if (mousePosition === null) { // has there been a previous mouse position?
    mousePosition = pos
  } else if (mousePosition.x !== pos.x || mousePosition.y !== pos.y) { // is the previous mouse position different than the current one?
    let oldTile = mineSweeper.board.field[mousePosition.x][mousePosition.y]
    let newTile = mineSweeper.board.field[pos.x][pos.y]

    oldTile.selected = false
    newTile.selected = true

    oldTile.draw()
    newTile.draw()

    console.log(newTile.tile)
    mousePosition = pos
  }
}

function mouseClick (event) {
  let pos = getMousePos(mineSweeper.canvas, event)
  mineSweeper.board.field[pos.x][pos.y].click()
}

window.addEventListener('load', start)

function start () {
  mineSweeper = new Minesweeper(15, 15, 45)
  mineSweeper.draw()
}
