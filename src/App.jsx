import { useState } from 'react'

import './App.css'
import { BrowserRouter as Router ,Route,Routes } from 'react-router-dom'
import SignUp from './Components/Signup';
import Login  from './Components/Login';

function App() {
  
  return (
    <>
    <Router>
      <Routes>
        <Route path='/signup' element={<SignUp></SignUp>}></Route>
        <Route path='/signin' element={<Login></Login>}></Route>
      </Routes>
    </Router>
    </>
  )
}

export default App
