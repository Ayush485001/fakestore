import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export function FakeStoreCategories(){

    const [categories, setCategories] = useState([]);

    function loadCategory(){
        axios.get(`https://fakestoreapi.com/products/categories`)
        .then(response => {
            setCategories(response.data);
        })
    }

    function LogCategory(){
        console.log(categories);
    }
    
    useEffect(() => {
        loadCategory();
    },[])

    return(
        <div>
            <Link to='/Home'>Go Home</Link>
            <ul className="list-unstyled">
                {categories.map(category => <li key={category}>{category}</li>)}
            </ul>

        </div>
    )
}