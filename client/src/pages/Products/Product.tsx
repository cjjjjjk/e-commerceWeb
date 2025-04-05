import { useParams } from 'react-router-dom';
import './product.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Loading } from 'shared/components';
const API_URL = process.env.REACT_APP_API_URL
  
const Product: React.FC = function() {
    const [isLoading, SetIsLoading] = useState<boolean>(false);

    
    const { productId} = useParams();
    const [productInfo, SetProductInfo]= useState<any>({})
    const [activeSizeIndex, SetActiveSizeIndex] = useState<number>(0);
    const [activeColorIndex, SetActiveColorIndex] = useState<number>(0);
    const [count, setCount] = useState(1);
    const [isWishlist, SetIsWishlist] = useState<boolean>(false)

    const onWishList= function() {
        SetIsWishlist(!isWishlist);
    }

    useEffect(()=>{
        SetIsLoading(true);
            axios
            .get(`${API_URL}/products/${productId}`, { timeout: 5000 })
            .then((res: any) => {
                SetIsLoading(false);
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
                <div className="container-content d-flex gap-1 flex-column justify-content-start align-items-start">
                    <div className="product-info">
                        <h2>{productInfo.name || "NAME"}</h2>
                        <p><strong>Mô tả:</strong> {productInfo.description || "No description available"}</p>
                        <p className='btn btn-danger'><strong> {productInfo.price?.toLocaleString()} VND</strong></p>
                        <p><strong>Đánh giá:</strong> {productInfo.ratingsAverage} ⭐ ({productInfo.ratingsCount} đánh giá)</p>
                        <p><strong>Còn lại:</strong> {productInfo.stock} sản phẩm</p>
                        <p><strong>Đã bán:</strong> {productInfo.sold}</p>
                        <i><b>Ngày ra mắt:</b> {new Date(productInfo.createdAt).toLocaleDateString()}</i>
                    </div>
                    <div className="product-form d-flex flex-column gap-3">
                        <div className="form-size-color d-flex justify-content-start align-items-center gap-3">
                        {
                            productInfo.size?.map((size: string, index: number) => 
                                (<div
                                    key={index}
                                    onClick={()=> {
                                        SetActiveSizeIndex(index)} 
                                    }
                                    className={`btn btn-light ${index == activeSizeIndex ? "active" : ""}`}>{size}</div>)
                            )
                        }
                        </div>

                        <div className="form-size-color d-flex justify-content-start align-items-center gap-3" >
                        {
                            // color: "Đen-#000"
                            productInfo.colors?.map((color: string, index: number) => 
                                (<div
                                    key={index}
                                    onClick={()=> {
                                        SetActiveColorIndex(index)} 
                                    }
                                    className={`${index == activeColorIndex ? "active" : ""} color-btn`}
                                    style={{padding: "0.25rem"}}
                                    >
                                        <div
                                        style={{ backgroundColor: `${color.split('-').pop()}`, width: "1.25rem", height: "1.25rem", border:"solid 1px gray" }}
                                        >
                                            &nbsp;
                                        </div>
                                    </div>)
                            )
                        }
                        </div>
                        <div className="form-number mb-2 flex-grow-1 d-flex align-items-center justify-content-between rounded-pill">
                            <label><strong>Số lượng:</strong></label>
                            <button
                                className='pi pi-minus'
                                onClick={() => setCount(count - 1)} disabled={count <= 1}>
                            </button>
                            <span className="text-xl font-bold">{count}</span>
                            <button 
                                className='pi pi-plus'
                                onClick={() => setCount(count + 1)} disabled={count >= productInfo.stock}></button>
                        </div>
                    </div>
                    <div className='product-control d-flex justify-content-center align-items-center gap-3'>
                        <button 
                            className='btn product-btn cart-btn d-flex flex-row gap-3 px-4 justify-content-center align-items-center rounded-pill'>
                                <i className="pi pi-shopping-cart"></i>
                                <span>THÊM VÀO GIỎ HÀNG</span>
                        </button>
                        <button 
                            onClick={()=>{
                                onWishList();
                            }}
                            className={`btn product-btn btn-wishlist pi ${isWishlist ? "pi-heart-fill" : "pi-heart"}`}>
                        </button>
                    </div>
                </div>
            </div>
            <br />
            <span className='out-label'>HÌNH ẢNH SẢN PHẨM</span>
            <div className="all-images-container">
                {
                    productInfo.images?.slice(0,10)
                    .map((url: string, index: number) => 
                        (<img key={index} src={url} alt={`Product Image ${index + 1}`} />)
                )
            }
            </div>
            <span className='out-label mt-3'>SẢN PHẨM TRONG DANH MỤC</span>
            <div>
                Đây là phần dành cho sản phẩm khác
            </div>
            <div className='w-100 bg-dark'>
                <br /><br /><br />
                <span className='w-100 text-white'>AUTHOR: HAIHV(cjjjjjk) - PRODUCT PAGE: {productId}</span>
            </div>

        </div>
    )
}

export default Product;

// Product Craw Image sscript :
// console.log(JSON.stringify([...document.querySelectorAll("img")].map(img => img.src).filter(url=> url.split('?').pop()== "width=369")));
// {
//     "createdAt": "2025-03-22T07:55:13.022Z",
//       "name": "Áo thun cho nữ tay ngắn",
//     "description": "Looks like a skirt from the front and pants from the back, making it perfect for active wear.",
//     "price": 293000,
//     "ratingsAverage": 4.1,
//     "ratingsCount": 24,
//     "stock": 120,
//     "sold": 22,
//     "images":
//     ["https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/476602/item/vngoods_03_476602_3x4.jpg?width=369","https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/476602/sub/vngoods_476602_sub7_3x4.jpg?width=369","https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/476602/sub/goods_476602_sub13_3x4.jpg?width=369","https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/476602/sub/goods_476602_sub14_3x4.jpg?width=369"]
//     ,
//     "categoryId": {"$oid": "67de762eb4f5401b6ba84e40"},
//     "size": [
//       "M",
//         "S",
//       "L"
//     ],
//     "colors": [
//       "Đỏ-red",
//       "Trắng-white"
//     ]
// }