import { useState } from 'react'

import './App.css'
import { BrowserRouter as Router ,Route,Routes } from 'react-router-dom'
import SignUp from './Components/Signup';
import Login  from './Components/Login';
import Navbar from './Components/Navbar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  
  return (
    <>
    
    <Router>
    <Navbar></Navbar>
      <Routes>
        <Route path='/signup' element={<SignUp></SignUp>}></Route>
        <Route path='/signin' element={<Login></Login>}></Route>
      </Routes>
      <ToastContainer></ToastContainer>
    </Router>
    </>
  )
}

export default App
