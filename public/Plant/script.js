let water=0;
let sunlight=0;

function waterclicked(){
    water++;
    changesimage();
}

function sunlightclicked(){
    sunlight++;
    changesimage();
}

function changesimage(){
    if(water==1 && sunlight==1){
        document.getElementById("image").src = "images/sap3.webp";
        document.getElementById("image").title= "Sapling";
        document.getElementById("data").innerHTML= "Sapling";
        
    }
    if(water==2 && sunlight==2){
        document.getElementById("image").src = "images/stage-2-veretation.png";
        document.getElementById("image").title= "Young Plant(Vereation)";
        document.getElementById("data").innerHTML= "Young plant";
    }
    if(water==3 && sunlight==3){
        document.getElementById("image").src = "images/flowering.png";
        document.getElementById("image").title= "Flowering Plant";
        document.getElementById("data").innerHTML= "Flowering Plant";
    }
    if(water==4 && sunlight==4){
        document.getElementById("image").src = "images/R.png";
        document.getElementById("image").title= "Tree";
        document.getElementById("data").innerHTML= "Tree";
    }
}