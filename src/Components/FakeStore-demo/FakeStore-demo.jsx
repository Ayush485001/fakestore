import { useEffect, useState } from "react"
import { useAjax } from "../../hooks/use-Ajax"
import "./FakeStore-demo.css"
import axios from "axios"

export function FakeStoreDemo() {
    const [productsData, setProductsData] = useState()
    const [categories, setCategories] = useState([]);
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    function handleCart(e, product) {
        e.stopPropagation();
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            const updatedCart = cart.map(item =>    
                item.id === product.id 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item
            );
            setCart(updatedCart);
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
        
        setTotalPrice(prev => prev + product.price);
    }

    function removeFromCart(productId) {
        const productToRemove = cart.find(item => item.id === productId);
        if (productToRemove) {
            if (productToRemove.quantity > 1) {
                const updatedCart = cart.map(item =>
                    item.id === productId 
                        ? { ...item, quantity: item.quantity - 1 } 
                        : item
                );
                setCart(updatedCart);
            } else {
                setCart(cart.filter(item => item.id !== productId));
            }
            setTotalPrice(prev => prev - productToRemove.price);
        }
    }

    function handleSelect(e) {
        setIsLoading(true);
        if (e.target.value === 'all') {
            loadProducts("https://fakestoreapi.com/products/");
        } else {
            loadProducts(`https://fakestoreapi.com/products/category/${e.target.value}`);
        }
    }

    function loadCategory(url) {
        axios.get(url).then(response => {
            const sortedCategories = ['all', ...response.data.sort()];
            setCategories(sortedCategories);
        });
    }

    function loadProducts(url) {
        axios.get(url)
            .then((response) => {
                setProductsData(response.data);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }

    useEffect(() => {
        loadProducts("https://fakestoreapi.com/products/");
        loadCategory("https://fakestoreapi.com/products/categories");
    }, []);

    useEffect(() => {
        const newTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalPrice(newTotal);
    }, [cart]);

    return (
        <div className="fake-store-app">
            {/* ------------Header */}
            <header className="app-header">
                <nav className="navbar">
                    <div className="logo">FakeStore</div>
                    
                    <div className="category-nav">
                        <select onChange={handleSelect} className="category-select">
                            {categories.map((category) => (
                                <option value={category} key={category}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="cart-icon">
                        <button className="cart-button" data-bs-toggle="offcanvas" data-bs-target="#cart-offcanvas">
                            <i className="bi bi-cart"></i>
                            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
                        </button>
                    </div>
                </nav>
            </header>

            {/* ---------------------Cart Offcanvas */}
            <div className="offcanvas offcanvas-end" id="cart-offcanvas">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title">Your Shopping Cart</h5>
                    <button className="btn-close" data-bs-dismiss="offcanvas"></button>
                </div>
                <div className="offcanvas-body">
                    {cart.length === 0 ? (
                        <div className="empty-cart">
                            <i className="bi bi-cart-x"></i>
                            <p>Your cart is empty</p>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items">
                                {cart.map((item) => (
                                    <div key={item.id} className="cart-item">
                                        <img src={item.image} alt={item.title} className="cart-item-image" />
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
                                                    onClick={(e) => handleCart(e, item)} 
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
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <button className="checkout-btn">Proceed to Checkout</button>
                        </>
                    )}
                </div>
            </div>

            {/* -----------------Main Content */}
            <main className="product-grid-container">
                {isLoading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Loading products...</p>
                    </div>
                ) : (
                    <div className="product-grid">
                        {productsData.map((product) => (
                            <div 
                                key={product.id} 
                                className="product-card"
                                onMouseEnter={() => setHoveredProduct(product.id)}
                                onMouseLeave={() => setHoveredProduct(null)}
                            >
                                <div className="product-image-container">
                                    <img 
                                        src={product.image} 
                                        alt={product.title} 
                                        className="product-image" 
                                    />
                                    {hoveredProduct === product.id && (
                                        <div className="quick-view">
                                            <button 
                                                className="quick-view-btn"
                                                onClick={(e) => handleCart(e, product)}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="product-info">
                                    <h4 className="product-title">{product.title}</h4>
                                    <div className="product-meta">
                                        <span className="product-price">${product.price}</span>
                                        <span className="product-rating">
                                            <i className="bi bi-star-fill"></i> {product.rating.rate}
                                        </span>
                                    </div>
                                    {hoveredProduct === product.id && (
                                        <p className="product-description">{product.description}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}