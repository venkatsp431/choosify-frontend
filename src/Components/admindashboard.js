// AdminDashboard.js

import React, { useState, useEffect } from "react";
import { Pagination } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteAlert, setDeleteAlert] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  useEffect(() => {
    // Fetch products from your API endpoint
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://choosify-backend.onrender.com/api/products/all"
        );
        const data = await response.json();
        setProducts(data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };
  const handleRemoveProduct = async (productId) => {
    try {
      const response = await fetch(
        `https://choosify-backend.onrender.com/api/products/delete/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Remove the product from the local state
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
        // Show alert for successful deletion
        setDeleteAlert("Product deleted successfully!");
        // Clear the alert after 3 seconds
        setTimeout(() => setDeleteAlert(null), 3000);
      } else {
        console.error("Error deleting product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container m-4">
      <div className="row">
        {/* Side Navigation */}
        <nav className="col-md-2 d-none d-md-block bg-light sidebar">
          <div className="sidebar-sticky">
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link to="/admin/dashboard" className="nav-link active">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/admin/products" className="nav-link">
                  Products
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">E-Shopper</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <Link to="/productupload" className="btn btn-primary">
                Add Product
              </Link>
            </div>
          </div>
          {deleteAlert && (
            <div className="alert alert-success" role="alert">
              {deleteAlert}
            </div>
          )}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              <h2>Product List</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product) => (
                    <tr key={product._id}>
                      <td>{product._id}</td>
                      <td>{product.productName}</td>
                      <td>{product.description}</td>
                      <td>Rs. {product.discountedPrice}</td>
                      <td>
                        <Link
                          to={`/editproduct/${product._id}`}
                          className="btn btn-warning btn-sm mr-2"
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveProduct(product._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination>
                {Array.from(
                  { length: Math.ceil(products.length / productsPerPage) },
                  (_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  )
                )}
              </Pagination>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
