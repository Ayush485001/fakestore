import { Link } from "react-router-dom";

// ProductCard.js
export function ProductCard({ product, onAddToCart }) {
    return (
        <div className="product-card">
            <Link to={`/details/${product.id}`} className="product-image-link">
                <img 
                    src={product.image} 
                    alt={product.title} 
                    className="product-image" 
                />
            </Link>
            <div className="product-info">
                <h3 className="product-title">
                    <Link to={`/details/${product.id}`}>{product.title}</Link>
                </h3>
                <div className="product-meta">
                    <span className="product-price">${product.price}</span>
                    <span className="product-rating">
                        <i className="bi bi-star-fill"></i> {product.rating.rate}
                    </span>
                </div>
                <button 
                    className="add-to-cart-btn"
                    onClick={(e) => {
                        e.preventDefault();
                        onAddToCart(product);
                    }}
                >
                    <i className="bi bi-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    );
}