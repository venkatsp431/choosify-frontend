import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import Col from "react-bootstrap/Col";

import Row from "react-bootstrap/Row";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.margin = "";
    };
  }, []);

  const bodyColor = () => {
    document.body.style.backgroundColor = "skyblue";
    document.body.style.margin = "0 auto";
  };
  bodyColor();
  const handleSignup = async () => {
    setInfoMessage("");
    setErrorMessage("");

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
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
    if (result.token) {
      setInfoMessage(
        "Account created successfully. Check your email for activation instructions."
      );

      document.body.style.backgroundColor = "";
      document.body.style.margin = "";

      window.confirm("Press OK to continue") && navigate("/");
    } else if (result.message) {
      if (result.message.includes("duplicate key error")) {
        setErrorMessage("User with this email already exists");
      } else {
        setErrorMessage(result.message);
      }
    }
  };
  return (
    <div className="loginstyles">
      <h3>Welcome</h3>
      {infoMessage && <Alert variant="info">{infoMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
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
            We'll never share your email with anyone else.
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
        <Button size="lg" variant="success" onClick={handleSignup}>
          Sign Up
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
