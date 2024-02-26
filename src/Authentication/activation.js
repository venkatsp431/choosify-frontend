import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Activation = () => {
  const { activationToken } = useParams();
  const [activationMessage, setActivationMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await fetch(
          `https://choosify-backend.onrender.com/api/users/activation/${activationToken}`,
          {
            method: "PUT",
          }
        );
        const result = await response.json();

        if (result.token) {
          setActivationMessage("Successfully Activated");
          localStorage.setItem("token", result.token);
        } else {
          setError(result.message);
        }
      } catch (error) {
        console.error(error);
        setError("Internal Server Error");
      }
    };

    activateAccount();
  }, [activationToken]);

  return (
    <div>
      {activationMessage && (
        <div>
          {" "}
          <p>{activationMessage}</p>{" "}
          <Link to="/">
            <button>Go Home</button>
          </Link>
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default Activation;
