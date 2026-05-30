
import React, { useState } from 'react';

import './App.css';
import Navbar from './components/Navbar';

import TextForm from './components/TextForm';
import Alert from './components/Alert';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

function App() {
  const [mode , setMode] = useState('light'); //whetherdark mode enable or not
  const[alert, setAlert] = useState(null);
  const showAlert = (message, type)=>{
    setAlert({
      msg: message,
      type:type

  })
  setTimeout(() => {
    setAlert(null)
  }, 2000);
  }
 const toggleMode=()=>{
    if(mode === 'light'){
      setMode ('dark');
      document.body.style.backgroundColor = '#042743';
      showAlert("Dark mode has been enabled","success")
      document.title = "TextUtils - Dark Mode";
      // setInterval(() => {
      //   document.title = "TextUtils is Amazing";
      // }, 2000);
      // setInterval(() => {
      //   document.title = " Install TextUtils Now";
      // }, 1500);
    }else{
       setMode ('light') ;
       document.body.style.backgroundColor = 'white';
       showAlert("Light mode has been enabled","success")
       document.title =  "TextUtils - Light Mode";
    }
  }
  return (
    <>
  {/* <Navbar title="TextUtils"  aboutText="About TextUtils"/> */}
  {/* <Navbar/> */}
  <Router>
  <Navbar className="Textutils"  mode={mode} toggleMode={toggleMode}/>
  <Alert alert={alert} />
  <div className="container my-3">

  <Routes>
         
         
          <Route exact path="/"  element={ <TextForm showAlert={showAlert} heading="Enter the text to analyse"  mode={mode}/>} >
        
          </Route>
        </Routes>
   </div>
  </Router>
    </>
    
  
  );
}

export default App;
