import { useParams } from 'react-router-dom';
import './product.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Loading } from 'shared/components';
const API_URL = process.env.REACT_APP_API_URL

const Product: React.FC = function() {
    const [isLoading, SeIsLoading] = useState<boolean>(false);
    
    const { productId} = useParams();

    const [productInfo, SetProductInfo]= useState<any>({})

    useEffect(()=>{
        SeIsLoading(true);
            axios
            .get(`${API_URL}/products/${productId}`, { timeout: 5000 })
            .then((res: any) => {
                SeIsLoading(false);
                SetProductInfo(res.data);
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
    }, [])
    if(isLoading) {
        return <Loading message='Product '/>
    }
    return (
        <div className="product-full-container position-fixed top-0 left-0 h-100 w-100 d-flex flex-column justify-content-start align-items-center">
            <div className="product-container">
                <div className="container-images">
                {
                    productInfo.images?.slice(0, 4)
                        .map((url: string, index: number) => 
                        (<img key={index} src={url} alt={`Product Image ${index + 1}`} />)
                    )
                }
                </div>
                <div className="container-content">
                    <h2>{productInfo.name || "NAME"}</h2>
                    <p><strong>Mô tả:</strong> {productInfo.description || "No description available"}</p>
                    <p><strong>Giá:</strong> {productInfo.price?.toLocaleString()} VND</p>
                    <p><strong>Đánh giá:</strong> {productInfo.ratingsAverage} ⭐ ({productInfo.ratingsCount} đánh giá)</p>
                    <p><strong>Còn lại:</strong> {productInfo.stock} sản phẩm</p>
                    <p><strong>Đã bán:</strong> {productInfo.sold}</p>
                    <i><b>Ngày tạo:</b> {new Date(productInfo.createdAt).toLocaleDateString()}</i>
                </div>
            </div>
        </div>
    )
}

export default Product;