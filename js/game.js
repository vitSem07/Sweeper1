console.log('Mine Sweeper');
var gGame;
var gLevel={
    size: 4,
    mines: 2,
    lvlName: 'easy'
}
var gBoard;
const BOMB = '💣';
const FLAG = '🚩';
initGame()
function initGame() {
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        bombsPos: [],
        lifesCount: 3,
        isHintOn: false,
        isHintClicked: false,
        isManual: false,
        gTimeInterval: null,
        turn: 0,
        isUndo:false,
        prevTurns:[]
    };
    
    gBoard = buildBoard(gLevel.size);
    renderBoard(gBoard);
    gGame.isOn = true
}

function cellMarked(elCell, i, j) {
    if (!gGame.isOn || gBoard[i][j].isShown) return

    if (!gBoard[i][j].isMarked) {
        elCell.innerText = FLAG;
        gGame.markedCount++;
        checkGameOver();
    } else {
        elCell.innerText = '';
        gGame.markedCount--;
    }
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked;
}

function cellClicked(elCell, i, j) {
    if (!gGame.isOn || gBoard[i][j].isShown&&!gGame.isUndo || gBoard[i][j].isMarked) return
    if (gGame.isHintOn) return
    if (gGame.isHintClicked) {
        gGame.isHintOn = true
        hintUsed(gBoard, i, j)
        return
    }
    if (gGame.isManual) {
        gBoard[i][j].isMine = true
        toggleClass(elCell, 'bomb')
        gGame.bombsPos.push({
            i: i,

            j: j
        })
        elCell.innerText = BOMB
        return
    }
    if (gBoard[i][j].isMine) {
        if (gGame.lifesCount > 1) {
            gGame.lifesCount--
            var elLife = document.querySelector('.life')
            toggleClass(elLife, 'life')
            toggleClass(elCell, 'life')
            setTimeout(() => {
                toggleClass(elCell, 'life')
            }, 500);
            return
        }

        showBombs(gBoard);
        gGame.isOn = false
        return
    }
    if (!gGame.turn) {
        gGame.gTimeInterval = setInterval(() => {
            timer()
        }, 1000);
    }
    ++gGame.turn
    gBoard[i][j].isShown = !gBoard[i][j].isShown
    gGame.prevTurns.push({i:i,j:j})
    if (!gGame.bombsPos.length && !gGame.shownCount) {
        setBombs(gBoard, gLevel.mines);
        setMinesNegsCount(gBoard);
    }

    var negsCount = gBoard[i][j].minesAroundCount
    toggleClass(elCell, `negs${negsCount}`);
    if (!gBoard[i][j].isMine) {
        elCell.innerText = gBoard[i][j].minesAroundCount;
        elCell.classList.add('shown');
        gGame.shownCount++;
        checkGameOver();
        gBoard[i][j].turnClicked = gGame.turn
        if (!gBoard[i][j].minesAroundCount) {
            expandShown(gBoard, i, j);
        }
    }
    
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            countNegs(board, i, j);
        }
    }
}

function countNegs(board, idx, jdx) {
    for (var i = idx - 1; i <= idx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = jdx - 1; j <= jdx + 1; j++) {
            if (j < 0 || j > board.length - 1) continue;
            if (i === idx && j === jdx) continue;
            if (board[i][j].isMine) board[idx][jdx].minesAroundCount++;
        }
    }
}

function expandShown(board, idx, jdx) {
    for (var i = idx - 1; i <= idx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue;
        for (var j = jdx - 1; j <= jdx + 1; j++) {
            if (j < 0 || j > board.length - 1) continue;
            if (i === idx && j === jdx) continue;
            if (board[i][j].isShown) continue
            if(gGame.isUndo&&board[i][j].turnClicked===gGame.turn-1){
                board[i][j].isShown = false
                gGame.shownCount--
                var elCell = document.querySelector(`.cell-${i}-${j}`);
                toggleClass(elCell, `shown`);
                elCell.innerText = ''
                if (!board[i][j].minesAroundCount) {
                    expandShown(board, i, j);
                }

            }
            else{
                board[i][j].isShown = true
            gGame.shownCount++
            var elCell = document.querySelector(`.cell-${i}-${j}`);
            toggleClass(elCell, `shown`);
            var negsCount = board[i][j].minesAroundCount
            elCell.innerText = negsCount
            toggleClass(elCell, `negs${negsCount}`);
            if (!board[i][j].minesAroundCount) {
                expandShown(board, i, j);
            }
            }
            
        }
    }
}

function toggleClass(elCell, classToToggle) {
    elCell.classList.toggle(`${classToToggle}`);
}

function checkGameOver() {
    if (gGame.markedCount + gGame.shownCount === gBoard.length ** 2) return true;
    return false;
}

function setBomb(board) {
    var randomIdx = getRandomIntInc(0, board.length - 1);
    var randomJdx = getRandomIntInc(0, board.length - 1);
    if (board[randomIdx][randomJdx].isShown) return setBomb(board);
    if (board[randomIdx][randomJdx].isMine) return setBomb(board);
    board[randomIdx][randomJdx].isMine = true;
    var elCell = document.querySelector(`.cell-${randomIdx}-${randomJdx}`);
    toggleClass(elCell, 'bomb');
    var bombPos = {
        i: randomIdx,
        j: randomJdx
    }
    gGame.bombsPos.push(bombPos);
}

function setBombs(board, num) {
    for (var i = 0; i < num; i++) {
        setBomb(board);
    }
}

function showBombs(board) {
    var elBombs = document.querySelectorAll('.bomb');
    for (var i = 0; i < elBombs.length; i++) {
        elBombs[i].innerText = BOMB;
        toggleClass(elBombs[i], 'shown');
        var bombPos = gGame.bombsPos[i];
        board[bombPos.i][bombPos.j].isShown = true;
    }
}

function HintClicked(elBtn) {
    toggleClass(elBtn, 'hint');
    gGame.isHintClicked = true
}

function hintUsed(board, idx, jdx) {
    for (var i = idx - 1; i <= idx + 1; i++) {
        for (var j = jdx - 1; j <= jdx + 1; j++) {
            if (i < 0 || i > board.length - 1) continue;
            if (j < 0 || j > board.length - 1) continue;
            if (board[i][j].isShown) continue
            var elCell = document.querySelector(`.cell-${i}-${j}`);
            var cellContent = (board[i][j].isMine) ? BOMB : board[i][j].minesAroundCount
            toggleClass(elCell, 'shown');
            elCell.innerText = (!elCell.innerText) ? cellContent : ''
            var negsCount = gBoard[i][j].minesAroundCount
            toggleClass(elCell, `negs${negsCount}`);
        }
        if (gGame.isHintClicked) setTimeout(() => {
            gGame.isHintClicked = false
            hintUsed(board, idx, jdx)
            gGame.isHintOn = false
        }, 1000);

    }

}

function safeClick() {
    var randomIdx = getRandomIntInc(0, gBoard.length - 1);
    var randomJdx = getRandomIntInc(0, gBoard.length - 1);
    var currCell = gBoard[randomIdx][randomJdx]
    if (currCell.isShown || currCell.isMine) return safeClick()
    var elCell = document.querySelector(`.cell-${randomIdx}-${randomJdx}`);
    toggleClass(elCell, 'hint');
    setTimeout(() => {
        toggleClass(elCell, 'hint');
    }, 1000);
}

function mode(size, mines, lvlName) {
    gLevel={
        size: size,
        mines: mines,
        lvlName: lvlName
    }
    initGame()
}

function manual() {
    if (gGame.shownCount) return
    if (gGame.isManual) {
        var elBombs = document.querySelectorAll('.bomb');
        for (var i = 0; i < elBombs.length; i++) {
            elBombs[i].innerText = '';
        }
        setMinesNegsCount(gBoard)
        gLevel.lvlName = 'Manual'
    }
    gGame.isManual = !gGame.isManual
}

function timer() {
    gGame.secsPassed += 1
    var elTimerSec = document.querySelector('.sec')
    elTimerSec.innerText = gGame.secsPassed
}

function undo() {
    gGame.isUndo=true
var prevTurn=gGame.prevTurns[gGame.prevTurns.length-1]
var elCell = document.querySelector(`.cell-${prevTurn.i}-${prevTurn.j}`);
toggleClass(elCell, 'shown');
cellClicked(elCell, prevTurn.i, prevTurn.j)
}