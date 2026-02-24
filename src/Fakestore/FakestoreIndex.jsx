import { BrowserRouter, Link, Routes, Route } from "react-router-dom"
import { FakeStoreHome } from "./Homepage/FakeStoreHome"
import { FakeStoreCategories } from "./FakeStoreCategories"
import { FakeStoreProductCategory } from "./FakeStoreProductCategory"
import { FakeStoreProductsDetails } from "./ProductDetailsPage/FakeStoreProductDetails"
import { FakeStoreLoginPage } from "./FakeStoreLoginPage"

export function FakeStoreIndex(){
    return(
        <div style={{overflow:'hidden'}}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<FakeStoreLoginPage/>}></Route>
                    <Route path="/Home" element={<FakeStoreHome/>}>
                        <Route path="products/:category" element={<FakeStoreProductCategory/>}>
                        </Route>
                    </Route>
                    <Route path="/details/:id" element={<FakeStoreProductsDetails/>}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}