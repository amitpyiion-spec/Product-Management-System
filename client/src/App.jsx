import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Products from './components/Products'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProductForm from './components/ProductForm'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Product List */}
        <Route
          path="/"
          element={<Products />}
        />

        {/* Add Product */}
        <Route
          path="/products/add"
          element={<ProductForm />}
        />

        {/* Edit Product */}
        <Route
          path="/products/edit/:id"
          element={<ProductForm />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App
