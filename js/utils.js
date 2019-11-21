'use strict'

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function createRandLoc(board,number){
    var arr=[]
    for (var i=0;i<number;i++){
        var randloc={i:0,j:0}
        randloc.i=getRandomIntInclusive(0,board.length-1)
        randloc.j=getRandomIntInclusive(0,board.length-1)
        arr.push(randloc)        
    } 
    return arr
}