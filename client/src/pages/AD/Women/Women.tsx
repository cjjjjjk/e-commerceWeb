import { ProductCardProps } from 'shared/components/product-card/ProductCard';
import { useEffect, useState } from 'react';
import './women.css';
import { FullContent } from 'shared/components';

// Services
import productService from 'pages/Products/services/productService';

const PRODUCT_FILTER = [
  {
    type: "best-seller",
    categoryId: "",
    cateName: "Sản phẩm bán chạy",
    title: "Top sản phẩm được yêu thích",
    des: "Trang phục mọi lứa tuổi đón nhận, yêu thích, đa dạng, phong phú",
    image: "https://im.uniqlo.com/global-cms/spa/res7fa45af738dac6c30bbaf4a275852a6afr.jpg"
  },
  {
    type: "category",
    categoryId: "681adffe977590298c9e0a0c",
    cateName: "Đồ mặc nhà",
    title: "Trang phục pyjama thoải mái",
    des: "Bộ sưu tập đồ mặc nhà với chất liệu mềm mại, thoáng mát.",
    image: "https://im.uniqlo.com/global-cms/spa/resfa01e6896858ad4ddae21ef83d6da147fr.jpg"
  },
  {
    type: "category",
    categoryId: "67d70758802c2af143a8f21d",
    cateName: "Chân váy",
    title: "Dành riêng cho phái đẹp",
    des: "Bộ sưu tập chân váy thời trang, dễ phối đồ.",
    image: "https://im.uniqlo.com/global-cms/spa/res44283ce65858af9de3b4df7ff71e2013fr.jpg"
  },
  {
    type: "category",
    categoryId: "67de762eb4f5401b6ba84e40",
    cateName: "Áo thun",
    title: "Phong cách đơn giản",
    des: "Bộ sưu tập áo thun với nhiều kiểu dáng và màu sắc đa dạng.",
    image: "https://im.uniqlo.com/global-cms/spa/res3e1b5254570f1f7c717578d9c8c570d8fr.jpg"
  }
];

function Women() {
  const [productLists, setProductLists] = useState<ProductCardProps[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "E-COMMERCE"
    const fetchAll = async () => {
      try {
        const allResults = await Promise.all(
          PRODUCT_FILTER.map(async (filter) => {
            if (filter.type === "best-seller") {
              const res = await productService.getBestSellers();
              return res.data.map((item: any) => ({
                id: item._id,
                name: item.name,
                price: item.priceMap?.[Object.keys(item.priceMap || {})[0]],
                imageUrl: item.images[0],
                colors: item.colors,
                isWishlist: false
              }));
            } else if (filter.type === "category") {
              const res = await productService.getByCategoryId(filter.categoryId);
              return res.data.data.products.map((item: any) => ({
                id: item._id,
                name: item.name,
                price: item.priceMap?.[Object.keys(item.priceMap || {})[0]],
                imageUrl: item.images[0],
                colors: item.colors,
                isWishlist: false
              }));
            }
            return [];
          })
        );
        setProductLists(allResults);
      } catch (error) {
        console.error("Error fetching product lists:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="home-container h-100">
      {PRODUCT_FILTER.map((filter, index) => (
        <FullContent
          key={index}
          title={filter.title}
          des={filter.des}
          image={filter.image}
          productList={productLists[index] || []}
          cateLabel={{
            id: filter.categoryId,
            name: filter.cateName,
            crrGender: "Nữ"
          }}
        />
      ))}
      <FullContent
        title="Bộ sưu tập tổng hợp"
        des="Đa dạng bộ sưu tập"
      />
    </div>
  );
}

export default Women;
