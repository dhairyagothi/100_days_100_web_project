


function findchar(ans,prop,remainingCharacters){

return remainingCharacters.filter(character=> {
    if(character[prop]===ans){
        console.log(character)
        return character;
    }
})

}



function bestQues(questions,remainingCharacters){
let keyDiff = []
 for(const question of questions){
   let trueCount=0;
   let falseCount=0;
   
   remainingCharacters.forEach(character=>{
    if(character[question.key]===true){
        trueCount++;
    }else{
        falseCount++;
    }
   
   })
    let diff = Math.abs(trueCount-falseCount)
    keyDiff = keyDiff.concat({key:question.key,diff:diff})
}



   let minimum = Infinity;
   let bestQuesKey;
    keyDiff.forEach(k=>{
    
    if (k.diff<minimum && remainingCharacters.length != k.diff){
       minimum=k.diff;
        bestQuesKey=k.key;
    }

   })
   return bestQuesKey
        
    }

export {bestQues}
export {findchar}