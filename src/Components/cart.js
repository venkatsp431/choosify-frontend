import React, { useEffect, useState } from "react";
import Base from "../Base/base";
import { useCart } from "../CreateContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  // const { isAuthenticated, token } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [quantityMap, setQuantityMap] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (token) {
          const response = await fetch(
            "https://choosify-backend.onrender.com/api/users/cart",
            {
              method: "GET",
              headers: {
                "x-auth-token": token,
              },
            }
          );

          if (!response.ok) {
            console.error("Failed to fetch cart items");
            return;
          }

          const responseData = await response.json();
          setCartItems(responseData.cart);

          // Update: Initialize quantity state with default values
          const initialQuantityMap = {};
          responseData.cart.forEach((item) => {
            initialQuantityMap[item._id] = 1; // Set initial quantity to 1
          });
          setQuantityMap(initialQuantityMap);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [token]);
  const handleRemoveItem = async (itemId) => {
    try {
      const response = await fetch(
        `https://choosify-backend.onrender.com/api/users/cart/${itemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to remove item from cart");
        return;
      }

      const responseData = await response.json();
      setCartItems(responseData.cart);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };
  const calculateSubtotal = () => {
    return cartItems.reduce(
      (subtotal, item) => subtotal + item.price * (quantityMap[item._id] || 1),
      0
    );
  };

  // Calculate Total
  const calculateTotal = (subtotal, shippingCost) => {
    return subtotal + shippingCost;
  };
  // Update: Added function to handle quantity increment
  const handleIncrement = (itemId) => {
    setQuantityMap((prevQuantityMap) => ({
      ...prevQuantityMap,
      [itemId]: (prevQuantityMap[itemId] || 0) + 1,
    }));
  };

  // Update: Added function to handle quantity decrement
  const handleDecrement = (itemId) => {
    setQuantityMap((prevQuantityMap) => ({
      ...prevQuantityMap,
      [itemId]: Math.max((prevQuantityMap[itemId] || 0) - 1, 1), // Ensure quantity doesn't go below 1
    }));
  };

  return (
    <div>
      <Base>
        <div class="container-fluid bg-secondaryy mb-5">
          <div
            class="d-flex flex-column align-items-center justify-content-center"
            style={{ minHeight: "100px" }}
          >
            <h1 class="font-weight-semi-bold text-uppercase mb-3">
              Shopping Cart
            </h1>
            <div class="d-inline-flex">
              <p class="m-0">
                <a href="">Home</a>
              </p>
              <p class="m-0 px-2">-</p>
              <p class="m-0">Shopping Cart</p>
            </div>
          </div>
        </div>

        <div class="container-fluid pt-5">
          <div class="row px-xl-5">
            <div class="col-lg-8 table-responsive mb-5">
              {loading ? (
                <p>Loading cart items...</p>
              ) : token ? (
                <table class="table table-bordered text-center mb-0">
                  <thead class="bg-secondaryy text-dark">
                    <tr>
                      <th>Products</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody class="align-middle">
                    {cartItems.map((item, index) => (
                      <tr key={index}>
                        <td class="align-middle">
                          <img
                            src={item.image}
                            alt=""
                            style={{ width: "50px" }}
                          />
                          {item.productName}
                        </td>
                        <td class="align-middle">${item.price}</td>
                        <td class="align-middle">
                          <div
                            class="input-group quantity mx-auto"
                            style={{ width: "100px" }}
                          >
                            <div class="input-group-btn">
                              <button
                                class="btn btn-sm btn-primaryy btn-minus"
                                onClick={() => handleDecrement(item._id)}
                              >
                                <i class="fa fa-minus"></i>
                              </button>
                            </div>
                            <input
                              type="text"
                              class="form-control form-control-sm bg-secondaryy text-center"
                              value={quantityMap[item._id] || 1}
                              readOnly
                            />
                            <div class="input-group-btn">
                              <button
                                class="btn btn-sm btn-primaryy btn-plus"
                                onClick={() => handleIncrement(item._id)}
                              >
                                <i class="fa fa-plus"></i>
                              </button>
                            </div>
                          </div>
                        </td>
                        <td class="align-middle">
                          ${item.price * (quantityMap[item._id] || 1)}
                        </td>
                        <td class="align-middle">
                          <button
                            className="btn btn-sm btn-primaryy"
                            onClick={() => handleRemoveItem(item._id)}
                          >
                            <i className="fa fa-times"></i> Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Please login to view your cart.</p>
              )}
            </div>
            <div class="col-lg-4">
              <div class="card border-secondaryy mb-5">
                <div class="card-header bg-secondaryy border-0">
                  <h4 class="font-weight-semi-bold m-0">Cart Summary</h4>
                </div>
                <div class="card-body">
                  <div class="d-flex justify-content-between mb-3 pt-1">
                    <h6 class="font-weight-medium">Subtotal</h6>
                    <h6 className="font-weight-medium">
                      ${calculateSubtotal()}
                    </h6>
                  </div>
                  <div class="d-flex justify-content-between">
                    <h6 class="font-weight-medium">Shipping</h6>
                    <h6 class="font-weight-medium">$10</h6>
                  </div>
                </div>
                <div class="card-footer border-secondaryy bg-transparent">
                  <div class="d-flex justify-content-between mt-2">
                    <h5 class="font-weight-bold">Total</h5>
                    <h5 className="font-weight-bold">
                      ${calculateTotal(calculateSubtotal(), 10)}
                    </h5>
                  </div>
                  <button
                    class="btn btn-block btn-primaryy my-3 py-3"
                    onClick={() => navigate("/checkout")}
                  >
                    Proceed To Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Base>
    </div>
  );
}

export default Cart;
