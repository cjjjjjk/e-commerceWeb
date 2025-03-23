import axios from 'axios';
import './layout.css'
import React, { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';

// Components
import { Loading } from 'shared/components';
import {ProductCard, ProductCardProps} from 'shared/components/product-card/ProductCard';



const API_URL = process.env.REACT_APP_API_URL;

const Layout: React.FC = function() {
    const [isLoading, SeIsLoading] = useState<boolean>(false);
    const [loadingMessage, SetLoadingMessage] = useState<string> ('Products Loading')
    const location = useLocation()
    // Current Category
    const crrCateId =window.sessionStorage.getItem('crrCateId');
    const [crrCate,SetCrrCate] = useState<any>({}); 
    // Products crrCate
    const [products, SetProducts] = useState<any[]>([])


    useEffect(()=>{
        SeIsLoading(true);
            axios
            .get(`${API_URL}/categories/${crrCateId}`, { timeout: 5000 })
            .then((res: any) => {
                if(res.data) SetCrrCate(res.data);
            })
            .catch((err: any) => {
                if (err.code === "ECONNABORTED") {
                    console.error("Request timeout! Server may be down.");
                } else if (err.response) {
                    console.error(`Error: ${err.response.status} - ${err.response.statusText}`);
                } else {
                    alert('Server NOT WORKING !')
                }
            });
    }, [location.pathname])
    useEffect(()=>{
        axios
        .get(`${API_URL}/products?categoryId=${crrCateId}`, { timeout: 5000 })
        .then((res: any) => {
            SeIsLoading(false);
            SetProducts(res.data.data.products)
            
            if(res.data.data.numOfProducts === 0) {
                SeIsLoading(true);
                SetLoadingMessage("No Products")
            }
        })
        .catch((err: any) => {
            if (err.code === "ECONNABORTED") {
                console.error("Request timeout! Server may be down.");
            } else if (err.response) {
                console.error(`Error: ${err.response.status} - ${err.response.statusText}`);
            } else {
                alert('Server NOT WORKING !')
            }
        });
    }, [crrCateId])

    if(isLoading) return (
        <Loading message={loadingMessage}/> 
    )
    return (
        <div className="layout-full-container position-fixed top-0 left-0 h-100 w-100 d-flex flex-column justify-content-start align-items-center">
            <div className="layout-container d-flex flex-column justify-content-start align-items-center flex-grow-1">
                <div className='list-container w-100 d-flex flex-column'>
                    <span className="list-label">{String(crrCate?.name).toUpperCase() }</span>
                    <div className='products-container flex-grow-1'>
                        {  
                            products.slice(0,8).map((product: any, index: number)=> {
                                const productCard: ProductCardProps = {
                                    imageUrl: product.images[0] || "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/477903/item/vngoods_50_477903_3x4.jpg?width=294",
                                    colors: product.colors || [],
                                    isWishlist: false || false,
                                    name: product.name || "NAMENAME",
                                    price: String(product.price) || "999,999",
                                    id: product._id || "NOTFOUND",
                                }

                                return (
                                    <ProductCard key={index} {...productCard} />
                                )
                            })
                        }
                    </div>
                </div>

            </div>
            <div className='footer bg-black w-100'>
                <br />
                <br />
                <br />
                <span style={{color: "white"}}>AUTHOR : HAIHV CATEVIEW: {crrCateId}</span>
            </div>
        </div>
    );
};

export default Layout;