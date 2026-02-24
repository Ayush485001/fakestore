import axios from "axios"
import { useEffect, useState } from "react"
import { Outlet, useNavigate, useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import { FakeStoreCategories } from "../FakeStoreCategories"
import { FakeStoreProductCategory } from "../FakeStoreProductCategory"
import { useCookies } from "react-cookie"
import { ProductCard } from "./ProductCard" // New component for product cards
import './FakeStoreHome.css'

export function FakeStoreHome() {
    const [products, setProducts] = useState([]);
    const [productComponent, setProductComponent] = useState(null);
    const [cookie, setCookie, removeCookie] = useCookies(['userName']);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const param = useParams();

    // Load products from API
    function loadProductsList() {
        setIsLoading(true);
        axios.get(`https://fakestoreapi.com/products/`)
            .then(response => {
                setProducts(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error loading products:", error);
                setIsLoading(false);
            });
    }

    // Filter products based on search query
    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Add to cart function
    const addToCart = (product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id 
                        ? { ...item, quantity: item.quantity + 1 } 
                        : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    // Remove from cart function
        const removeFromCart = (productId) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === productId);
            if (existingItem && existingItem.quantity > 1) {
                return prevItems.map(item =>
                    item.id === productId 
                        ? { ...item, quantity: item.quantity - 1 } 
                        : item
                );
            }
            return prevItems.filter(item => item.id !== productId);
        });
    };

    // Calculate total cart value
    const cartTotal = cartItems.reduce(
        (total, item) => total + (item.price * item.quantity), 0
    );

    // Load the appropriate product component based on route
    function loadProductComponent() {
        if (param.category == null) {
            setProductComponent(
                <div className="product-grid">
                    {isLoading ? (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                            <p>Loading products...</p>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <ProductCard 
                                key={product.id}
                                product={product}
                                onAddToCart={addToCart}
                            />
                        ))
                    ) : (
                        <div className="no-results">
                            <i className="bi bi-search"></i>
                            <h4>No products found</h4>
                            <p>Try adjusting your search query</p>
                        </div>
                    )}
                </div>
            );
        } else {
            setProductComponent(<FakeStoreProductCategory />);
        }
    }

    useEffect(() => {
        if (cookie['userName'] !== undefined) {
            loadProductsList();
        } else {
            alert('Please login first :)');
            navigate('/');
        }
    }, [param, cookie, navigate]);

    useEffect(() => {
        loadProductComponent();
    }, [products, param, isLoading, searchQuery]);

    return (
        <div className="fake-store-home">
            {/* Header/Navigation */}
            <header className="app-header">
                <nav className="navbar">
                    <div className="logo">
                        <Link to="/Home" className="text-decoration-none">
                            FakeStore
                        </Link>
                    </div>
                    
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <i className="bi bi-search"></i>
                    </div>
                    
                    <div className="nav-links">
                        <Link to="/Home" className="nav-link">
                            <i className="bi bi-house-door-fill"></i> Home
                        </Link>
                        <Link to="products/electronics" className="nav-link">
                            Electronics
                        </Link>
                        <Link to="products/jewelery" className="nav-link">
                            Jewelry
                        </Link>
                        <Link to="products/men's clothing" className="nav-link">
                            <i className="bi bi-gender-male"></i> Men
                        </Link>
                        <Link to="products/women's clothing" className="nav-link">
                            <i className="bi bi-gender-female"></i> Women
                        </Link>
                    </div>
                    
                    <div className="user-cart">
                        <button 
                            className="cart-button" 
                            data-bs-toggle="offcanvas" 
                            data-bs-target="#cart-offcanvas"
                        >
                            <i className="bi bi-cart"></i>
                            {cartItems.length > 0 && (
                                <span className="cart-badge">{cartItems.length}</span>
                            )}
                        </button>
                        <div className="user-dropdown">
                            <span className="username">{cookie['userName']}</span>
                            <i className="bi bi-person-circle"></i>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Cart Offcanvas */}
            <div className="offcanvas offcanvas-end" id="cart-offcanvas">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title">Your Shopping Cart</h5>
                    <button className="btn-close" data-bs-dismiss="offcanvas"></button>
                </div>
                <div className="offcanvas-body">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <i className="bi bi-cart-x"></i>
                            <p>Your cart is empty</p>
                            <button 
                                className="btn btn-primary"
                                data-bs-dismiss="offcanvas"
                                onClick={() => navigate('/Home')}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="cart-item">
                                        <img 
                                            src={item.image} 
                                            alt={item.title} 
                                            className="cart-item-image" 
                                        />
                                        <div className="cart-item-details">
                                            <h6>{item.title}</h6>
                                            <div className="cart-item-controls">
                                                <button 
                                                    onClick={() => removeFromCart(item.id)} 
                                                    className="quantity-btn"
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button 
                                                    onClick={() => addToCart(item)} 
                                                    className="quantity-btn"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div className="cart-item-price">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="cart-total">
                                <span>Total:</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <button className="checkout-btn">Proceed to Checkout</button>
                        </>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <main className="main-content">
                <div className="sidebar">
                    <FakeStoreCategories />
                </div>
                <div className="product-container">
                    {productComponent}
                </div>
            </main>

            {/* Footer */}
            <footer className="app-footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h5>About FakeStore</h5>
                        <p>The best fake products for your fake needs since 2023.</p>
                    </div>
                    <div className="footer-section">
                        <h5>Quick Links</h5>
                        <ul>
                            <li><Link to="/Home">Home</Link></li>
                            <li><Link to="products/electronics">Electronics</Link></li>
                            <li><Link to="products/jewelery">Jewelry</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h5>Contact</h5>
                        <p>Email: contact@fakestore.com</p>
                        <p>Phone: (123) 456-7890</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2023 FakeStore. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}