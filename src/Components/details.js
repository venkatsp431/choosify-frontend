import React, { useEffect, useState } from "react";
import Base from "../Base/base";
import { useParams } from "react-router-dom";
import { useCart } from "../CreateContext";

const ShopDetail = ({ products, setProducts }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const selectedProduct = products.find((item) => item._id === id);
    setProduct(selectedProduct);
    console.log(selectedProduct);
  }, []);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const { addToCart } = useCart();

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    try {
      if (!selectedSize) {
        alert("Please select a size before adding to cart.");
        return;
      }

      const response = await fetch(
        "https://choosify-backend.onrender.com/api/users/cart",
        {
          method: "POST",
          headers: {
            "x-auth-token": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productName: product.productName,
            size: selectedSize,
            quantity: quantity,
            price: product.discountedPrice,
            _id: product._id,
          }),
        }
      );

      if (!response.ok) {
        console.error("Failed to add item to cart");
        return;
      }

      const responseData = await response.json();
      addToCart(responseData.cart);

      setIsAddedToCart(true);
      setQuantity(1);
      setSelectedSize("");

      console.log("Item added to cart successfully");
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };
  return (
    <>
      <Base>
        <div className="container-fluid bg-secondaryy mb-5">
          <div
            className="d-flex flex-column align-items-center justify-content-center"
            style={{ minHeight: "150px" }}
          >
            <h1 className="font-weight-semi-bold text-uppercase mb-3">
              Shop Detail
            </h1>
            <div className="d-inline-flex">
              <p className="m-0">
                <a href="/">Home</a>
              </p>
              <p className="m-0 px-2">-</p>
              <p className="m-0">Shop Detail</p>
            </div>
          </div>
        </div>
        {/* Page Header End */}

        {/* Shop Detail Start */}
        <div className="container-fluid py-5">
          <div className="row px-xl-5">
            <div className="col-lg-5 pb-5">
              {/* Product Carousel */}
              {/* Include your product carousel code here */}
            </div>

            <div className="col-lg-7 pb-5">
              <h3 className="font-weight-semi-bold">{product?.productName}</h3>
              <div className="d-flex mb-3">
                <div className="text-primaryy mr-2">
                  <small className="fas fa-star"></small>
                  <small className="fas fa-star"></small>
                  <small className="fas fa-star"></small>
                  <small className="fas fa-star-half-alt"></small>
                  <small className="far fa-star"></small>
                </div>
                <small className="pt-1">(50 Reviews)</small>
              </div>
              <h3 className="font-weight-semi-bold mb-4">
                {product?.discountedPrice}
              </h3>
              <p className="mb-4">{/* Product description */}</p>
              <div className="d-flex mb-3">
                <p className="text-dark font-weight-medium mb-0 mr-3">Sizes:</p>
                <form>{/* Sizes radio buttons */}</form>
              </div>
              <div className="d-flex mb-4">
                <form>
                  {product?.availableSizes.map((size, index) => (
                    <div
                      key={index}
                      className="custom-control custom-radio custom-control-inline"
                    >
                      <input
                        type="radio"
                        className="custom-control-input"
                        id={`size-${index + 1}`}
                        name="size"
                        checked={selectedSize === size}
                        onChange={() => handleSizeChange(size)}
                      />
                      <label
                        className="custom-control-label"
                        htmlFor={`size-${index + 1}`}
                      >
                        {size}
                      </label>
                    </div>
                  ))}
                </form>
              </div>
              <div className="d-flex align-items-center mb-4 pt-2">
                <div
                  className="input-group quantity mr-3"
                  style={{ width: "130px" }}
                >
                  <div className="input-group-btn">
                    <button
                      className="btn btn-primaryy btn-minus"
                      onClick={handleDecrement}
                    >
                      <i className="fa fa-minus"></i>
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-control bg-secondaryy text-center"
                    value={quantity}
                    readOnly
                  />
                  <div className="input-group-btn">
                    <button
                      className="btn btn-primaryy btn-plus"
                      onClick={handleIncrement}
                    >
                      <i className="fa fa-plus"></i>
                    </button>
                  </div>
                </div>
                {isAddedToCart ? (
                  <>
                    <button
                      className="btn btn-success px-3 mr-2"
                      onClick={() => {
                        window.location.href = "/cart";
                      }}
                    >
                      View Cart
                    </button>
                    <span className="text-success">Added to Cart</span>
                  </>
                ) : (
                  <button
                    className="btn btn-primaryy px-3"
                    onClick={handleAddToCart}
                  >
                    <i className="fa fa-shopping-cart mr-1"></i> Add To Cart
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="row px-xl-5">
            <div className="col">
              <div className="nav nav-tabs justify-content-center border-secondaryy mb-4">
                <a
                  className="nav-item nav-link active"
                  data-toggle="tab"
                  href="#tab-pane-1"
                >
                  Description
                </a>
              </div>
              <div className="tab-content">
                <div className="tab-pane fade show active" id="tab-pane-1">
                  <h4 className="mb-3">Product Description</h4>
                  <p>{product?.description}</p>
                  <p>{/* Additional paragraphs if needed */}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Base>
    </>
  );
};

export default ShopDetail;
