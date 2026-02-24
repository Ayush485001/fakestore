import axios from "axios";
import { useState, useEffect } from "react";
import { Link, Outlet, useParams } from "react-router-dom"


export function FakeStoreProductCategory(){
    const [products, setProducts] = useState([{"id":null, "title":"", "price":null, "description":"", "category":"", "image":"", "rating":{"rate":null, "count":null}}]);
    let params = useParams();
    
    function loadProduct(){
        axios.get(`https://fakestoreapi.com/products/category/${params.category}`)
        .then(response => {
            setProducts(response.data);
        })
    }
    
    useEffect(()=>{
        loadProduct();
    },[params])

    return(
        <div className="d-flex" style={{width:'82vw', overflow:'scroll'}}>
            <div className="">
                <div className="d-flex">
                    <h5 className="d-block">{params.category}</h5>
                    {products.map(product => <Link to={`/details/${product.id}`} key={`product-id-${product.id}`}>
                            <div className="mx-2">
                            <img src={product.image} alt={product.title} height='200px' width='200px' />
                            <span>{product.title}</span>
                            </div>
                        </Link>)}
                </div>
            </div>
        </div>
    )
}