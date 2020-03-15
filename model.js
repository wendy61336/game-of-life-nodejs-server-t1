export class ColorInfo {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

}
  
export class SquareInfo extends ColorInfo{
    constructor(r, g, b, locationX,locationY) {
        super(r,g,b);
        this.locationX = locationX;
        this.locationY = locationY;
    }

}


export class PatternShift {
    constructor(xShift, yShift) {
        this.xShift = xShift;
        this.yShift = yShift;
    }
}


export class NeiborInfo {
    constructor(liveNeiborNum,deadNeiborNum) {
        this.liveNeiborNum = liveNeiborNum;
        this.deadNeiborNum = deadNeiborNum;
    }
}