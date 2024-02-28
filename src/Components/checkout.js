import React, { useEffect, useRef, useState } from "react";
import Base from "../Base/base";
import {
  useStripe,
  useElements,
  CardElement,
  Elements,
} from "@stripe/react-stripe-js";
import CheckoutForm from "./checkoutform";
import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    addressLine1: "",
    addressLine2: "",
    country: "United States", // Default country
    city: "",
    state: "",
    zipCode: "",
  });

  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async () => {
    try {
      // Validate address fields here if needed

      // Send the address to the backend
      const response = await fetch(
        "https://choosify-backend.onrender.com/api/orders/place-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({ address }),
        }
      );

      if (!response.ok) {
        console.error("Failed to place order");
        return;
      }

      const responseData = await response.json();

      // If order placement is successful, proceed to Stripe payment
      handleStripePayment(responseData.orderId, responseData.amount);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };
  // const elements = useElements();
  const placeOrderBtnRef = useRef(null);
  const placeOrderBtn = placeOrderBtnRef.current;

  const handleStripePayment = async (orderId, amount) => {
    try {
      const stripePromise = loadStripe(
        "pk_test_51O6U5YSArPXaYxkprBzEDdksFyelXU16FzTYVNQpk1tZ5xykp2TXQ4waIH92hrrHh94RgBiojZRrl9XHq8keEJ2100lua9rUs4"
      );
      const stripe = await stripePromise;
      const elements = stripe.elements();

      const cardElement = elements.create("card");

      cardElement.mount("#card-element");

      placeOrderBtn("place-order-btn").addEventListener("click", async () => {
        const { paymentMethod, error } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

        if (error) {
          console.error("Payment method creation failed:", error);
          return;
        }

        const paymentResponse = await fetch(
          "https://choosify-backend.onrender.com/api/products/make-payment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({
              orderId,
              amount,
              paymentMethod: paymentMethod.id,
            }),
          }
        );

        if (!paymentResponse.ok) {
          console.error("Payment failed");
          return;
        }

        const paymentData = await paymentResponse.json();

        // Confirm the payment on the client side
        const { paymentIntent, error: paymentError } =
          await stripe.confirmCardPayment(paymentData.clientSecret, {
            payment_method: paymentMethod.id,
          });

        if (paymentError) {
          console.error("Payment confirmation failed:", paymentError);
          return;
        }

        console.log("Payment successful:", paymentIntent);

        alert("Order placed successfully!");
      });
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch(
          "https://choosify-backend.onrender.com/api/users/cart",
          {
            method: "GET",
            headers: {
              "x-auth-token": localStorage.getItem("token"),
            },
          }
        );

        if (!response.ok) {
          console.error("Failed to fetch cart items");
          return;
        }

        const responseData = await response.json();
        setCartItems(responseData.cart);

        const subtotal = responseData.cart.reduce(
          (subtotal, item) => subtotal + item.price,
          0
        );
        setTotalAmount(subtotal + 10);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  return (
    <div>
      <Elements
        stripe={loadStripe(
          "pk_test_51O6U5YSArPXaYxkprBzEDdksFyelXU16FzTYVNQpk1tZ5xykp2TXQ4waIH92hrrHh94RgBiojZRrl9XHq8keEJ2100lua9rUs4"
        )}
      >
        <Base>
          <div class="container-fluid bg-secondaryy mb-3">
            <div
              class="d-flex flex-column align-items-center justify-content-center"
              style={{ minHeight: "130px" }}
            >
              <h1 class="font-weight-semi-bold text-uppercase mb-2">
                Checkout
              </h1>
              <div class="d-inline-flex">
                <p class="m-0">
                  <a href="">Home</a>
                </p>
                <p class="m-0 px-2">-</p>
                <p class="m-0">Checkout</p>
              </div>
            </div>
          </div>

          <div class="container-fluid pt-5">
            <div class="row px-xl-5">
              <div class="col-lg-8">
                <div class="mb-4">
                  <h4 class="font-weight-semi-bold mb-4">Billing Address</h4>
                  <div class="row">
                    <div class="col-md-6 form-group">
                      <label>First Name</label>
                      <input
                        class="form-control"
                        type="text"
                        placeholder="John"
                      />
                    </div>
                    <div class="col-md-6 form-group">
                      <label>Last Name</label>
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Doe"
                      />
                    </div>
                    <div class="col-md-6 form-group">
                      <label>E-mail</label>
                      <input
                        class="form-control"
                        type="text"
                        placeholder="example@email.com"
                      />
                    </div>
                    <div class="col-md-6 form-group">
                      <label>Mobile No</label>
                      <input
                        class="form-control"
                        type="text"
                        placeholder="+123 456 789"
                      />
                    </div>
                    <div class="col-md-6 form-group">
                      <label>Address Line 1</label>
                      <input
                        class="form-control"
                        type="text"
                        placeholder="123 Street"
                      />
                    </div>
                    <div class="col-md-6 form-group">
                      <label>Address Line 2</label>
                      <input
                        class="form-control"
                        type="text"
                        placeholder="123 Street"
                      />
                    </div>
                    <div class="col-md-6 form-group">
                      <label>Country</label>
                      <select class="custom-select">
                        <option selected>United States</option>
                        <option>Afghanistan</option>
                        <option>Albania</option>
                        <option>Algeria</option>
                      </select>
                    </div>
                    <div class="col-md-6 form-group">
                      <label>City</label>
                      <input
                        class="form-control"
                        type="text"
                        placeholder="New York"
                      />
                    </div>
                    <div class="col-md-6 form-group">
                      <label>State</label>
                      <input
                        class="form-control"
                        type="text"
                        placeholder="New York"
                      />
                    </div>
                    <div class="col-md-6 form-group">
                      <label>ZIP Code</label>
                      <input
                        class="form-control"
                        type="text"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
                <div class="collapse mb-4" id="shipping-address">
                  <h4 class="font-weight-semi-bold mb-4">Shipping Address</h4>
                  <div class="row">
                    <div class="col-md-6 form-group">
                      <label>First Name</label>
                      <input
                        class="form-control"
                        type="text"
                        placeholder="John"
                      />
                    </div>
                    <div class="col-md-6 form-group">
                      <label>Last Name</label>
                      <input
                        class="form-control"
                        type="text"
                        placeholder="Doe"
                      />
                    </div>
                    <div class="col-md-6 form-group">
                      <label>E-mail</label>
                      <input
                        class="form-control"
                        type="text"
                        placeholder="example@email.com"
                      />
                    </div>
                    <div class="col-md-6 form-group">
                      <label>Mobile No</label>
                      <input
                        class="form-control"
                        type="text"
                        placeholder="+123 456 789"
                      />
                    </div>
                    <div class="col-md-6 form-group">
                      <label>Address Line 1</label>
                      <input
                        class="form-control"
                        type="text"
                        placeholder="123 Street"
                      />
                    </div>
                    <div class="col-md-6 form-group">
                      <label>Address Line 2</label>
                      <input
                        class="form-control"
                        type="text"
                        placeholder="123 Street"
                      />
                    </div>
                    <div class="col-md-6 form-group">
                      <label>Country</label>
                      <select class="custom-select">
                        <option selected>United States</option>
                        <option>Afghanistan</option>
                        <option>Albania</option>
                        <option>Algeria</option>
                      </select>
                    </div>
                    <div class="col-md-6 form-group">
                      <label>City</label>
                      <input
                        class="form-control"
                        type="text"
                        placeholder="New York"
                      />
                    </div>
                    <div class="col-md-6 form-group">
                      <label>State</label>
                      <input
                        class="form-control"
                        type="text"
                        placeholder="New York"
                      />
                    </div>
                    <div class="col-md-6 form-group">
                      <label>ZIP Code</label>
                      <input
                        class="form-control"
                        type="text"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-4">
                <div class="card border-secondary mb-5">
                  <div class="card-header bg-secondaryy border-0">
                    <h4 class="font-weight-semi-bold m-0">Order Total</h4>
                  </div>
                  <div class="card-body">
                    <h5 class="font-weight-medium mb-3">Products</h5>
                    {cartItems.length > 0 ? (
                      cartItems.map((item, index) => (
                        <div class="d-flex justify-content-between" key={index}>
                          <p>{item.productName}</p>
                          <p>${item.price}</p>
                        </div>
                      ))
                    ) : (
                      <p>Your cart is empty. Add products to proceed.</p>
                    )}
                    <hr class="mt-0" />
                    <div class="d-flex justify-content-between mb-3 pt-1">
                      <h6 class="font-weight-medium">Subtotal</h6>
                      <h6 class="font-weight-medium">${totalAmount - 10}</h6>
                    </div>
                    <div class="d-flex justify-content-between">
                      <h6 class="font-weight-medium">Shipping</h6>
                      <h6 class="font-weight-medium">$10</h6>
                    </div>
                  </div>
                  <div class="card-footer border-secondary bg-transparent">
                    <div class="d-flex justify-content-between mt-2">
                      <h5 class="font-weight-bold">Total</h5>
                      <h5 class="font-weight-bold">${totalAmount}</h5>
                    </div>
                  </div>
                </div>
                <div class="card border-secondary mb-5">
                  <div class="card-header bg-secondaryy border-0">
                    <h4 class="font-weight-semi-bold m-0">Payment</h4>
                  </div>
                  <div class="card-body">
                    <div class="">
                      <div class="custom-control custom-radio">
                        <input
                          type="radio"
                          class="custom-control-input"
                          name="payment"
                          id="stripe"
                        />
                        <label class="custom-control-label" for="stripe">
                          Stripe
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="card-footer border-secondary bg-transparent">
                    <div id="card-element"></div>

                    <CheckoutForm handleStripePayment={handleStripePayment} />

                    <button
                      class="btn btn-lg btn-block btn-primary font-weight-bold my-3 py-3"
                      onClick={handlePlaceOrder}
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Base>
      </Elements>
    </div>
  );
}

export default Checkout;
