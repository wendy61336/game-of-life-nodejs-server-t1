import{ ColorInfo , SquareInfo, NeiborInfo} from './model'
import{ initBoard} from './utils'
import{ receiveInit, receiveClick} from './utils'
import{ getNextSquareInfo, isAlive } from './utils'


var WebSocketServer = require("ws").Server
var http = require("http")
var port = process.env.PORT || 5000
var server = http.createServer(app)
server.listen(port)
console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

var userNo = 0;
let userColorMap = new Map(); 
let squareInfoList = [];
let restartFlag = false;
const boardSize = 40;

// initailize game board,初始化空白棋盤
initBoard(40,squareInfoList);
// record the click event in this sec, 當次client傳回來click的項目
let clickSqureList = [];
// current clients online, 目前client列表
let CLIENTS=[];


wss.on('connection', function (ws) {
  CLIENTS.push(ws);
  // receive from client
  ws.on('message', function (message) {
    let receiveMessage =  JSON.parse(message); 
    let returnMessage = {};
    console.log("receiveMessage --- "+ message);
    if(receiveMessage.action === 'init'){
      userNo++;
      let returnString =  receiveInit(userColorMap,boardSize);
      ws.send(returnString);
    }else if(receiveMessage.action === 'click'){
      let assignColor = userColorMap.get(receiveMessage.currentPlayer);
      receiveClick(boardSize, assignColor,receiveMessage.clickLocation[0],receiveMessage.clickLocation[1],receiveMessage.clickPattern,clickSqureList);
     
    }else if(receiveMessage.action === 'restart'){
      console.log("restart!!");
      restartFlag = true;
    }
  }, console.log("err message"));

  ws.on('close', function(message){
    console.log("close "+message);
    userNo--;
  }); 

  ws.on("error", (err) => {
    console.log("ws error "+ err.stack);
  });

  ws.on('uncaughtException', function (err) {
    console.error(err.stack);
    console.log("ws uncaughtException ...");
  });

})

wss.on("error", (err) => {
  console.log("wss error "+ err.stack);
});

wss.on('uncaughtException', function (err) {
  console.error(err.stack);
  console.log("wss uncaughtException ...");
});

  // 一秒算一次 --> client the checkboard info
  setInterval(
    function(){

      if(restartFlag === true){
        initBoard(40,squareInfoList);
      }else{
        let returnMessage = {};
        returnMessage.action = 'draw';
        let tempSquareInfoList = [];
        // game of life rule
        for(let square of squareInfoList){
          let x = square.locationX;
          let y = square.locationY;
          let neiborInfo = new NeiborInfo();
          neiborInfo.liveNeiborNum = 0;
          neiborInfo.deadNeiborNum = 0;
          let accColor = new ColorInfo;
          accColor.r = 0;
          accColor.g = 0;
          accColor.b = 0;
          //x+1
          if(x+1<boardSize){
            getNextSquareInfo(boardSize,squareInfoList,x+1,y,neiborInfo,accColor);
          }
          //x-1
          if(x-1>=0){
            getNextSquareInfo(boardSize,squareInfoList,x-1,y,neiborInfo,accColor);
          }
          //y+1
          if(y+1<boardSize){
            getNextSquareInfo(boardSize,squareInfoList,x,y+1,neiborInfo,accColor);
          }
          //y-1
          if(y-1>=0){
            getNextSquareInfo(boardSize,squareInfoList,x,y-1,neiborInfo,accColor);
          }
          //x+1,y+1
          if(x+1<boardSize && y+1<boardSize){
            getNextSquareInfo(boardSize,squareInfoList,x+1,y+1,neiborInfo,accColor);
          }
          //x+1,y-1
          if(x+1<boardSize && y-1>=0){
            getNextSquareInfo(boardSize,squareInfoList,x+1,y-1,neiborInfo,accColor);
          }
          //x-1,y+1
          if(x-1>=0 && y+1<boardSize){
            getNextSquareInfo(boardSize,squareInfoList,x-1,y+1,neiborInfo,accColor);
          }
          //x-1,y-1
          if(x-1>=0 && y-1>=0){
            getNextSquareInfo(boardSize,squareInfoList,x-1,y-1,neiborInfo,accColor);
          }
  
  
          let tempSqure = new SquareInfo(square.r,square.g,square.b,square.locationX,square.locationY);
          //Any live cell with fewer than two live neighbours dies, as if by underpopulation.
          //Any live cell with more than three live neighbours dies, as if by overpopulation.
          if(isAlive(tempSqure) && (neiborInfo.liveNeiborNum < 2 ||  neiborInfo.liveNeiborNum > 3)){
            tempSqure.r = 255;
            tempSqure.g = 255;
            tempSqure.b = 255;
          }
          //Any live cell with two or three live neighbours lives on to the next generation.
          //Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
          if(!isAlive(tempSqure) && neiborInfo.liveNeiborNum === 3){
            tempSqure.r = accColor.r/3;
            tempSqure.g = accColor.g/3;
            tempSqure.b = accColor.b/3;
          }
  
          tempSquareInfoList.push(tempSqure);
        }
  
       
        // update squareInfoList
        squareInfoList = tempSquareInfoList;
        
        // click event from clients
        for(let squre of clickSqureList){
          squareInfoList[squre.locationX*boardSize+squre.locationY].r = squre.r;
          squareInfoList[squre.locationX*boardSize+squre.locationY].g = squre.g;
          squareInfoList[squre.locationX*boardSize+squre.locationY].b = squre.b;
        }
        clickSqureList = [];
        returnMessage.content = JSON.stringify(squareInfoList);
  
        // send final result to every Clients
        for(let ws of CLIENTS){
          if (ws.readyState === ws.OPEN) {
            console.log("send ");
            
            try {
                ws.send(JSON.stringify(returnMessage));
            } catch(e) {
              console.log("error in send");
            }
  
         
          }
        }
      }
      restartFlag = false;
    },
    1000
  )






