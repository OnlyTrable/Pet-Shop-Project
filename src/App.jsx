import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'

import Header from './components/header'
import Footer from './components/footer'

// Import page components
import MainPage from './pages/MainPage';
import CategoriesPage from './pages/CategoriesPage';
import ProductsPage from './pages/ProductsPage';
import SalesPage from './pages/SalesPage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import BasketPage from './pages/BasketPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/:id" element={<CategoryPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/basket" element={<BasketPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
