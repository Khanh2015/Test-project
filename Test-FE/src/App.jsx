import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListProduct from "./pages/ListProduct";
import ProductForm from "./pages/ProductForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListProduct />} />
        <Route path="/add-product" element={<ProductForm />} />
        <Route path="/edit-product/:id" element={<ProductForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
