import "./product-cart.css"
import { useNavigate } from "react-router-dom";

export interface ProductCardProps {
    imageUrl: string | any,
    colors: string[] | any[],
    isWishlist: boolean | any;
    name: string | any,
    price: string | any,
    id: string | any,
}

export const ProductCard = (productInfo:any| ProductCardProps)=>{
    const navigate = useNavigate();

    return (
        <div
            onClick={()=>{
                navigate(`/product/${productInfo.id}`);
            }}
            className="item-container d-flex flex-column justify-content-start align-content-stretch gap-2"
        >   
            <img src={productInfo.imageUrl} alt="" />
            <div className="color-wishlist d-flex gap-2 px-2">
                {
                    productInfo.colors &&
                    productInfo.colors.map((color: string, index: number)=>{
                        return(
                        <div 
                            className="rounded-circle"
                            key={index}
                            style={{backgroundColor: `${color.split('-').pop()}`, width: '1rem', height: "1rem"}} 
                            >
                                &nbsp;
                        </div>)
                    })
                }
                <i className="ms-auto pi pi-heart"></i>
            </div>
            <span className="product-name px-2">{productInfo.name}</span>
            <span className="product-price mx-2 mb-2 btn btn-danger">{productInfo.price + " VNĐ"}</span>
        </div>
    )
}
