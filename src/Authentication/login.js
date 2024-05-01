import React, { useState } from "react";
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import Base from "../Base/base";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [justifyActive, setJustifyActive] = useState("tab1");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State to track loading status

  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }

    setJustifyActive(value);
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true); // Set loading state to true when login starts
      const loginvalues = { email: mail, password: password };
      const res = await fetch(
        "https://choosify-backend.onrender.com/api/users/login",
        {
          method: "POST",
          body: JSON.stringify(loginvalues),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res1 = await res.json();
      if (res1.token) {
        localStorage.setItem("token", res1.token);
        navigate("/");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false); // Set loading state to false when login ends
    }
  };

  return (
    <>
      <div class="container-fluid bg-secondaryy mb-5">
        <div
          class="d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: "100px" }}
        >
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "20px",
            }}
          >
            <h4>Sample Login Credentials:</h4>
            <p>Email: venkatsp1997@gmail.com</p>
            <p>Password: venkat123</p>
          </div>
          <h1 class="font-weight-semi-bold text-uppercase mb-3">Login</h1>
          <div class="d-inline-flex">
            <p class="m-0">
              <a href="/">Home</a>
            </p>
            <p class="m-0 px-2"></p>
          </div>
        </div>
      </div>
      <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
        <MDBTabs
          pills
          justify
          className="mb-3 d-flex flex-row justify-content-between"
        >
          <MDBTabsItem>
            {/* <MDBTabsLink
              onClick={() => handleJustifyClick("tab1")}
              active={justifyActive === "tab1"}
            >
              Login
            </MDBTabsLink> */}
          </MDBTabsItem>
        </MDBTabs>

        <MDBTabsContent>
          <MDBTabsPane show={justifyActive === "tab1"}>
            <MDBInput
              wrapperClass="mb-4"
              label="Email address"
              id="form1_mail"
              type="email"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
            />
            <MDBInput
              wrapperClass="mb-4"
              label="Password"
              id="form2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* <div className="d-flex justify-content-between mx-4 mb-4">
              <MDBCheckbox
                name="flexCheck"
                value=""
                id="flexCheckDefault"
                label="Remember me"
              />
              <a href="!#">Forgot password?</a>
            </div> */}

            <MDBBtn
              className="mb-4 w-100"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </MDBBtn>
            {error && <p className="text-danger text-center">{error}</p>}
            <p className="text-center">
              Not a member? <a href="/signup">Register</a>
            </p>
          </MDBTabsPane>
          <Link to="/adminlogin">
            <button type="button">Go to Admin Login</button>
          </Link>
        </MDBTabsContent>
      </MDBContainer>
    </>
  );
}

export default Login;
