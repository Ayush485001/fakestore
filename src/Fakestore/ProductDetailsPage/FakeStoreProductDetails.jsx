import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import './FakeStoreProductDetails.css'

export function FakeStoreProductsDetails() {
    const [product, setProduct] = useState({
        id: null,
        title: "",
        price: null,
        description: "",
        category: "",
        image: "",
        rating: { rate: null, count: null }
    });
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [cookie] = useCookies(['userName']);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [activeImage, setActiveImage] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const params = useParams();
    const navigate = useNavigate();

    // Mock product images for gallery (using the same image in different sizes/angles)
    const productImages = [
        product.image,
        product.image,
        product.image,
        product.image
    ];

    function loadProduct() {
        setIsLoading(true);
        axios.get(`https://fakestoreapi.com/products/${params.id}`)
            .then(response => {
                setProduct(response.data);
                loadRelatedProducts(response.data.category);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error loading product:", error);
                setIsLoading(false);
            });
    }

    function loadRelatedProducts(category) {
        axios.get(`https://fakestoreapi.com/products/category/${category}?limit=4`)
            .then(response => {
                setRelatedProducts(response.data.filter(p => p.id !== parseInt(params.id)));
            });
    }

    function addToCart() {
        if (!cookie['userName']) {
            alert('Please login to add items to cart');
            navigate('/');
            return;
        }

        const existingItem = cartItems.find(item => item.id === product.id);
        
        if (existingItem) {
            setCartItems(cartItems.map(item =>
                item.id === product.id 
                    ? { ...item, quantity: item.quantity + quantity } 
                    : item
            ));
        } else {
            setCartItems([...cartItems, { ...product, quantity }]);
        }

        alert(`${quantity} ${product.title} added to cart!`);
        setQuantity(1);
    }

    function handleQuantityChange(change) {
        const newQuantity = quantity + change;
        if (newQuantity > 0 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    }

    useEffect(() => {
        loadProduct();
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="product-detail-loading">
                <div className="spinner"></div>
                <p>Loading product details...</p>
            </div>
        );
    }

    return (
        <div className="product-detail-container">
            {/* Breadcrumb Navigation */}
            <nav className="breadcrumb-nav">
                <Link to="/Home" className="breadcrumb-link">Home</Link>
                <span className="breadcrumb-separator">/</span>
                <Link to={`/products/${product.category}`} className="breadcrumb-link">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </Link>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">{product.title}</span>
            </nav>

            {/* Main Product Section */}
            <div className="product-main">
                {/* Product Gallery */}
                <div className="product-gallery">
                    <div className="thumbnail-container">
                        {productImages.map((img, index) => (
                            <button
                                key={index}
                                className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                                onClick={() => setActiveImage(index)}
                            >
                                <img src={img} alt={`Thumbnail ${index + 1}`} />
                            </button>
                        ))}
                    </div>
                    <div className="main-image">
                        <img 
                            src={productImages[activeImage]} 
                            alt={product.title} 
                            className="product-detail-image"
                        />
                    </div>
                </div>

                {/* Product Info */}
                <div className="product-info">
                    <h1 className="product-title">{product.title}</h1>
                    
                    <div className="product-meta">
                        <div className="product-rating">
                            <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                    <i 
                                        key={i} 
                                        className={`bi bi-star${i < Math.round(product.rating.rate) ? '-fill' : ''}`}
                                    ></i>
                                ))}
                            </div>
                            <span className="rating-count">({product.rating.count} reviews)</span>
                        </div>
                        
                        <div className="product-price">
                            ${product.price.toFixed(2)}
                            {product.price > 50 && (
                                <span className="free-shipping">FREE Shipping</span>
                            )}
                        </div>
                    </div>

                    <div className="product-description">
                        <h3>Description</h3>
                        <p>{product.description}</p>
                    </div>

                    <div className="product-actions">
                        <div className="quantity-selector">
                            <button 
                                className="quantity-btn" 
                                onClick={() => handleQuantityChange(-1)}
                                disabled={quantity <= 1}
                            >
                                -
                            </button>
                            <span className="quantity">{quantity}</span>
                            <button 
                                className="quantity-btn" 
                                onClick={() => handleQuantityChange(1)}
                                disabled={quantity >= 10}
                            >
                                +
                            </button>
                        </div>

                        <button className="add-to-cart-btn" onClick={addToCart}>
                            Add to Cart (${(product.price * quantity).toFixed(2)})
                        </button>

                        <button className="buy-now-btn">
                            Buy Now
                        </button>
                    </div>

                    <div className="product-details">
                        <h3>Details</h3>
                        <ul>
                            <li><strong>Category:</strong> {product.category}</li>
                            <li><strong>Product ID:</strong> {product.id}</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="related-products">
                    <h2>You May Also Like</h2>
                    <div className="related-products-grid">
                        {relatedProducts.map(relatedProduct => (
                            <div key={relatedProduct.id} className="related-product-card">
                                <Link to={`/details/${relatedProduct.id}`}>
                                    <img 
                                        src={relatedProduct.image} 
                                        alt={relatedProduct.title} 
                                        className="related-product-image"
                                    />
                                    <h4 className="related-product-title">{relatedProduct.title}</h4>
                                    <div className="related-product-price">
                                        ${relatedProduct.price.toFixed(2)}
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}