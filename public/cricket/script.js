let score;
let scorestr=localStorage.getItem('SCORE');
resetscore(scorestr);

function resetscore(scorestr){
 score=scorestr?JSON.parse(scorestr):  {  //if 1st condition is !== undefined its run else
                                    // score={ all values equals to 0}.....
   win:0,
   lost:0,                   //1.this helps 1st to clear data from storage..
   tie:0,                    //2.and click refresh in broswer to restart newly..!   hint:you can use refresh button
 };                          // to do both at same-time..

score.display_results=function(){
 return `  won: ${score.win},lost: ${score.lost},tie: ${score.tie}.  `;
 
  };
 showresult();  //clicking reset button the function prints without pass parameters...


 }


function computergeneratechoice(){
 let choice;
 //random choice by computer in between 0 & 3.
let randomnum=Math.random()*3;

if(randomnum>0 && randomnum<=1){
 return 'Bat';
}
else if(randomnum >1 && randomnum<=2){
 return 'Ball';
}
else{
 return 'stump';
}

//return choice;
//cmpmsg='computer has chosen:'+computerchoice;
}


// let total=0;


function getresult(usermove,cmpchoice){
 if(usermove==='Bat'){
   //total++;
   if(cmpchoice==='Bat'){
   score.tie+=1;
   return 'its a tie';
   }
   else if(cmpchoice==='Ball'){
     score.win++;
   return 'user won';
   }
   else
   {
     score.lost++;
     return 'computer has won';
   }
 }
 else if(usermove==='Ball'){
   //total++;
   if(cmpchoice==='Ball'){
     score.tie+=1;
   return 'its a tie';
   }
   else if(cmpchoice==='Bat'){
     score.lost+=1;
     return 'computer won';
   }
   else
   {
     score.win+=1;
     return 'user won';
   }
 }
 else if(usermove==='stump'){
  //  total++;
   if(cmpchoice==='stump'){
     score.tie+=1;
     return 'its a tie';
   }
   else if(cmpchoice==='Ball'){
     score.lost+=1;
     return 'computer has won';
   }
   else
   {
     score.win+=1;
     return 'user won';
   }
 }
}



 function showresult(usermove,cmpchoice,result){

 localStorage.setItem('SCORE',JSON.stringify(score));   
 
 document.querySelector('#user-move').innerHTML=  
 usermove ? `user_chosen:  ${usermove}` : '';
 document.querySelector('#computer-move').innerHTML=
 cmpchoice ? `computer_chosen:  ${cmpchoice}` : '';
 document.querySelector('#result').innerHTML= result || '';
 document.querySelector('#score').innerHTML=`score:  ${score.display_results()}`;

 
   //alert( `1.user chosen: ${usermove} \n2.computer chosen:${cmpchoice} \n3.the result is:${result}\n ${score.display_results()}`);


}

