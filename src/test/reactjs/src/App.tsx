import React from 'react';
import logo from './logo.svg';
import './App.css';
import {ReactBoot} from "./reactbootdev/decorator/ReactBoot";

function App() {
    console.log(`App`)
  return (
    <div className="App">
        <ReactBoot/>
    </div>
  );
}

export default App;
