'use strict'
var gBoard;
var randlocs;
var FLAG = '🚩'
var GAMEOVER = '☹️'
var WINNER = '😎'
var MINE = '💣'
var START = '🙂'
var gTimer = 1
var gTimerInterval = null

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    markedMines: 0,
    secPassed: 0,
    isTimer: false,
    isHint: false,
    hintsCount: 0,
    isFirstClick: true

}

var gLevel = {
    size: 4,
    mines: 2
}



var cell = {
    minesArroundCount: 0,
    isMine: false,
    isShown: false,
    isMarked: false
}

function init() {
    gGame.isFirstClick = true
    gGame.isHint = 0
    gGame.hintsCount = 0
    gGame.isTimer = false
    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.markedMines = 0
    gGame.secPassed = 0
    clearInterval(gTimerInterval)
    gTimerInterval = null
    gTimer = 1
    gBoard = creatBoard(gLevel.size, gLevel.size)   
    console.log(gBoard)    
    setMinesNegsCount(gBoard)
    renderBoard()
    document.querySelector('.start').style.display = 'block'
    document.querySelector('.start button').innerText = START
    document.querySelector('.Hint').style.display = 'flex'
    document.querySelector('.levels').style.display = 'flex'
    document.querySelector('.popup').style.display = 'none'

}





function creatBoard(rows, cols) {

    var board = [];
    for (var i = 0; i < rows; i++) {
        board[i] = [];
        for (var j = 0; j < cols; j++) {
            var cell = {
                minesArroundCount: 0,
                isMine: false,
                isShown: false,
                isMarked: false
            }           

            board[i][j] = cell

        }
    }

    return board
}


function setMines(board, numOfMines, posI, posJ) {
    //debugger
    for (var i = 0; i < numOfMines; i++) {
        var Ipos = getRandomIntInclusive(0, gLevel.size - 1)
        var Jpos = getRandomIntInclusive(0, gLevel.size - 1)

        if (Ipos === posI && Jpos === posJ) { i-- }
        else if (board[Ipos][Jpos].isMine) { i-- }
        else { board[Ipos][Jpos].isMine = true }
        // console.log('i:', Ipos, 'j:', Jpos)

    }
}



function countNeighbors(board, pos) {
    //    debugger
    var mineCount = 0;
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {

        if (i < 0 || i > board.length - 1) continue;

        for (var j = pos.j - 1; j <= pos.j + 1; j++) {

            if (j < 0 || j > board[0].length - 1) continue;

            if (i === pos.i && j === pos.j) continue;
            if (board[i][j].isMine) mineCount++;
        }
    }
    return mineCount


}

function setMinesNegsCount(board) {
    var pos = {}
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            pos.i = i
            pos.j = j
            cell.minesArroundCount = countNeighbors(board, pos)
        }


    }

}

function renderBoard() {
    var elGrid = document.querySelector('.table')
    var strHTML = '<tbody>\n'
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j]
            var className = `cell `
            className += (cell.isShown) ? `shown` : ''
            className += (cell.isMarked) ? `marked ` : ''
            strHTML += `<td class="${className}" data-i=${i}  data-j=${j} onclick="cellClicked(this,${i},${j})"
            oncontextmenu="cellMarked(this,event,${i},${j})">`            

            if (cell.isShown && cell.isMine) { strHTML += `${MINE}</td>` }
            else if (cell.isShown && !cell.isMine) { strHTML += `${cell.minesArroundCount}</td>` }
            else if (cell.isMarked) { strHTML += `${FLAG}</td>` }

        }
        strHTML += '</tr>\n'
    }
    strHTML += '</tbody>'
    // console.log(strHTML)
    // console.log(gBoard)
    elGrid.innerHTML = strHTML


}

function hint(el) {
    var elPopup = document.querySelector('.popup')
    if (!gGame.isOn) return
    if (gGame.hintsCount === 3) return
    gGame.isHint = true
    gGame.hintsCount++
    elPopup.innerText = 'You can safely click 1 cell.\n' + (3 - gGame.hintsCount) + ' hints left'
    elPopup.style.display = "block"

}



function cellMarked(elCell, ev, posI, posJ) {
    ev.preventDefault();
    if (!gGame.isOn) return
    if (!gGame.isTimer) {
        gGame.isTimer = true
        gTimerInterval = setInterval(createTimer, 1000)

    }
    var curCell = gBoard[posI][posJ]
    if (curCell.isShown) { return }
    if (curCell.isMarked) {
        curCell.isMarked = false
        renderBoard()
    }
    else {
        curCell.isMarked = true
        gGame.markedCount++
        if (gBoard[posI][posJ].isMine) {
            gGame.markedMines++
        }
        if (checkIfWon(gBoard)) {
            win(gBoard)
            // console.log(checkIfWon(gBoard))
        }


        renderBoard()
    }


}

function win(board) {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (board[i][j].isShown === false) {
                board[i][j].isShown = true
                renderBoard()
            }

        }

    }
    clearInterval(gTimerInterval)
    gTimerInterval = null
    var elStart = document.querySelector('.start button')
    elStart.innerText = WINNER
    gGame.isOn = false
}



function checkIfWon(board) {

    if (gLevel.mines === gGame.markedMines) {
        return true
    }
    // console.log(gLevel.mines, gGame.markedMines)
    return false

}

function cellClicked(elCell, posI, posJ, event) {
    var curCell = gBoard[posI][posJ]
    if (!gGame.isOn) return
    if (curCell.isMarked) { return }
    if (curCell.isShown) { return }
    if (!gGame.isTimer) {
        gGame.isTimer = true
        gTimerInterval = setInterval(createTimer, 1000)

    }
    if (gGame.isFirstClick) {
        setMines(gBoard, gLevel.mines, posI, posJ)
        setMinesNegsCount(gBoard)
        curCell.isShown
        gGame.isFirstClick = false
        renderBoard()

    }
    if (gGame.isHint) {
        showAndhideNegs(elCell, posI, posJ, gBoard)
        gGame.isHint = false
        var elPopup = document.querySelector('.popup')
        elPopup.style.display = "none"

    }
    else if (!curCell.isMine) {
        curCell.isShown = true
        
        showNegs(elCell, posI, posJ, gBoard)
        

        renderBoard()
    }

    else if (curCell.isMine) {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard.length; j++) {
                if (gBoard[i][j].isMine) {
                    gBoard[i][j].isShown = true
                    var elStart = document.querySelector('.start button')
                    elStart.innerText = GAMEOVER
                    gGame.isOn = false
                    clearInterval(gTimerInterval)
                    gTimerInterval = null
                }
            }

        }
        renderBoard()
    }
}



function showNegs(elCell, posI, posJ, board) {
    // debugger
    if (board[posI][posJ].minesArroundCount === 0) {

        for (var i = posI - 1; i <= posI + 1; i++) {

            if (i < 0 || i > board.length - 1) continue;

            for (var j = posJ - 1; j <= posJ + 1; j++) {

                if (j < 0 || j > board[0].length - 1) continue;

                // if (i === posI && j === posJ) continue;
                if (!board[i][j].isShown) {
                    if (board[i][j].isMarked) {
                        board[i][j].isMarked = false

                    }

                    board[i][j].isShown = true
                    showNegs(elCell, i, j, board)

                }

            }
        }


    }


}

function showAndhideNegs(elCell, posI, posJ, board) {
    // debugger
    var cellsToHide = []
    setTimeout(function () {
        for (var i = 0; i < cellsToHide.length; i++) {
            var curPos = cellsToHide[i]
            board[curPos.i][curPos.j].isShown = false
        }
        renderBoard()
        gGame.isHint = false
    }, 1000)

    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue;
            if (!board[i][j].isShown) {
                board[i][j].isShown = true
                var pos = { i: i, j: j }
                cellsToHide.push(pos)

            }
        }
    }
    renderBoard()

}


function countNeighbors(board, pos) {
    //    debugger
    var mineCount = 0;
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {

        if (i < 0 || i > board.length - 1) continue;

        for (var j = pos.j - 1; j <= pos.j + 1; j++) {

            if (j < 0 || j > board[0].length - 1) continue;

            if (i === pos.i && j === pos.j) continue;
            if (board[i][j].isMine) mineCount++;
        }
    }
    return mineCount


}

function restartGame(el) {
    el.innerText = START
    // clearInterval(gTimerInterval)
    // gTimerInterval = null
    gTimer = 1
    gGame.isTimer = false
    document.querySelector('.timer').innerText = ''
    init()

}

function createTimer() {
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = gTimer
    gTimer++
}

function startLevel(el) {
    if (el.classList.contains("Easy")) {
        gLevel.size = 4
        gLevel.mines = 2
        init()

    }
    if (el.classList.contains("Medium")) {
        gLevel.size = 8
        gLevel.mines = 12
        init()

    }
    if (el.classList.contains("Hard")) {
        gLevel.size = 12
        gLevel.mines = 30
        init()

    }
    document.querySelector('.timer').innerText = ''
}












