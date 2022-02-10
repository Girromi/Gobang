var chess = document.getElementsByClassName("chess")[0];
var context = chess.getContext("2d");
context.strokeStyle = "#b9b9b9";

window.onload = function() {
    var chess = document.getElementsByClassName("chess")[0];
    var context = chess.getContext("2d");
    context.strokeStyle = "#b9b9b9";
    drawChessBoard();
}

function drawChessBoard() {

    for(var i = 0; i < 15; i++) {
        context.moveTo(15, 15 + 30 * i);
        context.lineTo(435, 15 + 30 * i);
        // 链接两点
        context.stroke();

        context.moveTo(15 + 30 *i, 15);
        context.lineTo(15 + i * 30, 435);
        context.stroke();
    }
}

