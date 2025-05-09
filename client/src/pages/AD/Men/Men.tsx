import './men.css';
import { FullContent } from "../../../shared/components"; 
import { ProductCardProps } from 'shared/components/product-card/ProductCard';
import { useEffect, useState } from 'react';
import productService from 'pages/Products/services/productService';

const PRODUCT_FILTER = [
  {
    type: "category",
    categoryId: "67d70704802c2af143a8f215",
    cateName: "Áo sơ mi",
    image: "https://im.uniqlo.com/global-cms/spa/res456812532c69add5de30714783a16239fr.jpg",
    title: "Bộ sưu tập công sở",
    des: "Trang phục công sở cao cấp, thanh lịch, phù hợp môi trường làm việc.",
    price: "Chỉ từ 500,000đ"
  },
  {
    type: "category",
    categoryId: "681ae266977590298c9e0b4e",
    cateName: "Áo polo",
    image: "https://im.uniqlo.com/global-cms/spa/res776c45622e8711bdccf08f5d39ba4e31fr.jpg",
    title: "Tran phục thoải mái dành cho phái mạnh",
    des: "Bộ sưu tập áo polo với chất liệu thoáng mát, dễ dàng phối đồ.",
  },
  {
    type: "category",
    categoryId: "67de762eb4f5401b6ba84e40",
    cateName: "Áo thun",
    image: "https://im.uniqlo.com/global-cms/spa/res4d2a798dfdbb86f60699d4fa6d6714b5fr.jpg",
    title: "Áo thun ",
    des: "Bộ sưu tập áo thun với nhiều kiểu dáng và màu sắc đa dạng.",
  }
]

function Men() {
  const [productLists, setProductLists] = useState<ProductCardProps[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "E-COMMERCE"
    const fetchAllProducts = async () => {
      try {
        const allResults = await Promise.all(
          PRODUCT_FILTER.map(async filter => {
            const response = await productService.getByCategoryId(filter.categoryId);
            const products = response.data.data.products.map((item: any) => ({
              id: item._id,
              name: item.name,
              price: item.priceMap?.[Object.keys(item.priceMap || {})[0]],
              imageUrl: item.images[0],
              colors: item.colors,
              isWishlist: false,
            }));
            return products;
          })
        );
        setProductLists(allResults);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  return (
    <div className="home-container h-100">
      {PRODUCT_FILTER.map((filter, index) => (
        <FullContent
          key={filter.categoryId}
          title={filter.title}
          des={filter.des}
          price={filter.price}
          image={filter.image}
          productList={productLists[index] || []}
          cateLabel={{
            id: filter.categoryId,
            name: filter.cateName,
            crrGender: "Nam"
          }}
          loading={loading}
        />
      ))}
      <FullContent
        title="BỘ SƯU TẬP THÚ VỊ ĐANG CHỜ SỰ KHÁM PHÁ CỦA BẠN"
        des="Hành trình khach phá những bộ sưu tập thú vị, độc đáo và đầy phong cách."
        image="https://im.uniqlo.com/global-cms/spa/res3a0105bac35d92f859cb07f8b7adfcccfr.jpg"
      />
      <FullContent
        title="Cảm ơn đã ghé thăm E-C SHOP"
        des="Mong rằng bạn đã có một trải nghiệm đầy nghệ thuật và phong cách."
        image="https://im.uniqlo.com/global-cms/spa/res6eecdbb84be037a944bdf43d8468a671fr.jpg"
      />
    </div>
  );
}

export default Men;
