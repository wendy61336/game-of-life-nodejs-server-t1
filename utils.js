import{ ColorInfo , SquareInfo} from './model'
import{ Single, Blinker, Block, Toad, Beehive } from './pattern'

/**
 * initailize game board
 * @param {*} boardSize 
 * @param {*} squareInfoList 
 */
export function initBoard(boardSize,squareInfoList){
    
    for(let x of Array(boardSize).fill(0).map((x, i) => i)){
        for(let y of Array(boardSize).fill(0).map((x, i) => i)){
            squareInfoList[x*boardSize+y] = new SquareInfo(255,255,255,x,y);
        }
      }
}

/**
 * initailize new client side
 * @param {*} userColorMap 
 * @param {*} boardSize 
 */
export function receiveInit( userColorMap, boardSize){

    let returnMessage = {};
    returnMessage.action = 'init';
    returnMessage.currentPlayer = "user"+ Math.random().toString(36).substring(7);
    returnMessage.r = Math.random()*1000%255;
    returnMessage.g = Math.random()*1000%255;
    returnMessage.b = Math.random()*1000%255;
    let assignColor = new ColorInfo(returnMessage.r,returnMessage.g,returnMessage.b);
    userColorMap.set(returnMessage.currentPlayer,assignColor);
    returnMessage.boardSize = boardSize;

    return JSON.stringify(returnMessage);
}

/**
 * recieve client click event
 * @param {*} boardSize 
 * @param {*} assignColor 
 * @param {*} currentX 
 * @param {*} currentY 
 * @param {*} clickPattern 
 * @param {*} clickSqureList 
 */
export function receiveClick( boardSize, assignColor, currentX, currentY, clickPattern, clickSqureList){
    let changeBlockList = [];
    if(clickPattern === 'Single')
        changeBlockList = Single;
    else if(clickPattern === 'Blinker')
        changeBlockList = Blinker;
    else if(clickPattern === 'Block')
        changeBlockList = Block;
    else if(clickPattern === 'Toad')
        changeBlockList = Toad;
    else if(clickPattern === 'Beehive')
        changeBlockList = Beehive;

    for(let b of changeBlockList){
        let tempX = b.xShift + currentX;
        let tempY = b.yShift + currentY;
        if(isInMargin(boardSize,tempX,tempY)){
            let tempSqure = new SquareInfo(assignColor.r,assignColor.g,assignColor.b,tempX,tempY);
            clickSqureList.push(tempSqure);
        }
    }

}
/**
 * apply game of life rule to calculate neibor info
 * @param {*} boardSize 
 * @param {*} squareInfoList 
 * @param {*} x 
 * @param {*} y 
 * @param {*} neiborInfo 
 * @param {*} accColor 
 */
export function getNextSquareInfo(boardSize,squareInfoList,x,y,neiborInfo,accColor){
    if(isAlive(squareInfoList[x*boardSize+y])){
            neiborInfo.liveNeiborNum++;
            accColor.r +=squareInfoList[x*boardSize+y].r;
            accColor.g +=squareInfoList[x*boardSize+y].g;
            accColor.b +=squareInfoList[x*boardSize+y].b;
        }
    else
        neiborInfo.deadNeiborNum++;

}

/**
 * if the square is alive
 * @param {} color 
 */
export function isAlive(color){
    return !(color.r === 255 && color.g === 255 && color.b === 255);
}

/**
 * test if the block is in valid(x,y)
 * @param {*} boardSize 
 * @param {*} xShift 
 * @param {*} yShift 
 */
function isInMargin(boardSize, xShift, yShift){
    return (xShift>=0 && xShift < boardSize && yShift>=0 && yShift < boardSize)
}




