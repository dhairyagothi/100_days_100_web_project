// APPROACH TO MAKE THE APP WORK
/*
1. Make the canvas draw line from its previous position on canvas to its current position
2. This happens for the event, mousemove
3. To make sure user should also click, we set is_drawing variable to true when mouse is pressed.
4. When mouse button is lifted, we set is_drawing to false.
5. To make an eraser, simply set the color of line to the background color. 
And make the option to change line color hidden when eraser is selected.
6. Set the option back to visible when the user clicks on the brush option.
7. For clear button, simply make a clearRect as big as canvas, with background color equal to bg color.
*/

// -------------------------------------------------------------
// Start the script only when entire DOM content is loaded
// -------------------------------------------------------------

document.addEventListener('DOMContentLoaded', start_script);

// A function that manages working of the entire application.

function start_script(){
    // -------------------------------------------------------------
    // SELECTING OUR DOM CONTENTS
    // -------------------------------------------------------------

    // SELECT THE DIV THAT REPRESENT BRUSH AND ERASER. ALSO SELECT THE ERASER ITSELF

    // the clickable div representing brush
    const brush_icon = document.querySelector("#brush");
    // the clickable div representing eraser
    const eraser_icon = document.querySelector("#eraser");
    // the actual eraser
    const eraser = document.querySelector('.eraser')

    // SELECT THE COLOR PICKERS OF OUR APP

    // select the container for showing and selecting line color
    const line_color_container = document.querySelector('.line-color-container');
    // brush color picker
    const color = document.querySelector("#color-picker");
    // canvas background color picker
    const canvas_bg_color = document.querySelector("#bg-color")

    // SELECT THE TEXT THAT SHOWS THE CURRENT PEN AND ITS SIZE
    const width_text = document.querySelector(".width-text")
    const width_val = document.querySelector(".width-val");

    // SELECT THE BUTTONS THAT MANIPULATE SIZE OF PEN
    const inc_btn = document.querySelector("button.inc-width");
    const dec_btn = document.querySelector("button.dec-width");

    // SELECT THE MAJOR BUTTONS - CLEAR BUTTON AND DOWNLOAD BUTTON
    const clear_btn = document.querySelector(".clear");
    const download_btn = document.querySelector("#download");

    // SELECT THE CANVAS ITSELF
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // -------------------------------------------------------------
    // SOME DEFAULT VALUES THAT WE BEGIN WITH
    // -------------------------------------------------------------

    let prevX = null;
    let prevY = null;
    let current_X = 0;
    let current_Y = 0;
    let mouse_coords = null;
    let is_drawing = false;
    let choice = "Brush";
    const BG_COLOR = "#ffffff";
    const PEN_COLOR = "#000000";

    // Display the initial Values of pen and its size
    setChoice()

    // initial size display
    if (choice === "Brush"){
        ctx.lineWidth = 2;
        width_val.textContent = `${ctx.lineWidth}`;
    }

    else{
        ctx.lineWidth = 20;
        width_val.textContent = `${eraser.offsetWidth}`;
    }
    // set initial colors
    color.value = PEN_COLOR;
    canvas_bg_color.value = BG_COLOR;

    console.log(color.value);
    console.log(canvas_bg_color.value);

    // initial pen color
    ctx.strokeStyle = PEN_COLOR;
    // initial canvas background
    canvas.style.backgroundColor = BG_COLOR;

    // -------------------------------------------------------------
    // DEFINING UTILITY FUNCTIONS
    // -------------------------------------------------------------

    // Choose Brush or Eraser

    // display or hide eraser. Display the pen and its size
    function setChoice(){
        width_text.textContent = `${choice} Size :`;
        if (choice === "Eraser"){
            eraser.style.display = "block";
            width_val.textContent = eraser.offsetWidth;
        } else{
            eraser.style.display = "none";
            width_val.textContent = ctx.lineWidth;
        }
    }

    // get mouse coordinates inside the canvas
    function getMousePos(canvas, evt) {
        let rect = canvas.getBoundingClientRect();
        scaleX = canvas.width / rect.width;
        scaleY = canvas.height / rect.height;
    
        return {
            x: (evt.clientX - rect.left) * scaleX,
            y: (evt.clientY - rect.top) * scaleY
        }
    }

    // get eraser dimensions
    function getEraserDimensions(){
        let width = eraser.offsetWidth;
        let height = eraser.offsetHeight;
        return {w: width, h: height};
    }


    // set the new values of eraser and display them
    function setAndDisplayEraserDimensions(action){
        eraser_dims = getEraserDimensions();

        if (action === "+"){
            eraser_dims.w += 1;
            eraser_dims.h += 1;
        }
        else if (action === "-"){
            eraser_dims.w -= 1;
            eraser_dims.h -= 1;
            if(eraser_dims.w <= 0){ eraser_dims.w = 1}
            if(eraser_dims.h <= 0){ eraser_dims.h = 1}
        }


        ctx.lineWidth = eraser_dims.w;
        // console.log("Eraser size is: ", ctx.lineWidth);

        eraser.style.width = `${eraser_dims.w}px`;
        eraser.style.height = `${eraser_dims.h}px`;
        width_val.textContent = `${eraser_dims.w}`;
    }
    

    // function that draws on canvas
    function drawLine(e){
        mouse_coords = getMousePos(canvas, e)

        // set the starting point of the line to draw
        if(prevX == null || prevY == null || !is_drawing){
            prevX = mouse_coords.x;
            prevY = mouse_coords.y;
            return;
        }
        
        // set the current point, till which we draw line
        current_X = mouse_coords.x;
        current_Y = mouse_coords.y;

        // draw line
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(current_X, current_Y);
        ctx.stroke();

        // set prev point to current point for next points
        prevX = current_X;
        prevY = current_Y;
    }

    // -------------------------------------------------------------
    // DEFINING EVENT LISTENERS
    // -------------------------------------------------------------

    // when brush icon is clicked, it should be shown as active
    brush_icon.addEventListener('click', ()=>{
        eraser_icon.classList.remove("active");
        brush_icon.classList.add("active");
        choice = "Brush";
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        color.value = '#000000'
        line_color_container.style.display = "block";
        line_color_container.style.display = "flex";

        // display the pen and its size
        setChoice()
    });

    // when eraser icon is clicked, it should be shown as active
    eraser_icon.addEventListener('click', ()=>{
        brush_icon.classList.remove('active');
        eraser_icon.classList.add("active");
        choice = "Eraser";
        color.value = canvas_bg_color.value;
        ctx.strokeStyle = `${canvas_bg_color.value}`;
        line_color_container.style.display = "none";

        // display the pen and its size
        setChoice()

        // make the eraser trace mouse coordinates
    })

    // Functionality of our Width Controller Buttons
    inc_btn.addEventListener('click', ()=>{
        if (choice === "Brush"){
            ctx.lineWidth++;
            width_val.textContent = `${ctx.lineWidth}`;
        }
        else{
            setAndDisplayEraserDimensions("+")
        }
    })

    dec_btn.addEventListener('click', ()=>{
        if (choice === "Brush"){
            ctx.lineWidth--;
            if (ctx.lineWidth <=0){ctx.lineWidth = 1}
            width_val.textContent = `${ctx.lineWidth}`;
        }
        else{
            setAndDisplayEraserDimensions("-")
        }
    })

    // Functionality to Change color of the brush
    color.addEventListener('change', (e)=>{
        if (choice === "Brush"){
            ctx.strokeStyle = `${color.value}`;
        }
    })

    // functionality to add background color to canvas
    canvas_bg_color.addEventListener('change', ()=>{
        canvas.style.backgroundColor=`${canvas_bg_color.value}`;
    })

    // -------------------------------------------------------------
    // DRAWING ON CANVAS
    // -------------------------------------------------------------

    // 1. first see if we should draw or not
    canvas.addEventListener("mousedown", (e) => {
        is_drawing = true;
    });

    canvas.addEventListener("mouseup", (e) => {
        is_drawing = false
    });


    // 2. now make a line wherever the mouse goes
    canvas.addEventListener("mousemove", drawLine);


    // Adding functionality to our clear and download buttons

    clear_btn.addEventListener("click", () => {
        ctx.fillStyle = canvas_bg_color.value;
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    })

    download_btn.addEventListener("click", () => {
        let data = canvas.toDataURL("image/png")
        let a = document.createElement("a")
        a.href = data
        a.download = "drawing.png"
        a.click()
    })
}