import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";
import { Alert, CloseButton } from "react-bootstrap";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = "skyblue";
    document.body.style.margin = "0 auto";
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.margin = "";
    };
  }, []);

  const handleSignup = async () => {
    setInfoMessage("");
    setErrorMessage("");
    setLoading(true);

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }
    const signup = { name, email, contact, password };
    const res = await fetch(
      "https://choosify-backend.onrender.com/api/users/signup",
      {
        method: "POST",
        body: JSON.stringify(signup),
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    const result = await res.json();
    console.log(res);
    if (res.ok) {
      setInfoMessage(
        "Account created successfully. Check your email for activation instructions."
      );
      setShowMessage(true);
      window.confirm(
        "Account created successfully. Check your email for activation instructions."
      ) && navigate("/login");
    } else {
      setErrorMessage(result.message || "An error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="loginstyles">
      <h3>Welcome, Please use valid email id for account activation</h3>
      <Alert
        variant="info"
        show={showMessage && !!infoMessage}
        onClose={() => setShowMessage(false)}
        dismissible
      >
        {infoMessage} <CloseButton onClick={() => setShowMessage(false)} />
      </Alert>
      <Alert
        variant="danger"
        show={showMessage && !!errorMessage}
        onClose={() => setShowMessage(false)}
        dismissible
      >
        {errorMessage} <CloseButton onClick={() => setShowMessage(false)} />
      </Alert>
      <Form className="login-form d-grid">
        <Form.Group className="mb-3" controlId="formBasicName">
          <Row className="mb-0">
            <Col>
              <Form.Label>Name</Form.Label>
              <Form.Control
                placeholder="Name"
                value={name || ""}
                onChange={(e) => setName(e.target.value)}
              />
            </Col>
          </Row>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Text className="text-muted">
            Please use valid email for account activation
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Contact</Form.Label>
          <Form.Control
            type="number"
            placeholder="Contact"
            value={contact || ""}
            onChange={(e) => setContact(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password || ""}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Button
          size="lg"
          variant="success"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign Up"}
        </Button>
      </Form>
      <div className="mt-3">
        <p className="text-center">
          Already have an account?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
