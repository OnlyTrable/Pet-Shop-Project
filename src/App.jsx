import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from "./utils/ScrollToTop";
import { Toaster } from 'react-hot-toast';
import './App.css'

import Header from './components/header'
import Footer from './components/footer'
import BreadcrumbsComponent from './components/breadcrumbs';

// Import page components
import MainPage from './pages/MainPage';
import CategoriesPage from './pages/CategoriesPage';
import SalesPage from './pages/SalesPage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import BasketPage from './pages/BasketPage';
import NotFoundPage from './pages/NotFoundPage';
import AllProductsPage from './pages/AllProductsPage';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header/>
      <BreadcrumbsComponent />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/:id" element={<CategoryPage />} />
        <Route path="/products" element={<AllProductsPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/basket" element={<BasketPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer/>
      <Toaster
        position="top-right"
        containerStyle={{
          top: 90,
        }}
        toastOptions={{
          duration: 3000,
          success: {
            iconTheme: {
              primary: '#0D50FF',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </BrowserRouter>
  )
}

export default App
