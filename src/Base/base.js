import React, { useEffect, useState } from "react";
import { Button, Dropdown, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Base({ children }) {
  const navigate = useNavigate();
  const [cart, setCart] = useState(0);
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribeError, setSubscribeError] = useState(null);
  const [subscribeSuccess, setSubscribeSuccess] = useState(null);
  useEffect(() => {
    async function getUser() {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://choosify-backend.onrender.com/api/users/profile`,
        {
          method: "GET",
          headers: {
            "x-auth-token": token,
          },
        }
      );
      const data = await res.json();
      // console.log(data);
      console.log(token);
      setCart(data.cart && data.cart.length);
      setUser(data.name);
    }

    if (localStorage.getItem("token")) {
      getUser();
      setLoggedIn(true);
    } else {
      console.log("No token");
      setLoggedIn(false);
    }
  }, []);
  const handleCartClick = () => {
    navigate("/cart");
    console.log("Cart clicked!");
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/login");
  };
  const handleSubscribe = async (e) => {
    e.preventDefault();

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubscribeError("Invalid email address");
      return;
    }

    try {
      const response = await fetch(
        "https://choosify-backend.onrender.com/api/users/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSubscribeSuccess(data.message);
        setSubscribeError(null);
      } else {
        setSubscribeError(data.message);
        setSubscribeSuccess(null);
      }
    } catch (error) {
      console.error(error);
      setSubscribeError("Failed to subscribe");
      setSubscribeSuccess(null);
    }
  };

  return (
    <div>
      <div class="container-fluid">
        <div class="row align-items-center py-3 px-xl-5">
          <div class="col-lg-3 d-none d-lg-block">
            <a href="/" class="text-decoration-none">
              <h1 class="m-0 display-5 font-weight-semi-bold">
                <span class="font-weight-bold border px-3 mr-1">E</span>
                Shopper
              </h1>
            </a>
          </div>
          <div class="col-lg-6 col-6 text-left"></div>
          <div class="col-lg-3 col-6 text-right">
            <a href="" className="btn border" onClick={handleCartClick}>
              <i className="fas fa-shopping-cart text-primaryy"></i>

              <span className="badge text-secondary">{cart}</span>
            </a>
          </div>
        </div>
      </div>

      <div class="container-fluid">
        <div class="row border-top px-xl-5">
          <div class="col-lg-12">
            <nav class="navbar navbar-expand-lg bg-light navbar-light py-3 py-lg-0 px-0">
              <div
                class="collapse navbar-collapse justify-content-between"
                id="navbarCollapse"
              >
                <div class="navbar-nav ml-auto py-0">
                  {loggedIn ? (
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="default"
                        className="text-darker"
                        id="dropdown-basic"
                      >
                        {user}
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="text-pad">
                        <Dropdown.Item onClick={() => navigate("/myprofile")}>
                          View Profile
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>
                          Logout
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : (
                    // User is logged out
                    <Button
                      variant="default"
                      onClick={() => navigate("/login")}
                    >
                      Login
                    </Button>
                  )}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
      <div>{children}</div>

      <div class="container-fluid bg-secondaryy mt-5">
        <div class="row justify-content-md-center pb-3 pt-5 px-xl-5">
          <div class="col-md-6 col-12 py-3">
            <div class="text-center mb-2 pb-2">
              <h2 class="section-title px-5 mb-3">
                <span class="bg-secondaryy px-2">Stay Updated</span>
              </h2>
              <p>You dont miss out on our new products</p>
            </div>
            <Form onSubmit={handleSubscribe}>
              <Form.Group className="input-group">
                <Form.Control
                  type="email"
                  placeholder="Email Goes Here"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div class="input-group-append">
                  <Button type="submit" class="btn btn-primaryy px-4">
                    Subscribe
                  </Button>
                </div>
              </Form.Group>
            </Form>
            {subscribeError && <Alert variant="danger">{subscribeError}</Alert>}
            {subscribeSuccess && (
              <Alert variant="success">{subscribeSuccess}</Alert>
            )}
          </div>
        </div>
      </div>
      <a href="#" class="btn btn-primaryy back-to-top">
        <i class="fa fa-angle-double-up"></i>
      </a>
    </div>
  );
}
export default Base;
