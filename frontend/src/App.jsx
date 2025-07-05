import React from 'react'
import Login from './pages/Login'
import SignUp from './pages/Signup'
import {BrowserRouter as Router , Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import { Toaster } from './components/ui/toast'

const App  = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/home' element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        } />
      </Routes>
      <Toaster />
    </Router>
  )
}
export default App