console.log('Utils');

function buildBoard(colsAndRows) {
    var board = [];
    for (var i = 0; i < colsAndRows; i++) {
        board[i] = [];
        for (var j = 0; j < colsAndRows; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isHinted:false,
                turnClicked:gGame.turn

            }
        }
    }
    
    return board;
}

function renderBoard(board) {
    var strHtml = '';

    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var LClick = `onclick="cellClicked(this,${i},${j})"`;
            var RClick = `oncontextmenu="cellMarked(this,${i},${j})"`;
            strHtml += `<td class="cell cell-${i}-${j}"${LClick}${RClick} ></td>`;
        }
        strHtml += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;
}

function getRandomIntInc(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
  }