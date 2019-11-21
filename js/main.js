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
    isHint: false

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
    randlocs = createRandLoc(gBoard, gLevel.mines)
    setMines(gBoard, randlocs)
    console.log(gBoard)
    console.log(randlocs)
    setMinesNegsCount(gBoard)
    renderBoard()
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
            // if (i === 0 && j === 1) { cell.isMine = true }
            // if (i === 1 && j === 3) { cell.isMine = true }

            board[i][j] = cell

        }
    }

    return board
}

function setMines(board, arrOfRandLocs) {
    for (var i = 0; i < arrOfRandLocs.length; i++) {
        board[arrOfRandLocs[i].i][arrOfRandLocs[i].j].isMine = true
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

            if (cell.isMarked) { strHTML += `${FLAG}</td>` }
            else if (cell.isMarked && cell.isShown && cell.isMine) { strHTML += `${FLAG}</td>` }
            else if (cell.isMarked && cell.isShown && !cell.isMine) { strHTML += `${FLAG}</td>` }
            else if (cell.isShown && cell.isMine) { strHTML += `${MINE}</td>` }
            else if (cell.isShown && !cell.isMine) { strHTML += `${cell.minesArroundCount}</td>` }



        }
        strHTML += '</tr>\n'
    }
    strHTML += '</tbody>'
    // console.log(strHTML)
    // console.log(gBoard)
    elGrid.innerHTML = strHTML


}

function hint(el) {
    gGame.isHint = true

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
            console.log(checkIfWon(gBoard))
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
}



function checkIfWon(board) {

    if (gLevel.mines === gGame.markedMines) {
        return true
    }
    console.log(gLevel.mines, gGame.markedMines)
    return false

}

function cellClicked(elCell, posI, posJ, event) {
    if (!gGame.isOn) return
    if (gGame.isHint) {
        setTimeout(function () {
            hideNegs(elCell, posI, posJ, gBoard)
            renderBoard()

        }, 1000)
        showNegs(elCell, posI, posJ, gBoard)
        // To be continued

    }
    if (!gGame.isTimer) {
        gGame.isTimer = true
        gTimerInterval = setInterval(createTimer, 1000)

    }
    var curCell = gBoard[posI][posJ]
    if (curCell.isMarked) { return }
    if (curCell.isShown) { return }
    if (!curCell.isMine) {
        curCell.isShown = true
        if (gBoard[posI][posJ].minesArroundCount === 0) {
            showNegs(elCell, posI, posJ, gBoard)
        }

        renderBoard()
    }

    else {
        //search all mines on board
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


    for (var i = posI - 1; i <= posI + 1; i++) {

        if (i < 0 || i > board.length - 1) continue;

        for (var j = posJ - 1; j <= posJ + 1; j++) {

            if (j < 0 || j > board[0].length - 1) continue;

            if (i === posI && j === posJ) continue;
            board[i][j].isShown = true
        }
    }

}

function hideNegs(elCell, posI, posJ, board) {
    // debugger


    for (var i = posI - 1; i <= posI + 1; i++) {

        if (i < 0 || i > board.length - 1) continue;

        for (var j = posJ - 1; j <= posJ + 1; j++) {

            if (j < 0 || j > board[0].length - 1) continue;

            board[i][j].isShown = false
            gGame.isHint = false
        }
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

function restartGame(el) {
    el.innerText = START
    // clearInterval(gTimerInterval)
    // gTimerInterval = null
    gTimer = 1
    gGame.isTimer = false
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
}





// function preventDefault(){
//     var elTable=document.querySelector('table');
//     elTable.addEventListener('contextmenu', e => {
//         e.preventDefault();
//       })
// }






// function renderCinema() {
//     var strHTML = '';
//     for (var i = 0; i < gCinema.length; i++) {
//         strHTML += '<tr>\n'
//         for (var j = 0; j < gCinema[i].length; j++) {
//             var cell = gCinema[i][j];

//             var className = (cell.type === 'EMPTY') ? '' : 'seat '
//             className += (cell.taken) ? 'taken ' : '';
//             className += (cell.selected) ? 'selected ' : '';

//             strHTML += `\t<td
//                 data-i=${i}  data-j=${j}
//                 class="${className}" onclick="seatClicked(this, ${i}, ${j})"></td>\n`
//         }
//         strHTML += '</tr>\n'
//     }

//      console.log(strHTML)
//     var elSeats = document.querySelector('.seats');
//     elSeats.innerHTML = strHTML;
// }