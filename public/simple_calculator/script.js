let display = document.getElementById("display");

function append(val){
  display.value += val;
}

function clearAll(){
  display.value = "";
}

function deleteLast(){
  display.value = display.value.slice(0,-1);
}

function calculate(){
  try{
    display.value = eval(display.value);
  }catch{
    display.value = "Error";
  }
}