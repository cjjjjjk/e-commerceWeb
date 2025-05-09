import { useParams } from 'react-router-dom';
import './product.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Loading } from 'shared/components';
import { addToCart, CartItem } from 'shared/services';
import { useDispatch } from 'react-redux';
import { addToast } from 'shared/components/toast/toastSlice';
const API_URL = process.env.REACT_APP_API_URL
  
const Product: React.FC = function() {
    const [isLoading, SetIsLoading] = useState<boolean>(false);

    const dispatch = useDispatch();
    const { productId} = useParams();
    const [productInfo, SetProductInfo]= useState<any>({})
    const [activeSizeIndex, SetActiveSizeIndex] = useState<number>(0);
    const [activeColorIndex, SetActiveColorIndex] = useState<number>(0);
    const [count, setCount] = useState(1);
    const [isWishlist, SetIsWishlist] = useState<boolean>(false)

    const onWishList= function() {
        SetIsWishlist(!isWishlist);
    }

    const showToast = (message: string, type: "success" | "error" | "info", link?: string) => {
        dispatch(addToast({ message, type , link}));
    };

    useEffect(()=>{
        if (!productId) return;
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
    }, [productId ])

    useEffect(() => {
        if (productInfo.name) {
            document.title = `${productInfo.name} |Cho ${productInfo.gender} | E-COMERCE`;
        }
    }, [productInfo.name]);

    const handlerAddToCart = function(){
        const cartItem: CartItem = {
            productId: String(productId),
            id: String(productId),
            name: productInfo.name,
            price: productInfo.priceMap?.[Object.keys(productInfo.priceMap || {})[activeSizeIndex]], 
            quantity: count,
            image: productInfo.images[0],
            size: productInfo.sizes[activeSizeIndex],
            color: productInfo.colors[activeColorIndex]
        }
        showToast("Thêm vào giỏ hàng thành công", 'success')
        addToCart(cartItem);
    }
    
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
                        <p className='btn btn-danger'><strong> {productInfo.priceMap?.[Object.keys(productInfo.priceMap || {})[activeSizeIndex]]?.toLocaleString()} VND</strong></p>
                        <p><strong>Đánh giá:</strong> {productInfo.ratingsAverage} ⭐ ({productInfo.ratingsCount} đánh giá)</p>
                        <p><strong>Sẵn hàng:</strong> {(Object.values(productInfo.stockMap || {}) as number[])[activeSizeIndex] || 0} sản phẩm</p>
                        <p><strong>Đã bán: </strong>{(Object.values(productInfo.soldMap || {}) as number[])[activeSizeIndex] || 0} sản phẩm</p>
                        <i><b>Ngày ra mắt:</b> {new Date(productInfo.createdAt).toLocaleDateString()}</i>
                    </div>
                    <div className="product-form d-flex flex-column gap-3">
                        <div className="form-size-color d-flex justify-content-start align-items-center gap-3">
                        {
                            Object.keys(productInfo.priceMap || {})
                                .filter((size: string) => productInfo.priceMap?.[size] > 0)
                                .map((size: string, index: number) => 
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
                            <strong>Chọn màu:</strong>
                        {
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
                                onClick={() => setCount(count + 1)} disabled={count >= (Object.values(productInfo.stockMap || {}) as number[])[activeSizeIndex]}>
                            </button>
                        </div>
                    </div>
                    <div className='product-control d-flex justify-content-center align-items-center gap-3'>
                        <button 
                            className='btn product-btn cart-btn d-flex flex-row gap-3 px-4 justify-content-center align-items-center rounded-pill'
                            onClick={()=> {handlerAddToCart()}}
                            >
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
            <span className='out-label fs-14 fw-bolder'>HÌNH ẢNH SẢN PHẨM</span>
            <div className="all-images-container">
                {
                    productInfo.images?.slice(0,10)
                    .map((url: string, index: number) => 
                        (<img key={index} src={url} alt={`Product Image ${index + 1}`} />)
                )
            }
            </div>
            <hr />
            <span className='out-label fs-14 fw-bolder'>ĐÁNH GIÁ SẢN PHẨM </span>
            <div className='product-review-container d-flex flex-column justify-content-start align-items-center'>  
            {Array.isArray(productInfo.reviews) && productInfo.reviews.length > 0 ? (
                <div className="container mt-3">
                {productInfo.reviews.map((review: any, index: number) => {
                  const user = review.user || {};
                  const displayName = typeof user === 'object'
                    ? user.displayName || `Ẩn danh (${user._id?.slice(-5) || "???"})`
                    : `Ẩn danh`;
                  const photoUrl = typeof user === 'object' ? user.photoUrl : null;
              
                  return (
                    <div key={index} className="card mb-3 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center gap-2">
                            {photoUrl && (
                              <img
                                src={photoUrl}
                                alt={displayName}
                                className="rounded-circle"
                                style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                              />
                            )}
                            <h6 className="mb-0 text-dark fw-bolder">{displayName}</h6>
                          </div>
                          <small className="text-muted">
                            {new Date(review.createAt).toLocaleDateString()}
                          </small>
                        </div>
                        <p className="mt-2 mb-1">
                          {Array(review.rating).fill(0).map((_, i) => (
                            <span key={i} className="text-warning">&#9733;</span>
                          ))}
                          {Array(5 - review.rating).fill(0).map((_, i) => (
                            <span key={i} className="text-secondary">&#9733;</span>
                          ))}
                        </p>
                        <p className="mb-0">{review.review}</p>
                      </div>
                    </div>
                  );
                })}
              </div>              
                ) : (
                <div className="alert alert-secondary mt-3 w-100" role="alert">
                    Chưa có đánh giá nào cho sản phẩm này.
                </div>
                )}

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
//     "name": "Áo thun cho nữ tay ngắn",
//     "description": "Looks like a skirt from the front and pants from the back, making it perfect for active wear.",
//     "ratingsAverage": 4.1,
//     "ratingsCount": 24,
//     "stockMap": {
//       "S": 40,
//       "M": 40,
//       "L": 40,
//       "XL": 0
//     },
//     "soldMap": {
//       "S": 8,
//       "M": 7,
//       "L": 7,
//       "XL": 0
//     },
//     "priceMap": {
//       "S": 293000,
//       "M": 293000,
//       "L": 293000,
//       "XL": 293000
//     },
//     "images": [
//       "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/476602/item/vngoods_03_476602_3x4.jpg?width=369",
//       "https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/476602/sub/vngoods_476602_sub7_3x4.jpg?width=369",
//       "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/476602/sub/goods_476602_sub13_3x4.jpg?width=369",
//       "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/476602/sub/goods_476602_sub14_3x4.jpg?width=369"
//     ],
//     "categoryId": { "$oid": "67de762eb4f5401b6ba84e40" },
//     "sizes": ["S", "M", "L"],
//     "gender": "Nữ",
//     "colors": [
//       "Đỏ-red",
//       "Trắng-white"
//     ]
//   }