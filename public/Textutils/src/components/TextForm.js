import React, {useState} from 'react'


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
  const handleOnChange= (event)=>{
    // console.log("Onchange");
    setText(event.target.value);
  
  }
  const [text, setText] = useState('');
 // setText("new text");//right
  // text= ("new text");//wrong
  return (
    <>
<div className="container"  style={{color:props.mode==='dark'?'white':'#042743'}}>
  <h1>{props.heading}</h1>
  <div className="mb-3">
  <label htmlFor="myBox"></label>
  <textarea className="form-control" value={text} onChange={handleOnChange} style={{backgroundColor:props.mode==='dark'?'grey':'white', color:props.mode==='dark'?'white':'#042743'}} id="myBox" rows="8"></textarea>
  </div>
  <button className="btn btn-primary mx-1" onClick={handleUpClick}>Convert to Uppercase</button>
  <button className="btn btn-primary mx-1" onClick={handleLoClick}>Convert to Lowercase</button>
  <button className="btn btn-primary mx-1" onClick={handleCapitalizeClick}>Capitalized Case</button>
  <button className="btn btn-primary mx-1" onClick={handleClearClick}>Clear</button>
  {/* <button className="btn btn-primary mx-1" onClick={handleCopy}>Copy</button> */}
  <button className="btn btn-primary mx-1" onClick={handleExtraSpace}>Remove Extra  Space</button>
 </div>
 <div className="container my-3"  style={{color:props.mode==='dark'?'white':'#042743'}}>
  <h2>Your text summary</h2>
  <p> {text.split(" ").length} words and {text.length} characteres</p>
  <p>{0.008 * text.split(" ").length} Minutes read</p>
  <h2>Preview</h2>
  <p>{text.length>0?text:"Enter something in the textbox above to preview it here"}</p>
 </div>
 </>
  )
}
