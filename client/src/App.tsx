import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import NewFormPage from "./pages/NewForm";

function App() {
  const [text, setText] = useState('loading...');
  useEffect(() => {
    fetch('/api/helloworld')
    .then((resp:any) => resp.json())
    .then((data:any) => setText(data['data']));
  });
  return (
    <div className="App">
      <NewFormPage/>
    </div>
  );
}

export default App;
