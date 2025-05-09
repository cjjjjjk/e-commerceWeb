import "./product-cart.css";
import { useNavigate } from "react-router-dom";

export interface ProductCardProps {
  imageUrl: string;
  colors: string[];
  isWishlist: boolean;
  name: string;
  price: string;
  id: string;
  isCardBorder?: boolean;
}

export const ProductCard = ({
  imageUrl,
  colors,
  isWishlist,
  name,
  price,
  id,
  isCardBorder = false, 
}: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(`/product/${id}`);
      }}
      className={`item-container d-flex flex-column justify-content-start align-content-stretch gap-2 bg-white ${
        isCardBorder ? "rounded-3" : ""
      }`}
    >
      <img src={imageUrl} alt={name} />
      <div className="color-wishlist d-flex gap-2 px-2">
        {colors &&
          colors.map((color: string, index: number) => (
            <div
              className="rounded-circle"
              key={index}
              style={{
                backgroundColor: `${color.split("-").pop()}`,
                width: "1rem",
                height: "1rem",
              }}
            >
              &nbsp;
            </div>
          ))}
        <i className="ms-auto pi pi-heart"></i>
      </div>
      <span className="product-name px-2">{name}</span>
      <span className="product-price mx-2 mb-2 btn btn-danger">
        {price + " VNĐ"}
      </span>
    </div>
  );
};
