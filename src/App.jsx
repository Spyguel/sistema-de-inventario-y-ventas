import React from 'react';
import Login from './pages/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;