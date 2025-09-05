import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Header from './components/header'
import Footer from './components/footer'
import Body from './components/body'

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="/categories" element={<div>Categories Page</div>} />
        <Route path="/products" element={<div>All products Page</div>} />
        <Route path="/sales" element={<div>All sales Page</div>} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
