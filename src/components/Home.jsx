import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axios"; // 🟢 Points to centralized Axios config client
import { useApp } from "../Context/Context"; // 🟢 Consumes memory-safe custom context hook
import unplugged from "../assets/unplugged.png";

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useApp(); 
  const [products, setProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  // 🟢 ADDED: Loading state defaults to true to keep UI responsive during backend cold-starts
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    // 🟢 If data array from context fills up or returns empty from an active server response, stop loading
    if (data) {
      if (data.length > 0) {
        const fetchImagesAndUpdateProducts = async () => {
          const updatedProducts = await Promise.all(
            data.map(async (product) => {
              try {
                const response = await axios.get(
                  `/product/${product.id}/image`,
                  { responseType: "blob" }
                );
                const imageUrl = URL.createObjectURL(response.data);
                return { ...product, imageUrl };
              } catch (error) {
                console.error("Error fetching image for product ID:", product.id, error);
                return { ...product, imageUrl: "placeholder-image-url" };
              }
            })
          );
          setProducts(updatedProducts);
          setLoading(false); // 🟢 Stop loading once image streams finish binding
        };
        fetchImagesAndUpdateProducts();
      } else {
        // If data is valid but explicitly empty (0 items found in backend DB)
        setLoading(false);
      }
    }
  }, [data]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  // 1️⃣ Render Step: Network Connection Loss / General Server Crashes
  if (isError) {
    return (
      <h2 className="text-center" style={{ padding: "18rem" }}>
        <img src={unplugged} alt="Error" style={{ width: '100px', height: '100px' }}/>
      </h2>
    );
  }

  // 2️⃣ Render Step: 🟢 ADDED: Handle Server Cold-Start cleanly with an active structural loader
  if (loading) {
    return (
      <div className="text-center" style={{ padding: "15rem 2rem" }}>
        <div 
          className="spinner-border text-primary" 
          role="status" 
          style={{ width: "3rem", height: "3rem", marginBottom: "1.5rem" }}
        ></div>
        <h3 style={{ fontWeight: "400", color: "#555" }}>Connecting to Cloud Server...</h3>
        <p style={{ color: "#888", fontSize: "0.9rem" }}>
          Render's free tier container is waking up. This may take up to 15 seconds on the first visit.
        </p>
      </div>
    );
  }
  
  // 3️⃣ Main Viewport: Render actual inventory data layout safely
  return (
    <>
      <div
        className="grid"
        style={{
          marginTop: "64px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          padding: "20px",
        }}
      >
        {filteredProducts.length === 0 ? (
          <h2
            className="text-center"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gridColumn: "1 / -1", // Center the empty text fully across the full row grid split layout
              padding: "10rem 0"
            }}
          >
            No Products Available
          </h2>
        ) : (
          filteredProducts.map((product) => {
            const { id, brand, name, price, productAvailable, imageUrl } = product;
            return (
              <div
                className="card mb-3"
                style={{
                  width: "250px",
                  height: "360px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  borderRadius: "10px",
                  overflow: "hidden", 
                  backgroundColor: productAvailable ? "#fff" : "#ccc",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: 'flex-start',
                  alignItems: 'stretch'
                }}
                key={id}
              >
                <Link
                  to={`/product/${id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <img
                    src={imageUrl}
                    alt={name}
                    style={{
                      width: "100%",
                      height: "150px", 
                      objectFit: "cover",  
                      padding: "5px",
                      margin: "0",
                      borderRadius: "10px", 
                    }}
                  />
                  <div
                    className="card-body"
                    style={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "10px",
                    }}
                  >
                    <div>
                      <h5
                        className="card-title"
                        style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}
                      >
                        {name.toUpperCase()}
                      </h5>
                      <i
                        className="card-brand"
                        style={{ fontStyle: "italic", fontSize: "0.8rem" }}
                      >
                        {"~ " + brand}
                      </i>
                    </div>
                    <hr className="hr-line" style={{ margin: "10px 0" }} />
                    <div className="home-cart-price">
                      <h5
                        className="card-text"
                        style={{ fontWeight: "600", fontSize: "1.1rem", marginBottom: '5px' }}
                      >
                        <i className="bi bi-currency-rupee"></i>
                        {price}
                      </h5>
                    </div>
                    <button
                      className="btn-hover color-9"
                      style={{ margin: '10px 25px 0px ' }}
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product);
                      }}
                      disabled={!productAvailable}
                    >
                      {productAvailable ? "Add to Cart" : "Out of Stock"}
                    </button> 
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default Home;
