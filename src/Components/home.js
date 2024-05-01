import React, { useEffect, useState } from "react";
import Base from "../Base/base";
import { Carousel, Button, Card, Row, Col, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Home({ products, setProducts }) {
  const widthstyle = {
    width: "45px",
    height: "45px",
  };
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (products && products.length > 0) {
      setLoading(false);
    }
  }, [products]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products?.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const handleviewdetail = (id) => {
    navigate(`/details/${id}`);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(products.length / productsPerPage);
  return (
    <Base>
      <div>
        <div class="container-fluid mb-5">
          <div class="row border-top px-xl-5">
            <div class="col-lg-12">
              <div
                id="header-carousel"
                class="carousel slide"
                data-ride="carousel"
              >
                <div class="carousel-inner">
                  <div class="carousel-item active" style={{ height: "410px" }}>
                    <img
                      class="img-fluid"
                      src="img/carousel-1.jpg"
                      alt="Image"
                    />
                    <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
                      <div class="p-3" style={{ maxWidth: "700px" }}>
                        <h4 class="text-light text-uppercase font-weight-medium mb-3">
                          10% Off Your First Order
                        </h4>
                        <h3 class="display-4 text-white font-weight-semi-bold mb-4">
                          Fashionable Dress
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div class="carousel-item" style={{ height: "410px" }}>
                    <img
                      class="img-fluid"
                      src="img/carousel-2.jpg"
                      alt="Image"
                    />
                    <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
                      <div class="p-3" style={{ maxwidth: "700px" }}>
                        <h4 class="text-light text-uppercase font-weight-medium mb-3">
                          10% Off Your First Order
                        </h4>
                        <h3 class="display-4 text-white font-weight-semi-bold mb-4">
                          Reasonable Price
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
                <a
                  class="carousel-control-prev"
                  href="#header-carousel"
                  data-slide="prev"
                >
                  <div class="btn btn-dark" style={widthstyle}>
                    <span class="carousel-control-prev-icon mb-n2"></span>
                  </div>
                </a>
                <a
                  class="carousel-control-next"
                  href="#header-carousel"
                  data-slide="next"
                >
                  <div class="btn btn-dark" style={widthstyle}>
                    <span class="carousel-control-next-icon mb-n2"></span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="container-fluid pt-5">
          <div class="text-center mb-4">
            <h2 class="section-title px-5">
              <span class="px-2">Trendy Products</span>
            </h2>
          </div>
          {loading ? (
            // Show loading message while products are loading
            <div className="text-center">Loading...</div>
          ) : (
            <Row className="px-xl-5 pb-3">
              {currentProducts?.map((product, index) => (
                <Col key={index} lg={4} md={6} sm={12} className="pb-1">
                  <Card className="product-item border-0 mb-4">
                    <Card.Header className="product-img position-relative overflow-hidden bg-transparent border p-0">
                      {console.log(
                        "Image Path:",
                        product?.productImage?.imagePath?.replace(/\\/g, "/")
                      )}
                      {product?.productImage?.imagePath ? (
                        <Card.Img
                          variant="top"
                          src={`https://choosify-backend.onrender.com/${product.productImage.imagePath}`}
                          alt=""
                          className="img-fluid w-100"
                        />
                      ) : (
                        <div className="text-center py-5">
                          <p className="text-muted">Image not available</p>
                        </div>
                      )}
                    </Card.Header>
                    <Card.Body className="border-left border-right text-center p-0 pt-4 pb-3">
                      <h6 className="text-truncate mb-3">
                        {product.productName}
                      </h6>
                      <p className="text-muted">{product.description}</p>
                      <div className="d-flex justify-content-center">
                        <h6>${product.discountedPrice}</h6>
                        <h6 className="text-muted ml-2">
                          <del>${product.oldPrice}</del>
                        </h6>
                      </div>
                      <div className="mt-3">
                        <p className="font-weight-bold mb-1">
                          Available Sizes:
                        </p>
                        <ul className="list-unstyled">
                          {product.availableSizes.map((size, index) => (
                            <li key={index}>{size}</li>
                          ))}
                        </ul>
                      </div>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-between bg-light border">
                      <Button
                        variant="link"
                        className="btn-sm text-dark p-0"
                        onClick={() => handleviewdetail(product._id)}
                      >
                        <i className="fas fa-eye text-primary mr-1"></i>View
                        Detail
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
          <Row className="justify-content-center">
            <Col lg={3} md={6} sm={12} className="pb-1">
              <Pagination>
                <Pagination.Prev
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {Array.from({ length: totalPages }, (_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => paginate(currentPage + 1)}
                  disabled={indexOfLastProduct >= products.length}
                />
              </Pagination>
            </Col>
          </Row>
        </div>
      </div>
    </Base>
  );
}

export default Home;
