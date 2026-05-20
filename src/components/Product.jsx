import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApp } from "../Context/Context"; // 🟢 CHANGED: Consume clean custom hook context variant
import axios from "../axios"; // 🟢 CHANGED: Point to your centralized config instance

const Product = () => {
  const { id } = useParams();
  // 🟢 CHANGED: Safely extracted from useApp hook
  const { addToCart, removeFromCart, refreshData } = useApp();
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // 🟢 CHANGED: Path made relative to your base cloud URL configuration
        const response = await axios.get(`/product/${id}`);
        setProduct(response.data);
        if (response.data.imageName) {
          fetchImage();
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchImage = async () => {
      try {
        // 🟢 CHANGED: Path made relative to your base cloud URL configuration
        const response = await axios.get(
          `/product/${id}/image`,
          { responseType: "blob" }
        );
        setImageUrl(URL.createObjectURL(response.data));
      } catch (error) {
        console.error("Error fetching product image:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      // 🟢 CHANGED: Path made relative to your base cloud URL configuration
      await axios.delete(`/product/${id}`);
      removeFromCart(id);
      console.log("Product deleted successfully");
      alert("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handlAddToCart = () => {
    addToCart(product);
    alert("Product added to cart");
  };

  if (!product) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Loading...
      </h2>
    );
  }

  return (
    <>
      <div className="containers" style={{ display: "flex" }}>
        <img
          className="left-column-img"
          src={imageUrl}
          alt={product.imageName}
          style={{ width: "50%", height: "auto" }}
        />

        <div className="right-column" style={{ width: "50%" }}>
          <div className="product-description">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: "1.2rem", fontWeight: 'lighter' }}>
                {product.category}
              </span>
              <div className="release-date" style={{ marginBottom: "2rem" }}>
                <h6>Listed : <span> <i> {new Date(product.releaseDate).toLocaleDateString()}</i></span></h6>
              </div>
            </div>
            
            <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", textTransform: 'capitalize', letterSpacing: '1px' }}>
              {product.name}
            </h1>
            <i style={{ marginBottom: "3rem" }}>{product.brand}</i>
            <p style={{ fontWeight: 'bold', fontSize: '1rem', margin: '10px 0px 0px' }}>PRODUCT DESCRIPTION :</p>
            <p style={{ marginBottom: "1rem" }}>{product.description}</p>
          </div>

          <div className="product-price">
            <span style={{ fontSize: "2rem", fontWeight: "bold" }}>
              {"$" + product.price}
            </span>
            <button
              className={`cart-btn ${
                !product.productAvailable ? "disabled-btn" : ""
              }`}
              onClick={handlAddToCart}
              disabled={!product.productAvailable}
              style={{
                padding: "1rem 2rem",
                fontSize: "1rem",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginBottom: "1rem",
              }}
            >
              {product.productAvailable ? "Add to cart" : "Out of Stock"}
            </button>
            <h6 style={{ marginBottom: "1rem" }}>
              Stock Available :{" "}
              <i style={{ color: "green", fontWeight: "bold" }}>
                {product.stockQuantity}
              </i>
            </h6>
          </div>

          <div className="update-button" style={{ display: "flex", gap: "1rem" }}>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleEditClick}
              style={{
                padding: "1rem 2rem",
                fontSize: "1rem",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Update
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={deleteProduct}
              style={{
                padding: "1rem 2rem",
                fontSize: "1rem",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
