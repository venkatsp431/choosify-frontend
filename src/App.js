import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Components/home";
import Details from "./Components/details";
import Cart from "./Components/cart";
import Checkout from "./Components/checkout";
import Login from "./Authentication/login";
import ProductUpload from "./Components/produpload.js";
import { useEffect, useState } from "react";
import Signup from "./Authentication/signup.js";
import Activation from "./Authentication/activation.js";
import AdminLogin from "./Authentication/adminlogin.js";
import AdminDashboard from "./Components/admindashboard.js";
import ProductEdit from "./Components/editproduct.js";

function App() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://choosify-backend.onrender.com/api/products/all"
        );
        const data = await response.json();
        console.log(data.data);
        setProducts(data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);
  return (
    <div className="App">
      <Routes>
        <Route
          exact
          path="/"
          element={<Home products={products} setProducts={setProducts} />}
        />
        <Route
          path="/details/:id"
          element={<Details products={products} setProducts={setProducts} />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/activation/:activationToken" element={<Activation />} />
        <Route path="/productupload" element={<ProductUpload />} />
        <Route path="/editproduct/:id" element={<ProductEdit />} />
      </Routes>
    </div>
  );
}

export default App;
