function Game () {
   window.onload = function drawChessBoard () {
      var chess = document.getElementsByClassName("chess")[0];
      var title = document.getElementsByClassName("title")[0];
      var context = chess.getContext("2d");
      var restart = document.getElementsByClassName("restart")[0];
      context.strokeStyle = "#b9b9b9";

      for (var i = 0; i < 15; i++) {
         context.moveTo(15, 15 + 30 * i);
         context.lineTo(435, 15 + 30 * i);
         // 链接两点
         context.stroke();

         context.moveTo(15 + 30 * i, 15);
         context.lineTo(15 + i * 30, 435);
         context.stroke();
      }

      var wins = [];
      for (var i = 0; i < 15; i++) {
         wins[i] = [];
         for (var j = 0; j < 15; j++) {
            wins[i][j] = [];
         }
      }
      // 统计横线赢法
      var count = 0;
      for (var i = 0; i < 15; i++) {
         for (var j = 0; j < 11; j++) {
            for (var k = 0; k < 5; k++) {
               wins[j + k][i][count] = true;
            }
            count++;
         }
      }

      // 统计竖线赢法
      for (var i = 0; i < 15; i++) {
         for (var j = 0; j < 11; j++) {
            for (var k = 0; k < 5; k++) {
               wins[i][j + k][count] = true;
            }
            count++;
         }
      }

      // 统计正斜线赢法
      for (var i = 0; i < 11; i++) {
         for (var j = 0; j < 11; j++) {
            for (var k = 0; k < 5; k++) {
               wins[i + k][j + k][count] = true;
            }
            count++;
         }
      }

      // 统计反斜线
      for (var i = 0; i < 11; i++) {
         for (var j = 14; j > 3; j--) {
            for (var k = 0; k < 5; k++) {
               wins[i + k][j - k][count] = true;
            }
            count++;
         }
      }

      // 定义二维数组，标记棋盘上每个坐标是否已经下了棋子
      var chessboard = [];
      for (var i = 0; i < 15; i++) {
         chessboard[i] = [];
         for (var j = 0; j < 15; j++) {
            chessboard[i][j] = 0;
         }
      }
      // console.log(wins)

      // 下棋
      var me = true;
      var over = false;

      var myWin = [];
      var computerWin = [];
      for (var i = 0; i < count; i++) {
         myWin[i] = 0;
         computerWin[i] = 0;
      }

      chess.onclick = function (e) {
         if (over) {
            return;
         }
         if (!me) {
            return;
         }

         var x = e.offsetX;
         var y = e.offsetY;
         var i = Math.floor(x / 30);
         var j = Math.floor(y / 30);
         if (chessboard[i][j] == 0) {
            oneStep(i, j, me);
            chessboard[i][j] = 1;

            for (var k = 0; k < count; k++) {
               if (wins[i][j][k]) {
                  myWin[k]++;
                  if (myWin[k] == 5) {
                     title.innerHTML = "恭喜你获胜了";
                     over = true;
                  }
               }
            }
         }
         if (!over) {
            me = !me;
            computerAI();
         }
      }
      function computerAI () {
         // 空白子在用户随占用赢法上的分值
         var myScore = [];
         var computerScore = [];
         for (var i = 0; i < 15; i++) {
            myScore[i] = [];
            computerScore[i] = [];

            for (var j = 0; j < 15; j++) {
               myScore[i][j] = 0;
               computerScore[i][j] = 0;
            }
         }
         var max = 0;
         var x = 0, y = 0;

         for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 15; j++) {
               if (chessboard[i][j] == 0) {
                  for (var k = 0; k < count; k++) {
                     if (wins[i][j][k]) {
                        if (myWin[k] == 1) {
                           myScore[i][j] += 200;
                        } else if (myWin[k] == 2) {
                           myScore[i][j] += 400;
                        } else if (myWin[k] == 3) {
                           myScore[i][j] += 2000;
                        } else if (myWin[k] == 4) {
                           myScore[i][j] += 10000;
                        }

                        if (computerWin[k] == 1) {
                           computerScore[i][j] += 220;
                        } else if (computerWin[k] == 2) {
                           computerScore[i][j] += 420;
                        } else if (computerWin[k] == 3) {
                           computerScore[i][j] += 2200;
                        } else if (computerWin[k] == 4) {
                           computerScore[i][j] += 20000;
                        }
                     }
                  }

                  if (myScore[i][j] > max) {
                     max = myScore[i][j];
                     x = i;
                     y = j;
                  } else if (myScore[i][j] == max) {
                     if (computerScore[i][j] > max) {
                        max = computerScore[i][j];
                        x = i;
                        y = j;
                     }
                  }

                  if (computerScore[i][j] > max) {
                     max = computerScore[i][j];
                     x = i;
                     y = j;
                  } else if (computerScore[i][j] == max) {
                     if (myScore[i][j] > max) {
                        max = myScore[i][j];
                        x = i;
                        y = j;
                     }
                  }
               }
            }
         }

         oneStep(x, y, me);
         chessboard[x][y] = 1;

         for (var k = 0; k < count; k++) {
            if (wins[x][y][k]) {
               computerWin[k] += 1;
               if (computerWin[k] == 5) {
                  title.innerHTML = "抱歉🤣🤣计算机获胜了！！~~~"
                  over = true;
               }
            }
         }
         if (!over) {
            me = !me;
         }
      }

      function oneStep (i, j, me) {
         context.beginPath();
         context.arc(15 + i * 30, 15 + j * 30, 12, 0, 2 * Math.PI);
         context.closePath();

         var color;
         if (me) {
            color = "black";
         } else {
            color = "red";
         }
         context.fillStyle = color;
         context.fill();
      }
      restart.onclick = function () {
         window.location.reload();
      }
   }
}