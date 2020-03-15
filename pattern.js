import{ PatternShift } from './model'

export const Single = [new PatternShift(0,0)];

export const Blinker = [new PatternShift(0,0),new PatternShift(1,0), new PatternShift(2,0)];

export const Block = [new PatternShift(0,0),new PatternShift(1,0), new PatternShift(0,1), new PatternShift(1,1)];

export const Toad = [new PatternShift(0,0),new PatternShift(1,0), new PatternShift(1,1), new PatternShift(1,-1), new PatternShift(0,1), new PatternShift(0,2)];

export const Beehive = [new PatternShift(0,0),new PatternShift(0,1), new PatternShift(1,-1), new PatternShift(1,2), new PatternShift(2,0), new PatternShift(2,1)];


