import { useState } from 'react'

import './App.css'
import { BrowserRouter as Router ,Route,Routes } from 'react-router-dom'
import SignUp from './Components/Signup';
import Login  from './Components/Login';
import Home from './Components/Home'
import Navbar from './Components/Navbar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExpenseForm from './Components/ExpenseForm';
import ExpenseTable from './Components/ExpenseTable';
import Income from './Components/Income'
import Budget from './Components/Budget';
import Category  from './Components/Category';
import Debt from './Components/Debt'
import Recurring from './Components/Recurring'
function App() {
  
  return (
    <>
    
    <Router>
    <Navbar></Navbar>
      <Routes>
        <Route path='/signup' element={<SignUp></SignUp>}></Route>
        <Route path='/signin' element={<Login></Login>}></Route>
        <Route path='/home' element={<Home></Home>}></Route>
        {/* <Route path='/expence' element={<ExpenseForm/>}></Route> */}
        <Route path='/expencetable' element={<ExpenseTable></ExpenseTable>}></Route>
        <Route path='/incometable' element={<Income></Income>}></Route>
        <Route path='/budget' element={<Budget></Budget>}></Route>
        <Route path='/category' element={<Category></Category>}></Route>
        <Route path='/debt' element={<Debt></Debt>}></Route>
        <Route path='/recurring' element={<Recurring></Recurring>}></Route>
     
      </Routes>
      <ToastContainer></ToastContainer>
    </Router>
    </>
  )
}

export default App
