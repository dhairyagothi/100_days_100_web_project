const fileName = "4SvKgmIrnw7KodjP";
import { Application } from "https://esm.sh/@splinetool/runtime";
const canvas = document.getElementById('canvas3d');
const app = new Application(canvas);
const urlParams = new URLSearchParams(window.location.search);
const colorValue = urlParams.size > 1 ? urlParams.get('destinationValue') : 3.2;

//const myVariables = { displayText: 'Chris!', mySize: 350 };
app.load(`https://prod.spline.design/${fileName}/scene.splinecode`)

