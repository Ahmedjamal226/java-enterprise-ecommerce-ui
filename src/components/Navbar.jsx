import React, { useEffect, useState } from "react";
import Home from "./Home";
import axios from "../axios"; // 🟢 CHANGED: Points to your centralized Axios config instead of raw axios
import { useApp } from "../Context/Context"; // 🟢 ADDED: Import your custom context hook

const Navbar = ({ onSelectCategory, onSearch }) => {
  const { cart } = useApp(); // 🟢 ADDED: Extract the live cart array from your context layer

  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };
  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 🟢 CHANGED: Using path relative to your baseURL config
      const response = await axios.get("/products");
      setSearchResults(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true);
      try {
        // 🟢 CHANGED: Using path relative to your baseURL config
        const response = await axios.get(`/products/search?keyword=${value}`);
        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
        console.log(response.data);
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };
  
  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const categories = [
    "Laptop",
    "Headphone",
    "Mobile",
    "Electronics",
    "Toys",
    "Fashion",
  ];
  
  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg fixed-top">
          <div className="container-fluid">
            <a 
              className="navbar-brand" 
              href="https://www.linkedin.com/in/ahmed-jamal-6a3286228"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontWeight: "bold", letterSpacing: "0.5px" }}
            >
               Ahmed Jamal
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="/">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/add_product">
                    Add Product
                  </a>
                </li>

                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="/"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    ensure-active-item="false"
                  >
                    Categories
                  </a>

                  <ul className="dropdown-menu">
                    {categories.map((category) => (
                      <li key={category}>
                        <button
                          className="dropdown-item"
                          onClick={() => handleCategorySelect(category)}
                        >
                          {category}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="nav-item"></li>
              </ul>
              <button className="theme-btn" onClick={() => toggleTheme()}>
                {theme === "dark-theme" ? (
                  <i className="bi bi-moon-fill"></i>
                ) : (
                  <i className="bi bi-sun-fill"></i>
                )}
              </button>
              <div className="d-flex align-items-center cart">
                <a href="/cart" className="nav-link text-dark position-relative me-3">
                  <i
                    className="bi bi-cart me-1"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    Cart
                  </i>
                  {/* 🟢 ADDED: Dynamic visual pill showing items in local state checkout array */}
                  {cart.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger text-white">
                      {cart.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  )}
                </a>
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={input}
                  onChange={(e) => handleChange(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                {showSearchResults && (
                  <ul className="list-group">
                    {searchResults.length > 0 ? (  
                        searchResults.map((result) => (
                          <li key={result.id} className="list-group-item">
                            <a href={`/product/${result.id}`} className="search-result-link">
                            <span>{result.name}</span>
                            </a>
                          </li>
                        ))
                    ) : (
                      noResults && (
                        <p className="no-results-message">
                          No Product with such Name
                        </p>
                      )
                    )}
                  </ul>
                )}
                <div />
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
