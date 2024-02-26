import React, { useState } from "react";
import Base from "../Base/base";
import { useNavigate } from "react-router-dom";

function ProductUpload() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    dressType: "",
    suitableFor: "",
    oldPrice: 0,
    discountedPrice: 0,
    availableSizes: [],
    productImage: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSizeChange = (e) => {
    const newSize = e.target.value;
    setFormData({
      ...formData,
      availableSizes: [...formData.availableSizes, newSize],
    });
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];

    setFormData({
      ...formData,
      productImage: imageFile,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("productName", formData.productName);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("dressType", formData.dressType);
    formDataToSend.append("suitableFor", formData.suitableFor);
    formDataToSend.append("oldPrice", formData.oldPrice);
    formDataToSend.append("discountedPrice", formData.discountedPrice);

    formData.availableSizes.forEach((size) => {
      formDataToSend.append("availableSizes", size);
    });

    formDataToSend.append("productImage", formData.productImage);

    try {
      const response = await fetch(
        "https://choosify-backend.onrender.com/api/products/postproduct",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      alert("Product edited successfully!");
      navigate("/admindashboard");
      console.log("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <Base>
        <form onSubmit={handleSubmit} style={formStyle}>
          <label style={labelStyle}>
            Product Name:
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          {/* Add more form fields based on your schema */}
          {/* Example: Description */}
          <label style={labelStyle}>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          {/* Example: Dress Type */}
          <label style={labelStyle}>
            Dress Type:
            <input
              type="text"
              name="dressType"
              value={formData.dressType}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          {/* Example: Suitable For */}
          <label style={labelStyle}>
            Suitable For:
            <input
              type="text"
              name="suitableFor"
              value={formData.suitableFor}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          {/* Example: Old Price */}
          <label style={labelStyle}>
            Old Price:
            <input
              type="number"
              name="oldPrice"
              value={formData.oldPrice}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          {/* Example: Discounted Price */}
          <label style={labelStyle}>
            Discounted Price:
            <input
              type="number"
              name="discountedPrice"
              value={formData.discountedPrice}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>

          {/* Example: Available Sizes */}
          <label style={labelStyle}>
            Available Sizes:
            <select onChange={handleSizeChange} style={inputStyle}>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              {/* Add more size options */}
            </select>
            <p>Selected Sizes: {formData.availableSizes.join(", ")}</p>
          </label>

          <label style={labelStyle}>
            Product Image:
            <input
              type="file"
              onChange={handleImageChange}
              style={inputStyle}
              accept="image/*"
            />
            {formData.productImage && (
              <p>Selected Image: {formData.productImage.name}</p>
            )}
          </label>

          <button type="submit" style={buttonStyle}>
            Submit
          </button>
        </form>
      </Base>
    </div>
  );
}

const formStyle = {
  maxWidth: "600px",
  margin: "auto",
  padding: "20px",
  backgroundColor: "#f4f4f4",
  borderRadius: "8px",
};

const labelStyle = {
  display: "block",
  margin: "10px 0",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  boxSizing: "border-box",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  backgroundColor: "#007bff",
  color: "#fff",
  padding: "10px",
  borderRadius: "4px",
  cursor: "pointer",
};

export default ProductUpload;
