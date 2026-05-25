import React, {useState} from 'react'
import "./textForm.css";

// function capitalizeWords(text) {
//    return str.replace(/\b\w/g, char => char.toUpperCase()); 
//   }


export default function TextForm(props) {
  const handleUpClick= ()=>{
    // console.log("Uppercase was clicked"+ text);
    let newText = text.toUpperCase();
    setText(newText);
    props.showAlert("Convert into UpperCase!", "success");
  }
  const handleLoClick= ()=>{
    // console.log("Lower was clicked"+ text);
    let newText = text.toLowerCase();
    setText(newText);
    props.showAlert("Convert into LowerCase!", "success");
  }
  // const handleCopy =()=>{
  //   var text =document.getElementById("myBox");
  //   text.select();
  //   navigator.clipboard.writeText(text.value);
  // }
  const handleExtraSpace =()=>{
   let newText = text.split(/[ ]+/);
    setText(newText.join(" "));
    props.showAlert("ExtraSpace removed!", "success");
  }
  const handleCapitalizeClick= ()=>{
    // console.log("Lower was clicked"+ text);
    let newText = text.replace(/\b\w/g, char => char.toUpperCase());
    setText(newText);
    props.showAlert("Convert into CapitazedCase!", "success");
  }
  const handleClearClick= ()=>{
    // console.log("Lower was clicked"+ text);
    let newText = '';
    setText(newText);
    props.showAlert("Text Cleared!", "success");
  }
  const handleReverseText = () => {
  let reversed = text.split("").reverse().join("");
  setText(reversed);
  props.showAlert("Text Reversed!", "success");
}
const handleDownload = () => {
  const element = document.createElement("a");

  const file = new Blob([text], {
    type: "text/plain"
  });

  element.href = URL.createObjectURL(file);
  element.download = "textutils.txt";

  document.body.appendChild(element);
  element.click();

  props.showAlert("Text Downloaded!", "success");
}
  const handleOnChange= (event)=>{
    // console.log("Onchange");
    setText(event.target.value);
  
  }
  const [text, setText] = useState('');
 // setText("new text");//right
  // text= ("new text");//wrong
return (
<>
<div className={`main-container ${props.mode}`}>

  {/* LEFT SIDE */}
  <div className={`left-panel ${props.mode}`}>

    <h1>{props.heading}</h1>

    <textarea
      className={`custom-textarea ${props.mode}`}
      value={text}
      onChange={handleOnChange}
      id="myBox"
      rows="8"
    ></textarea>

   <div className={`button-grid ${props.mode}`}>

  <button className={`custom-btn ${props.mode}`} onClick={handleUpClick}>
    Convert to Uppercase
  </button>

  <button className={`custom-btn ${props.mode}`} onClick={handleLoClick}>
    Convert to Lowercase
  </button>

  <button className={`custom-btn ${props.mode}`} onClick={handleCapitalizeClick}>
    Capitalized Case
  </button>

  <button className={`custom-btn ${props.mode}`} onClick={handleClearClick}>
    Clear
  </button>

  <button className={`custom-btn ${props.mode}`} onClick={handleExtraSpace}>
    Remove Extra Space
  </button>

  <button className={`custom-btn ${props.mode}`} onClick={handleReverseText}>
    Reverse Text
  </button>

  <button className={`custom-btn ${props.mode}`} onClick={handleDownload}>
    Download text as .txt file
  </button>

</div>

  </div>


  {/* RIGHT SIDE */}
  <div className={`right-panel ${props.mode}`}>

    <div className={`glass-card ${props.mode}`}>
      <h2>Your text summary</h2>

      <p>
        {text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length} words and {text.length} characters
      </p>

      <p>
        {text.trim().length === 0 ? 0 : 0.008 * text.trim().split(/\s+/).length} Minutes read
      </p>
    </div>


    <div className={`glass-card ${props.mode}`}>
      <h2>Preview</h2>

      <div className="preview-box">
        <p>
          {text.length > 0
            ? text
            : "Enter something in the textbox above to preview it here"}
        </p>
      </div>
    </div>

  </div>

</div>
</>
)
}
